import React, { useState, useEffect } from 'react'
import io from 'socket.io-client';
import { formatDate, getTimeInRegion } from '../functions/formatDate';

const socket = io.connect('http://localhost:5000');

const DmPage = (props) => {
  // State variables
  const [inputValue, setInputValue] = useState('');
  const [dms, setDms] = useState([]);
  const [dmsUi, setDmsUi] = useState()

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
        <div key={msg.dm_id} className='dmpage-message'>
          <div className='dmpage-message-content'>
            <img alt='' src={sender.profile_picture} className='dmpage-msg-sender-picture'></img>
            <div className='dmpage-msg-text'>
              <p className='dmpage-msg-info'><b className='dmpage-msg-info-name'>{sender.name}</b><small className='dmpage-msg-info-date'> {formatDate(msg.sent_at)}</small></p>
              <p className='dmpage-msg-body'>{msg.dm_body}</p>
            </div>
          </div>
          <img alt='' className='dm-delete-icon' onClick={() => deleteDm(msg.dm_id)} src='/assets/icons/delete.svg'></img>
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
  const receiveNewDm =(dm) => {
    setDms(prevDms => ({
      ...prevDms,
      dms: [
        ...prevDms.dms,
        dm
      ]
    }));
  }

  // Function to recieve a new dm
  const addNewDm =(dm) => {
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
      addNewDm({ sender_id: userId, receiver_id: receiverId, dm_body: inputValue, dm_id: dms.dms[-1]+1, sent_at: getTimeInRegion('Africa/Algiers') })
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
    socket.on('newMessage', (newMessage) => {
      receiveNewDm(newMessage);
    });

    // Clean up by removing the event listener when component unmounts
    return () => {
      socket.off('sendMessage');
    };
  }, [])

  return (
    <div className='body friends-body'>
      <div className='dmpage'>
        <div className='dmpage-dms'>
          {dmsUi}
        </div>
        <input
          placeholder='Message..'
          className='app-inputs msg-input'
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