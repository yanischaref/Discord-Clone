import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { formatDate, getTimeInRegion } from '../functions/formatDate';
import './styles/Dm.css'
import UserIcon from '../components/UserIcon';

const socket = io.connect('http://localhost:5000');

const DmPage = (props) => {
  // State variables
  const [inputValue, setInputValue] = useState('');
  const [dms, setDms] = useState([]);
  const [dmsUi, setDmsUi] = useState()
  const [userInfoJSX, setUserInfoJSX] = useState([]);

  // Constants
  const { channelID } = useParams()
  const receiverId = Number(channelID)
  const userId = props.userId
  const userData = props.userData
  const showNotification = props.showNotification
  const showProfile = props.showProfile

  // Effect hook to create friend ui
  useEffect(() => {
    // Prevent when dms State is empty
    if (dms.length === 0) return
    const userInfoElmts = <div className='page-topnav-dm-info-container'>
      <img alt='' className='page-topnav-dm-user-img' src={dms.receiverInfo.profile_picture}></img>
      <p className='page-topnav-dm-user-name'>{dms.receiverInfo.name}</p>
    </div>
    setUserInfoJSX(userInfoElmts)
    if (dms.dms.length === 0) {
      const dm_s = <div>No dms yet! Say Hi 😊</div>
      setDmsUi(dm_s)
      return
    }

    var dm_s = dms.dms.map((msg, index) => {
      const sender = msg.sender_id === dms.senderInfo.user_id ? dms.senderInfo : dms.receiverInfo

      if (dms.dms[index - 1]) {
        if (dms.dms[index].sender_id === dms.dms[index - 1].sender_id) {
          const msgTimeMinutes1 = formatDate(dms.dms[index].sent_at).slice(14, 16)
          const msgTimeMinutes2 = formatDate(dms.dms[index - 1].sent_at).slice(14, 16)
          const msgDate1 = formatDate(dms.dms[index].sent_at).slice(0, 13)
          const msgDate2 = formatDate(dms.dms[index - 1].sent_at).slice(0, 13)
          if (msgDate1 === msgDate2) {
            const isCloseInTime = (Math.abs(Number(msgTimeMinutes1) - Number(msgTimeMinutes2)) <= 5)
            if (isCloseInTime) {
              return (
                <div key={msg.dm_id + 2} className='page-content-short-message'>
                  <div className='page-content-short-message-content'>
                    <div className='page-content-short-msg-text'>
                      <p className='page-content-short-msg-info-date'>{formatDate(msg.sent_at).slice(11, 16)}</p>
                      <p className='page-content-short-msg-body'>{msg.dm_body}</p>
                    </div>
                  </div>
                  {sender.user_id === userId && <img alt='' className='page-content-short-msg-delete-icon' onClick={() => deleteDm(msg)} src='/assets/icons/delete.svg'></img>}
                </div>
              )
            }
          }
        }
      }
      return (
        <div key={msg.dm_id + 2} className='page-content-message'>
          <div className='page-content-message-content'>
            <UserIcon userdata={sender} size={'35px'} isShowStatus={false} showProfile={showProfile} />
            <div className='page-content-msg-text'>
              <div className='page-content-msg-info'>
                <p className='page-content-msg-info-name'>{sender.name}</p>
                <p className='page-content-msg-info-date'>{formatDate(msg.sent_at)}</p>
              </div>
              <p className='page-content-msg-body'>{msg.dm_body}</p>
            </div>
          </div>
          {sender.user_id === userId && <img alt='' className='page-content-msg-delete-icon' onClick={() => deleteDm(msg)} src='/assets/icons/delete.svg'></img>}
        </div>
      )
    })
    setDmsUi(dm_s)
  }, [dms, userId])

  // Function to delete a dm
  const deleteDm = (dm) => {
    socket.emit('deleteMessage', dm);
    setDms(prevDms => ({
      ...prevDms,
      dms: prevDms.dms.filter(existingDm => existingDm.dm_id !== dm.dm_id)
    }));
  }

  const receiveToDeleteMessage = (dm_id) => {
    setDms(prevDms => ({
      ...prevDms,
      dms: prevDms.dms.filter(existingDm => existingDm.dm_id !== dm_id)
    }));
  }

  // Function to recieve a new dm
  const receiveNewDm = (dm) => {
    // Check messages outside of the current opened dm
    if (dm.sender_id !== receiverId) {
      showNotification(`${dm.sender_id} Sent you a dm!`, dm.dm_body)
      return;
    }
    setDms(prevDms => ({
      ...prevDms,
      dms: [
        ...prevDms.dms,
        dm
      ]
    }))
  }
  // Function to add a new dm
  const addNewDm = (dm) => {
    socket.emit('sendMessage', dm);
    setDms(prevDms => ({
      ...prevDms,
      dms: [
        ...prevDms.dms,
        dm
      ]
    }))
  }
  // Function to send a new dm
  const handleKeyDown = (event) => {
    if (event.keyCode === 13 || event.key === 'Enter') {
      addNewDm({ sender_id: userId, receiver_id: receiverId, dm_body: inputValue, sent_at: getTimeInRegion('Africa/Algiers') })
      setInputValue('');
    }
  };

  // Effect hook to fetch dms data on component mount
  useEffect(() => {
    fetch(`http://localhost:5000/get-dm/${userId}/${receiverId}`)
      .then(response => response.json())
      .then(data => setDms(data))
      .catch((err) => console.log("Error fetching dms!"))

    // Listen for the connection event when component mounts
    socket.on('newMessage', (newMessage) => receiveNewDm(newMessage))
    socket.on('deletedMessageId', (toDeleteMessage) => {
      receiveToDeleteMessage(toDeleteMessage);
    });

    // Clean up by removing the event listener when component unmounts
    return () => {
      socket.off('deletedMessageId');
      socket.off('newMessage')
    };
  }, [userData, receiverId, userId])

  return (
    <div className='page dm-page'>
      <header className='page-topnav page-topnav-header-dm'>
        {userInfoJSX}
        <div className='page-topnav-dm-settings'>
          <img alt='' className='page-topnav-icons page-top-nav-icons-audio-call' src='/assets/icons/audio-call.png'></img>
          <img alt='' className='page-topnav-icons page-top-nav-icons-video-call' src='/assets/icons/video-call.png'></img>
          <input autoComplete='off' spellCheck="false" className='app-inputs page-topnav-me-input' placeholder='Search'></input>
          <img alt='' className='page-topnav-icons page-top-nav-icons-inbox' src='/assets/icons/inbox.png'></img>
          <img alt='' className='page-topnav-icons page-top-nav-icons-help' src='/assets/icons/help.png'></img>
        </div>
      </header>
      <div className='page-content dm-page-content'>
        <div className='page-content-msgs'>
          {dmsUi}
        </div>
        <input
          placeholder='Message..'
          className='app-inputs page-content-input'
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
        >
        </input>
      </div>
    </div>
  )
}
export default DmPage