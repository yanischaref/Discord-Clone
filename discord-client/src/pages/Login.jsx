import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import './styles/Signs.css'

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

const Login = (props) => {
    const [resultMsg, setResultMsg] = useState('')
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
      });
    
      const handleChange = (event) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value,
        });
      };

    const handleSubmit = async(event) => {
        event.preventDefault();
        const email = formData.email
        const password = formData.password
        if(password.length < 8){
            setResultMsg("Password must be over 8 charachters!")
            return
        }
        try {
            const response = await fetch('http://localhost:5000/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            });
      
            if (!response.ok) {
              const errorMessage = await response.text();
              throw new Error(errorMessage);
            }
            const data = await response.json()
            setCookie('access_token', data.user.user_id, 7);
            setResultMsg('Connected Successfully!')
            window.location.pathname = '/channel/me'
          } catch (err) {
            setResultMsg("wrong email or password");
          }
        };

  return (
    <div className='signs-body'>
        <img alt='' className='signs-img' src='/assets/discord-background.png'></img>
        <div className='sign-form-container'>
            <form onSubmit={handleSubmit} className='sign-form'>
                <div className='welcome-text'>
                    <h3>Welcome Back!</h3>
                    <p className='signs-dark-text'>We're so excited to see you again!</p>
                </div>
                <label><small className='signs-dark-text'>EMAIL OR PHONE NUMBER <span style={{color: 'red'}}>*</span></small></label>
                <input className='app-inputs signs-inputs' type='email' name='email' onChange={handleChange}></input>
                <label><small className='signs-dark-text'>PASSWORD <span style={{color: 'red'}}>*</span></small></label>
                <input className='app-inputs signs-inputs' type="password" name='password' onChange={handleChange}></input>
                <Link className='app-links'><small>Forgot your password?</small></Link>
                <p className='signs-result-box' style={{color: resultMsg === 'wrong email or password' ? 'red' : 'green'}}>{resultMsg}</p>
                <button className='app-buttons' type='submit'>Log In</button>
                <div className='signs-other-options'>
                    <small>Already have an account?</small>
                    <Link className='app-links' to='/register'><small>Register</small></Link>
                </div>
            </form>
            <div className='signs-qrcode-part'>
                <img alt='' className='qr-code-img' src='/assets/qr-code.png'></img>
                <h3>Log in with QR Code</h3>
                <small>Scan this with the <b>Discord mobile app</b> to log in instantly</small>
                <small className='signs-warning-msg'>Please keep in mind that this is a discord clone. Don't enter you discord credentials here!</small>
            </div>
        </div>
    </div>
  )
}

export default Login