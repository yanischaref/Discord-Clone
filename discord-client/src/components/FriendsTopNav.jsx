import React from 'react'

const FriendsTopNav = () => {
    return (
        <header className='topnav-header topnav-header-me'>
            <input autoComplete='off' spellCheck="false" className='app-inputs topnav-me-input' placeholder='Find or Start a conversation'></input>
            <div className='topnav-me-friends-settings'>
                <p className='topnav-friend-setting'>All</p>
                <p className='topnav-friend-setting'>Friends</p>
                <p className='topnav-friend-setting'>Pending</p>
                <p className='topnav-friend-setting'>Blocked</p>
            </div>
            <div className='topnav-me-settings'>
                <img alt='' className='topnav-icons top-nav-icons-inbox' src='/assets/icons/inbox.png'></img>
                <img alt='' className='topnav-icons top-nav-icons-help' src='/assets/icons/help.png'></img>
            </div>

        </header>
    )
}

export default FriendsTopNav