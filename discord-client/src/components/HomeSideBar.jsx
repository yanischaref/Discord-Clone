import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../functions/fetchData'
import { deleteCookie } from '../functions/deleteCookie'
import './styles/HomeSideBar.css'

const MeSidebar = (props) => {
    const navigate = useNavigate();
    const userId = props.userId

    const [userData, setUserData] = useState([]);
    const [sideBarFriendsJSX, setSideBarFriendsJSX] = useState([]);
    const [userInfoJSX, setUserInfoJSX] = useState();

    // Function to create friend elements
    const createSidebarFriendsJSX = (data) => {
        const friends = data.friendsInfo.map(friend => {
            return (
                <div className='sidebar-option sidebar-dm-user' onClick={() => {
                    navigate(`/channel/dm/${friend.user_id}`)
                    window.location.reload();
                }} key={friend.user_id}>
                    <div className='user-icon-container'>
                        <img alt='' className='user-icon' src={friend.profile_picture}></img>
                        <div className='user-status-icon-container'>
                            <img alt='' src={friend.status === 'online' ? '/assets/icons/online.png' : friend.status === 'idle' ? '/assets/icons/idle.png' : friend.status === 'donot-disturb' ? '/assets/icons/donot-disturb.png' : '/assets/icons/offline.png'}></img>
                        </div>
                    </div>
                    <p>{friend.name}</p>
                </div>
            )
        })
        setSideBarFriendsJSX(friends)
    }

    const logout = () => {
        deleteCookie('access_token')
        navigate('/login')
    }

    useEffect(() => {
        if (userData.length === 0) return
        const userInfoElmts = <div className='sidebar-userinfo'>
            <div className='sidebar-userinfo-left'>
                <p>{userData.name}</p>
                <div className='user-icon-container'>
                    <img className='user-icon' src={userData.profile_picture}></img>
                    <div className='user-status-icon-container'>
                        <img src={`/assets/icons/${userData.status}.png`}></img>
                    </div>
                </div>
            </div>
            <div className='sidebar-userinfo-icons-container'>
                <img className='sidebar-userinfo-icons' onClick={logout} src='/assets/icons/logout.png'></img>
                <img className='sidebar-userinfo-icons' src='/assets/icons/settings.svg'></img>
            </div>
        </div>
        setUserInfoJSX(userInfoElmts)
    }, [userData])

    useEffect(() => {
        fetchData(`http://localhost:5000/get-userdata/${userId}`, setUserData)
        fetchData(`http://localhost:5000/get-friends/${userId}`, createSidebarFriendsJSX)
    }, [])
    return (
        <nav className='sidebar'>
            <div className='sidebar-header'>
                <input autoComplete='off' spellCheck="false" className='app-inputs topnav-me-input' placeholder='Find or Start a conversation'></input>
            </div>

            <div className='sidebar-content'>
                <div className='sidebar-option sidebar-option-friends' onClick={() => navigate('/channel/me')}>
                    <img alt='' src='/assets/icons/friends-icon.png'></img>
                    <p>Friends</p>
                </div>
                <div className='sidebar-category'>
                    <div className='sidebar-category-info'>
                        <p>Direct Messages</p>
                        <p className='sidebar-category-action'>+</p>
                    </div>
                    <div className='sidebar-category-options'>
                        {sideBarFriendsJSX}
                    </div>
                </div>
            </div>

            <div className='sidebar-userinfo'>
                {userInfoJSX}
            </div>
        </nav>
    )
}

export default MeSidebar