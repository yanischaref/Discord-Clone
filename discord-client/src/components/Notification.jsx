import React, { useEffect, useState } from 'react'
import './styles/Notification.css'

const notificationDuration = 5000 // 5000 ml seconds (5 seconds)

const Notification = ({ notificationTitle, notificationContent }) => {
    const [toggleNotificationDisplay, setToggleNotificationDisplay] = useState('none')
    useEffect(() => {
        if (notificationTitle ) {
            setToggleNotificationDisplay('block')
            setTimeout(() => {
                setToggleNotificationDisplay('none')
            }, notificationDuration)
        }
    }, [notificationTitle, notificationContent])

    return (
        <div className='notification-container' style={{ display: toggleNotificationDisplay }}>
            <div>
                <p className='notification-title'>{notificationTitle}</p>
                <p className='notification-content'>{notificationContent}</p>
            </div>
            <p className='notification-exit-icon'>x</p>
        </div>
    )
}

export default Notification