import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { deleteCookie } from '../functions/deleteCookie'
import './styles/HomeSideBar.css'
import UserIcon from './UserIcon';

const MeSidebar = ({ userData }) => {
    const navigate = useNavigate();

    const [sideBarFriendsJSX, setSideBarFriendsJSX] = useState([]);
    const [userInfoJSX, setUserInfoJSX] = useState();

    const logout = () => {
        deleteCookie('access_token')
        window.location.pathname = '/login'
    }

    useEffect(() => {
        const createSidebarUserInfoJSX = () => {
            const userInfoElmts = <div className='sidebar-userinfo'>
                <div className='sidebar-userinfo-left'>
                    <div className='user-icon-container'>
                        <img alt='' className='user-icon' src={userData.profile_picture}></img>
                        <div className='user-status-icon-container'>
                            <img alt='' src={`/assets/icons/${userData.status}.png`}></img>
                        </div>
                    </div>
                    <div>
                        <p className='sidebar-userinfo-name'>{userData.name}</p>
                        <p className='sidebar-userinfo-username'>@{userData.username}</p>
                    </div>
                </div>
                <div className='sidebar-userinfo-icons-container'>
                    <img alt='' className='sidebar-userinfo-icons' onClick={logout} src='/assets/icons/logout.png'></img>
                    <img alt='' className='sidebar-userinfo-icons' src='/assets/icons/settings.svg'></img>
                </div>
            </div>
            setUserInfoJSX(userInfoElmts)
        }

        try {
            userData.username.length > 0 && createSidebarUserInfoJSX()
        } catch (err) { }
    }, [userData])

    useEffect(() => {
        // Function to create friend elements
        const createSidebarFriendsJSX = (openedDmData) => {
            const friendsUi = openedDmData.map(friend => {
                return (
                    <div className='sidebar-option sidebar-dm-user' onClick={() => navigate(`/channel/dm/${friend.user_id}`)} key={friend.user_id}>
                        <UserIcon userdata={friend} size={'30px'} isShowStatus={true} />
                        <p>{friend.name}</p>
                    </div>
                )
            })
            setSideBarFriendsJSX(friendsUi)
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/get-opened-dms/${userData.user_id}`);
                const data = await response.json();

                const friendsData = await Promise.all(data.openedDms.map(async user => {
                    const userResponse = await fetch(`http://localhost:5000/get-userdata/${user.partner_id}`);
                    return await userResponse.json();
                }));

                createSidebarFriendsJSX(friendsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (userData.user_id) {
            fetchData();
        }
    }, [userData, navigate])
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