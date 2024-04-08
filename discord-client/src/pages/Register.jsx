import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import './styles/Signs.css'

const Register = () => {
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        name: '',
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
        const username = formData.username
        const name = formData.name
        const email = formData.email
        const password = formData.password
        if(password.length < 8){
            setErrMsg("Password must be over 8 charachters!")
            return
        }
        try {
            const response = await fetch('http://localhost:5000/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, name, email, password }),
            });
      
            if (!response.ok) {
              const errorMessage = await response.text();
              throw new Error(errorMessage);
            }
            navigate('/channel/me');
          } catch (err) {
            setErrMsg("err");
          }
        };
  return (
    <div className='signs-body'>
        <img alt='' className='signs-img' src='/assets/discord-background.png'></img>
        <div className='sign-form-container'>
            <form onSubmit={handleSubmit} className='sign-form'>
                <div className='welcome-text'>
                    <h3>Welcome To Discord!</h3>
                </div>
                <label><small className='signs-dark-text'>EMAIL OR PHONE NUMBER <span style={{color: 'red'}}>*</span></small></label>
                <input onChange={handleChange} className='app-inputs signs-inputs' name='email' type='email'></input>
                <label><small className='signs-dark-text'>USERNAME <span style={{color: 'red'}}>*</span></small></label>
                <input onChange={handleChange} className='app-inputs signs-inputs' name='username' type="text"></input>
                <label><small className='signs-dark-text'>NAME <span style={{color: 'red'}}>*</span></small></label>
                <input onChange={handleChange} className='app-inputs signs-inputs' name='name' type='text'></input>
                <label><small className='signs-dark-text'>PASSWORD <span style={{color: 'red'}}>*</span></small></label>
                <input onChange={handleChange} className='app-inputs signs-inputs' name='password' type="password"></input>
                <p className='signs-result-box'>{errMsg}</p>
                <button className='app-buttons' type='submit'>Register</button>
                <div className='signs-other-options'>
                    <small>Already have an account?</small>
                    <Link className='app-links' to='/login'><small>Log In</small></Link>
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
export default Register