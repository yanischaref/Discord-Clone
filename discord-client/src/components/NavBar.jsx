import React from 'react'
import './styles/NavBar.css'

const NavBar = () => {
  return (
      <nav className='navbar'>
        <div className='navbar-channels-container'>
          <div className='channel-me-with-line'>
            <div className='channel channel-me'>
              <div className='app-nav-lines-v'></div>
              <img alt='' className='channel-me-icon' src='/assets/icons/discord-icon.png'></img>
            </div>
            <div className='app-nav-lines-h'></div>
          </div>
          <div className='channel'>
            <div className='app-nav-lines-v'></div>
            <img alt='' className='channel-icon' src='/assets/servers/logo-dis.jpg'></img>
          </div>
          <div className='channel'>
            <div className='app-nav-lines-v'></div>
            <img alt='' className='channel-icon' src='/assets/servers/logo-dis.jpg'></img>
          </div>
          <div className='channel channel-add-server'>
            <div className='app-nav-lines-v'></div>
            <p className='channel-add-server-plus'>+</p>
          </div>
        </div>
        <div className='navbar-info-container'></div>
      </nav>
  )
}

export default NavBar