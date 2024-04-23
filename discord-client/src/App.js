import React, { useEffect, useState } from 'react';
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
import Notification from './components/Notification';

import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./index.css";

function authorize(userId) {
  if (userId.length === 0 || userId === 0) {
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      console.log("not authorized")
      window.location.pathname = '/login'
    }
  }
}

export default function App() {
  const userId = Number(getCookie('access_token'))
  const [userData, setUserData] = useState([])
  const [friendsData, setFriendsData] = useState([])
  const [notificationTitle, setNotificationTitle] = useState()
  const [notificationContent, setNotificationContent] = useState()

  const showNotification = (title, content) => {
    setNotificationTitle(title)
    setNotificationContent(content)
  }

  useEffect(() => {
    authorize(userId)
    // redirect()
    fetch(`http://localhost:5000/get-userdata/${userId}`)
      .then(response => response.json())
      .then(data => setUserData(data))
      .catch((err) => console.log("Error fetching userData!"))

    fetch(`http://localhost:5000/get-friends/${userId}`)
      .then(response => response.json())
      .then(data => setFriendsData(data.friendsInfo))
      .catch((err) => console.log("Error fetching user data: ", err))
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/channel/me" />
    },
    {
      path: "/app",
      element: <Navigate to="/channel/me" />
    },
    {
      path: "/channel/me",
      element: <div className='App'>
        <NavBar />
        <div className='app-body friends-app-body'>
          <HomeSideBar userId={userId} userData={userData} />
          <Friends userId={userId} userData={userData} friendsData={friendsData} showNotification={showNotification} />
        </div>
        <Notification notificationTitle={notificationTitle} notificationContent={notificationContent} />
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
          <HomeSideBar userId={userId} userData={userData} friendsData={friendsData} />
          <Dm userId={userId} userData={userData} showNotification={showNotification} />
        </div>
        <Notification notificationTitle={notificationTitle} notificationContent={notificationContent} />
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

