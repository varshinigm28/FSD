// Login.jsx

import React, { useState } from 'react';
import '../index.css'
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:7000/login', { name, password });
      const userData = response.data;
      // Inside handleSubmit function of Login component
if (userData && userData.id) {
  sessionStorage.setItem('userId', userData.id);
  console.log('User ID stored in session storage:', sessionStorage.getItem('userId')); // Debugging line
  navigate('/body/home'); // Ensure this path is correct
}
else {
        window.alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
      window.alert('Error occurred during login. Please try again later.');
    }
  };

  return (
    <div className="login-body">
    <div className='login-container'>
       <h1>Login</h1>
     <form onSubmit={handleSubmit}>
        <div className="login-form-group">
          <label htmlFor="username" >Username</label>
          <input type="text" id="username" name="username" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="login-form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className='loginbt' >Login</button>
      </form>
      <div >
        <p style={{marginLeft:'120px'}}>Do not have an account? <Link to="/register">Register</Link></p>
      </div>
  </div>
  </div>
  );
}

export default Login;
