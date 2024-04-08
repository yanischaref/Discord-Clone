import React, { useState, useEffect } from 'react'
import io from 'socket.io-client';
import { formatDate, getTimeInRegion } from '../functions/formatDate';
import { fetchData } from '../functions/fetchData'
import './styles/Dm.css'

const socket = io.connect('http://localhost:5000');

const DmPage = (props) => {
  // State variables
  const [inputValue, setInputValue] = useState('');
  const [dms, setDms] = useState([]);
  const [dmsUi, setDmsUi] = useState()
  const [userData, setUserData] = useState([]);
  const [userInfoJSX, setUserInfoJSX] = useState([]);

  // Constants
  const path = window.location.pathname;
  const parts = path.split('/');
  const receiverId = Number(parts[parts.length - 1])
  const userId = Number(props.userId)

  // Effect hook to create friend ui
  useEffect(() => {
    // Prevent when dms State is empty
    if (dms.length === 0) return
    if (dms.dms.length === 0) {
      const dm_s = <div>No dms yet! Say Hi 😊</div>
      setDmsUi(dm_s)
      return
    }

    const dm_s = dms.dms.map((msg, index) => {
      const sender = msg.sender_id === dms.senderInfo[0].user_id ? dms.senderInfo[0] : dms.receiverInfo[0]
      return (
        <div key={msg.dm_id} className='page-content-message'>
          <div className='page-content-message-content'>
            <img alt='' src={sender.profile_picture} className='page-content-msg-sender-picture'></img>
            <div className='page-content-msg-text'>
              <p className='page-content-msg-info'><a href='#'><b className='page-content-msg-info-name'>{sender.name}</b></a><small className='page-content-msg-info-date'> {formatDate(msg.sent_at)}</small></p>
              <p className='page-content-msg-body'>{msg.dm_body}</p>
            </div>
          </div>
          <img alt='' className='page-content-msg-delete-icon' onClick={() => deleteDm(msg.dm_id)} src='/assets/icons/delete.svg'></img>
        </div>
      )
    })
    setDmsUi(dm_s)
  }, [dms])

  // Function to delete a dm
  const deleteDm = (dmId) => {
    fetch(`http://localhost:5000/delete-dm/${userId}/${dmId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  // Function to recieve a new dm
  const receiveNewDm = (dm) => {
    setDms(prevDms => ({
      ...prevDms,
      dms: [
        ...prevDms.dms,
        dm
      ]
    }));
  }

  // Function to recieve a new dm
  const addNewDm = (dm) => {
    socket.emit('sendMessage', dm);
    setDms(prevDms => ({
      ...prevDms,
      dms: [
        ...prevDms.dms,
        dm
      ]
    }));
  }

  // Function to send a new dm
  const handleKeyDown = (event) => {
    if (event.keyCode === 13 || event.key === 'Enter') {
      addNewDm({ sender_id: userId, receiver_id: receiverId, dm_body: inputValue, dm_id: dms.dms[-1] + 1, sent_at: getTimeInRegion('Africa/Algiers') })
      setInputValue('');
    }
  };

  useEffect(() => {
    if (userData.length === 0) return
    const userInfoElmts = <div className='page-topnav-dm-info-container'>
      <img alt='' className='page-topnav-dm-user-img' src={userData.profile_picture}></img>
      <p className='page-topnav-dm-user-name'>"temp"</p>
    </div>
    setUserInfoJSX(userInfoElmts)
  }, [userData])

  // Effect hook to fetch dms data on component mount
  useEffect(() => {
    fetchData(`http://localhost:5000/get-userdata/${userId}`, setUserData)

    fetch(`http://localhost:5000/get-dm/${userId}/${receiverId}`)
      .then(response => response.json())
      .then(data => setDms(data))
      .catch((err) => console.log("Error fetching dms!"))

    // Listen for the connection event when component mounts
    socket.on('newMessage', (newMessage) => {
      receiveNewDm(newMessage);
    });

    // Clean up by removing the event listener when component unmounts
    return () => {
      socket.off('sendMessage');
    };
  }, [])

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