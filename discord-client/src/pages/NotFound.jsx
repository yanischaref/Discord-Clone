import React from 'react'
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div>
      <div>NotFound</div>
      <Link to='/channel/me'>Go to app</Link>
    </div>
  )
}

export default NotFound