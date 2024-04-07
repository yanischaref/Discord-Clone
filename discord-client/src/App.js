import React, { useEffect } from 'react';
import { getCookie } from './functions/getCookie'

import './App.css'

import Friends from './pages/Friends';
import DmPage from './pages/DmPage';
import Register from './pages/Register';
import Login from './pages/Login';

import NavBar from './components/NavBar'
import MeSideBar from './components/MeSideBar';
import FriendsTopNav from './components/FriendsTopNav';
import DmTopNav from './components/DmTopNav';
import './components/Components.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";

function authorize(userId) {
  if (userId.length === 0) {
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      window.location.pathname = '/login';
    }
  }
}

// In case user visits domain.com/ this function redirect to domain.com/channel/me
function redirect() {
  if (window.location.pathname === '/'){
    window.location.pathname = 'channel/me'
  }
}

export default function App() {
  const userId = getCookie('access_token')
  useEffect(() => {
    authorize(userId)
    redirect()
  }, [])

  const router = createBrowserRouter([
    {
      path: "/channel/me",
      element: <div className={'App'}>
        <NavBar />
        <div className='app-body friends'>
          <FriendsTopNav userId={userId} />
          <div className='body-bottom'>
            <MeSideBar userId={userId} />
            <Friends userId={userId} />
          </div>
        </div>
      </div>
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/channel/dm/:channelID",
      element: <div className={'App'}>
        <NavBar />
        <div className='app-body friends'>
          <DmTopNav userId={userId} />
          <div className='body-bottom'>
            <MeSideBar userId={userId} />
            <DmPage userId={userId} />
          </div>
        </div>
      </div>
    }
  ])

  return (
    <RouterProvider router={router} />
  );
}

