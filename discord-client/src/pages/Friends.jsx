import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../functions/fetchData';
import './styles/Friends.css'

const Friends = (props) => {
  const userId = props.userId
  const navigate = useNavigate();

  // State variables
  const [friendsListJSX, setFriendsListJSX] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [currentTab, setCurrentTab] = useState('friends')

  const createFriendsListJSX = (data) => {
    console.log(data)
    const friends = data.friendsInfo.map(friend => {
      return (
        <div className='friends-list-friend' key={friend.user_id}>
          <div className='friend-container' onClick={() => navigate(`/channel/dm/${friend.user_id}`)}>
            <div className='friend-info'>
              <div className='user-icon-container'>
                <img alt='' className='user-icon' src={friend.profile_picture}></img>
                <div className='user-status-icon-container'>
                  <img alt='' src={friend.status === 'online' ? '/assets/icons/online.png' : friend.status === 'idle' ? '/assets/icons/idle.png' : friend.status === 'donot-disturb' ? '/assets/icons/donot-disturb.png' : '/assets/icons/offline.png'}></img>
                </div>
              </div>
              <p>{friend.name}</p>
            </div>
          </div>
          <img className='friend-delete-icon' onClick={() => console.log("Trying to delete friend")} alt='' src='/assets/icons/delete.svg'></img>
        </div>
      )
    })
    setFriendsListJSX(friends)
  }

  const addFriend = () => {
    console.log("Trying to add friend..")
    fetch('http://localhost:5000/add-friend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Specify the content type as JSON
      },
      body: JSON.stringify({ senderId: userId, receiverUsername: inputValue })
    })
  }

  const getAll = () => {
    fetchData(`http://localhost:5000/get-users`, createFriendsListJSX)
  }
  const getFriends = () => {
    fetchData(`http://localhost:5000/get-friends/${userId}`, createFriendsListJSX)
  }

  const getPending = () => {
    fetchData(`http://localhost:5000/get-pending-friends/${userId}`, createFriendsListJSX)
  }

  const Blocked = () => {
    console.log("Not setup blcoked users yet, coming soon!")
  }

  useEffect(() => {
    console.log("input value is: ", inputValue)
  })

  // Effect hook to fetch data on component mount
  useEffect(() => {
    getFriends()
  }, [])

  return (
    <div className='page friends-page'>
      <header className='page-topnav topnav-header-me'>
        <div className='page-topnav-me-friends-settings topnav-me-friends-settings'>
          <p className='page-topnav-me-friends-settings topnav-friend-setting'>All</p>
          <p className='page-topnav-me-friends-settings topnav-friend-setting'>Friends</p>
          <p className='page-topnav-me-friends-settings topnav-friend-setting'>Pending</p>
          <p className='page-topnav-me-friends-settings topnav-friend-setting'>Blocked</p>
        </div>
        <div className='topnav-me-friends-settings topnav-me-settings'>
          <img alt='' className='page-topnav-icons top-nav-icons-inbox' src='/assets/icons/inbox.png'></img>
          <img alt='' className='page-topnav-icons top-nav-icons-help' src='/assets/icons/help.png'></img>
        </div>
      </header>
      
      <div className='page-content friends-page-content'>
        <div className='add-friend-container'>
          <input onChange={(event) => setInputValue(event.target.value)} placeholder='Friend Username..' className='app-inputs friends-input'></input>
          <button onClick={addFriend} className='app-buttons'>Add Friend</button>
        </div>
        {friendsListJSX}
      </div>
    </div>
  )
}

export default Friends