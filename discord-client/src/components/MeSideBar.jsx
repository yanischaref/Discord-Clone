import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { fetchData } from '../functions/fetchData'
import { deleteCookie } from '../functions/deleteCookie'

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
        const userInfoElmts = <div className='sidebar-user-info'>
            <div className='sidebar-user-info-left'>
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
        <nav className='sidebar home-side-bar'>
            <div className='home-side-bar-part-1'>
                <div onClick={() => navigate('/channel/me')} className='sidebar-option sidebar-option-friends'>
                    <img alt='' src='/assets/icons/friends-icon.png'></img>
                    <p>Friends</p>
                </div>
                <div className='sidebar-category'>
                    <p>Direct Messages</p>
                    <p className='sidebar-category-action'>+</p>
                    <p className='sidebar-category-tooltip tooltip'>Create DM</p>
                </div>
                <div className='sidebar-dm'>
                    {sideBarFriendsJSX}
                </div>
            </div>
            {userInfoJSX}
        </nav>
    )
}

export default MeSidebar