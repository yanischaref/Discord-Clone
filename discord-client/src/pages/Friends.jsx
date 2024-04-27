import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './styles/Friends.css'
import io from 'socket.io-client';
import UserIcon from '../components/UserIcon';

const socket = io.connect('http://localhost:5000');

const Friends = (props) => {
  const navigate = useNavigate();
  const showNotification = props.showNotification
  const userId = props.userId
  const userData = props.userData

  // State variables
  const [friendsData, setFriendsData] = useState([])
  const [friendsListJSX, setFriendsListJSX] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [currentTab, setCurrentTab] = useState('friends')
  const [addFriendResultMsg, setAddFriendResultMsg] = useState('')

  const createFriendsListJSX = () => {
    var friends
    if (friendsData.length === 0) {
      friends = <div>Nothing here 😢. Add some new friends! 😊</div>
    } else {
      friends = friendsData.map(friend => {
        if (friend.state === 'accepted' && currentTab === 'friends') {
          return (
            <div className='friends-list-friend' key={friend.user_id + 1}>
              <div className='friend-container' onClick={() => navigate(`/channel/dm/${friend.user_id}`)}>
                <div className='friend-info'>
                  <UserIcon userdata={friend} size={'35px'} isShowStatus={true} />
                  <p>{friend.name}</p>
                </div>
              </div>
              <img className='friend-delete-icon' onClick={() => deleteFriend(friend.user_id)} alt='' src='/assets/icons/delete.svg'></img>
            </div>
          )
        } else if (friend.state === 'pending' && currentTab === 'pending') {
          return (
            <div className='friends-list-friend' key={friend.user_id + 1}>
              <div className='friend-container' onClick={() => navigate(`/channel/dm/${friend.user_id}`)}>
                <div className='friend-info'>
                  <UserIcon userdata={friend} size={'35px'} isShowStatus={true} />
                  <div>
                    <p>{friend.name}</p>
                    <small><small>{Number(friend.sender_id) === Number(userId) ? 'Outgoing' : 'Incoming'}</small></small>
                  </div>
                </div>
              </div>
              <div>
                {Number(friend.sender_id) !== Number(userId) && <img className='friend-add-icon' onClick={() => acceptFriend(userId, friend.user_id)} alt='' src='/assets/icons/checkmark.svg'></img>}
                <img className='friend-delete-icon' onClick={() => deleteFriend(friend.user_id)} alt='' src='/assets/icons/delete.svg'></img>
              </div>
            </div>
          )
        }
      })
    }
    setFriendsListJSX(friends)
  }

  const setAddFriendResult = (msg, lastedTime) => {
    setAddFriendResultMsg(msg)
    setTimeout(() => {
      setAddFriendResultMsg('')
    }, lastedTime * 1000)
  }

  const recieveNewFriend = (senderData) => {
    console.log("recieving new friend!, ", senderData)
    console.log("current tab: ", currentTab)
    if (currentTab !== 'pending') {
      showNotification(`${senderData.name} Wants to be friends!`, 'Friend request was received.')
      return
    }
    setFriendsData(prevFriends => ([
      ...prevFriends,
      senderData
    ]))
  }

  const addFriend = () => {
    fetch(`http://localhost:5000/get-user-by-username/${inputValue}`)
      .then(response => response.json())
      .then(data => {
        if (data.result === 'no user found!') {
          setAddFriendResult('Wrong username!', 5)
        } else {
          fetch(`http://localhost:5000/get-userdata/${data.userid}`)
            .then(response => response.json())
            .then(friendData => {
              socket.emit('addFriend', userData, friendData);

              var toSendFriendData = friendData
              toSendFriendData['sender_id'] = userId
              toSendFriendData['state'] = 'pending'
              setFriendsData(prevFriends => ([
                ...prevFriends,
                toSendFriendData
              ]))
            })
            .catch((err) => console.error("Error fetching friendData!"))
          setAddFriendResult('Friend added successfully!', 5)
        }
      })
      .catch(error => console.error('Error adding friend:', error))
  }

  const deleteFriend = (friendId) => {
    socket.emit('deleteFriend', userId, friendId)
    if (friendsData.some(friend => friend.user_id === friendId)) {
      const updatedFriendsData = friendsData.filter(friend => friend.user_id !== friendId);
      setFriendsData(updatedFriendsData)
    }
  }

  const acceptFriend = (user_id, receiver_id) => {
    fetch('http://localhost:5000/accept-friend', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: user_id, receiverId: receiver_id })
    })
      .catch(error => console.error('Error accepting friend:', error))
  };

  const getAll = () => {
    setCurrentTab('all')
    fetch(`http://localhost:5000/get-users`)
      .then(response => response.json())
      .then(data => setFriendsData(data.users))
      .catch((err) => console.log("Error fetching user data: ", err))
  }
  const getFriends = (tab) => {
    if (tab) setCurrentTab(tab)
    else setCurrentTab('friends')
    fetch(`http://localhost:5000/get-friends/${userId}`)
      .then(response => response.json())
      .then(data => setFriendsData(data.friendsInfo))
      .catch((err) => console.log("Error fetching user data: ", err))
  }

  const getBlocked = () => {
    alert("Not setup blcoked users yet, comming soon!")
    return
    // setCurrentTab('blocked')
  }

  // Effect hook to fetch data on component mount
  useEffect(() => {
    createFriendsListJSX()
  }, [friendsData])

  useEffect(() => {
    if (friendsData.length === 0) {
      getFriends()
    }

    socket.on('recieveNewFriendData', (receiverData) => {
      console.log("recieving new friend: ", receiverData)
      recieveNewFriend(receiverData)
    })

    socket.on('recieveDeletedFriendId', (receiverId) => {
      if (friendsData.some(friend => friend.user_id === receiverId)) {
        const updatedFriendsData = friendsData.filter(friend => friend.user_id !== receiverId);
        setFriendsData(updatedFriendsData)
      }
    })

    socket.on('recieveAcceptedFriendId', (receiverId) => {
      if (friendsData.some(friend => friend.user_id === receiverId)) {
        const updatedFriendsData = friendsData.filter(friend => friend.user_id !== receiverId);
        setFriendsData(updatedFriendsData)
      }
    })
    // Clean up by removing the event listener when component unmounts
    return () => {
      socket.off('deletedMessageId');
      socket.off('newMessage');
    };
  }, [])

  return (
    <div className='page friends-page'>
      <header className='page-topnav'>
        <div className='page-topnav-friends-tabs'>
          <p onClick={getAll} className={`page-topnav-friend-setting ${currentTab === 'all' && 'page-topnav-friend-setting-selected'}`}>All Users</p>
          <p onClick={() => getFriends('friends')} className={`page-topnav-friend-setting ${currentTab === 'friends' && 'page-topnav-friend-setting-selected'}`}>Friends</p>
          <p onClick={() => getFriends('pending')} className={`page-topnav-friend-setting ${currentTab === 'pending' && 'page-topnav-friend-setting-selected'}`}>Pending</p>
          <p onClick={getBlocked} className={`page-topnav-friend-setting ${currentTab === 'blocked' && 'page-topnav-friend-setting-selected'}`}>Blocked</p>
        </div>
        <div className='page-topnav-friends-settings'>
          <img alt='' className='page-topnav-icons top-nav-icons-inbox' src='/assets/icons/inbox.png'></img>
          <img alt='' className='page-topnav-icons top-nav-icons-help' src='/assets/icons/help.png'></img>
        </div>
      </header>

      <div className='page-content friends-page-content'>
        {currentTab !== 'pending' ? '' :
          <div className='add-friend-container'>
            <input type='text' onChange={(event) => setInputValue(event.target.value)} placeholder='Friend Username..' className='app-inputs friends-input'></input>
            <button onClick={addFriend} className='app-buttons'>Add Friend</button>
          </div>}
        <p className='add-friend-result' style={{ color: addFriendResultMsg === 'Wrong username!' ? 'red' : 'green' }}>{addFriendResultMsg}</p>
        {friendsListJSX}
      </div>
    </div>
  )
}

export default Friends