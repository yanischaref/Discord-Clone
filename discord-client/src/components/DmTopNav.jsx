import React, { useState, useEffect } from 'react'

import { fetchData } from '../functions/fetchData'

const DmTopNav = (props) => {
    const userId = props.userId
    const path = window.location.pathname;
    const parts = path.split('/');
    const receiverId = parts[parts.length - 1];

    const [userData, setUserData] = useState([]);
    const [userInfoJSX, setUserInfoJSX] = useState([]);

    useEffect(() => {
        if (userData.length === 0) return
        const userInfoElmts = <div className='topnav-dm-info-container'>
            <img alt='' className='topnav-dm-user-img ' src={userData.profile_picture}></img>
            <p>"temp"</p>
        </div>
        setUserInfoJSX(userInfoElmts)
    }, [userData])

    useEffect(() => {
        fetchData(`http://localhost:5000/get-userdata/${userId}`, setUserData)
    }, [])
    return (
        <header className='topnav-header topnav-header-dm'>
            <div>
                <input autoComplete='off' spellCheck="false" className='app-inputs topnav-me-input' placeholder='Find or Start a conversation'></input>
            </div>
            {userInfoJSX}
            <div className='topnav-dm-settings'>
                <img alt='' className='topnav-icons top-nav-icons-audio-call' src='/assets/icons/audio-call.png'></img>
                <img alt='' className='topnav-icons top-nav-icons-video-call' src='/assets/icons/video-call.png'></img>
                <input autoComplete='off' spellCheck="false" className='app-inputs topnav-me-input' placeholder='Search'></input>
                <img alt='' className='topnav-icons top-nav-icons-inbox' src='/assets/icons/inbox.png'></img>
                <img alt='' className='topnav-icons top-nav-icons-help' src='/assets/icons/help.png'></img>
            </div>
        </header>
    )
}

export default DmTopNav