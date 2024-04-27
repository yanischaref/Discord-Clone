import React, { } from 'react'
import './styles/UserIcon.css'

const UserIcon = ({ userdata, size, isShowStatus, showProfile }) => {
    const passShowProfile = () => showProfile(userdata)

    return (
        <div className='user-icon-container' style={{
            width: size ? size : '30px',
            height: size ? size : '30px',
            cursor: 'pointer'
        }}>
            <img alt='' onClick={showProfile && passShowProfile} className={`user-icon ${showProfile && 'page-content-msg-sender-picture'}`} src={userdata.profile_picture}></img>
            {isShowStatus && <img className='user-status-icon-img' alt='' src={`/assets/icons/${userdata.status}.png`}></img>}
        </div>
    )
}

export default UserIcon