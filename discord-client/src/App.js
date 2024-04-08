import React, { useEffect } from 'react';
import { getCookie } from './functions/getCookie'

import './App.css'
import './pages/styles/PageLayout.css'
import './pages/styles/SideBar.css'
import './pages/styles/TopNav.css'
import './pages/styles/PageContent.css'

import NotFound from './pages/NotFound'
import Friends from './pages/Friends'
import Dm from './pages/Dm'
import Register from './pages/Register'
import Login from './pages/Login'

import NavBar from './components/NavBar'
import HomeSideBar from './components/HomeSideBar'

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
      element: <div className='App'>
        <NavBar />
        <div className='app-body friends-app-body'>
          <HomeSideBar userId={userId} />
          <Friends userId={userId} />
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
      element: <div className='App'>
        <NavBar />
        <div className='app-body friends'>
          <HomeSideBar userId={userId} />
            <Dm userId={userId} />
        </div>
      </div>
    },
    {
      path: "*",
      element: <NotFound />
    }
  ])

  return (
    <RouterProvider router={router} />
  );
}

