import React, { useState, useEffect } from 'react'
import './styles/userProfile.css'
import '../App.css'
import { formatDate } from '../functions/formatDate';
import { copyFileSync } from 'fs';


const UserProfile = ({ userdata, isProfileShowen, position }) => {
  const profileElement = document.querySelector('.user-profile-container');
  const [screenDimensions, setScreenDimensions] = useState({})

  const aiPositionY = () => {
    if (position.top) {
      const profileHeight = profileElement ? profileElement.clientHeight : 400
      var yPositionTop = Number(position.top.slice(0, -2))

      // since the profile will not overflow to top, we are not going to handle it
      // handleing bottom overflow:
      const delta = screenDimensions.height - yPositionTop - profileHeight
      if(delta < 0)yPositionTop += delta
      return yPositionTop
    }
    return null
  }
  const aiPositionX = () => {
    if (position.top && screenDimensions) {
      const profileWidth = profileElement ? profileElement.clientWidth : 320
      var xPositionLeft = Number(position.left.slice(0, -2)) + 25
      var xPositionRight = xPositionLeft + profileWidth

      // since the profile will not overflow to left, we are not going to handle it
      // handleing bottom right:
      const delta = screenDimensions.width - xPositionRight
      if(delta < 0){
        xPositionLeft += delta
        xPositionRight += delta
      }
      return xPositionLeft
    }
    return null
  }

  useEffect(() => {
    const updateScreenDimensions = () => {
      setScreenDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateScreenDimensions();
    window.addEventListener('resize', updateScreenDimensions);
    return () => {
      window.removeEventListener('resize', updateScreenDimensions);
    };
  }, []);

  const JSX = userdata && isProfileShowen && (
    <div className='user-profile-container' style={{ display: isProfileShowen ? 'block' : 'none', top: position.top ? aiPositionY(position.top) : '50%', left: position.left ? aiPositionX(position.left) : '50%', transform: position.top && position.left ? null : 'translate(-50%, -50%)' }}>
      <div className='profile-header'>
        <div className='profile-banner' style={userdata.banner[0] === '#' ? { backgroundColor: userdata.banner } : null}>
          <img style={(userdata.subscription === 'nitro' || userdata.subscription === 'classic') && userdata.banner[0] !== '#' ? { display: 'block' } : null} className='profile-banner-img' alt='discord banner' src='https://th.bing.com/th/id/R.ab725b695c69250819b333f1fff4bd37?rik=PLaxpYNfjQl6OQ&pid=ImgRaw&r=0'></img>
          <div className='user-icon-container' style={{ width: '4rem', height: '4rem', position: 'absolute', left: '5%', top: '50%' }}>
            <img alt='' className='user-icon' src={userdata.profile_picture}></img>
            <div className='user-status-icon-container'>
              <img style={{ width: '2rem', height: '2rem' }} alt='' src={userdata.status === 'online' ? '/assets/icons/online.png' : userdata.status === 'idle' ? '/assets/icons/idle.png' : userdata.status === 'donot-disturb' ? '/assets/icons/donot-disturb.png' : '/assets/icons/offline.png'}></img>
            </div>
          </div>
        </div>

        <div className='profile-badges-container'>
          {userdata.badges.map((badge, index) => {
            return <img key={index} className='profile-badge' alt='' src={badge.url}></img>
          })}
          <img className='profile-badge' alt='' src='/assets/badges/user.png'></img>
        </div>

      </div>
      <div className='profile-body'>
        <h4 className='profile-name'>{userdata.name}</h4>
        <p className='profile-username'>@{userdata.username}</p>
        <p className='profile-quote'>{userdata.quote}</p>
        <hr className='profile-line'></hr>
        <div>
          <h6>ABOUT ME</h6>
          <p className='profile-about-me-text'>{userdata.about_me}</p>
        </div>
        <div>
          <p className='profile-discord-memeber-since-text'>DISCORD MEMBER SINCE</p>
          <p className='profile-discord-memeber-since-date'>{formatDate(userdata.created_at)}</p>
        </div>
      </div>
    </div>
  )

  return (
    JSX
  )
}

export default UserProfile