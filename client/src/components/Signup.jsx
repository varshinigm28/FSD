import React, { useState } from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import '../index.css';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!name || !email || !password) {
      alert('Please fill all the fields.');
      return;
    }
    
    axios.post('http://localhost:7000/register', { name, email, password })
      .then(result => {
        console.log(result);
        if (result.data.message === "Email already exists") {
          window.alert("Email already exists. Please use another email.");
        } else if (result.data.message === "Username already exists") {
          window.alert("Username already exists. Please use another username.");
        } else if (result.data.message === "User created successfully") {
          sessionStorage.setItem('userId', result.data.userId);
          console.log(result.data.userId);
          navigate('/body/home', { state: { userId: result.data.userId } });
        }
      })
      .catch(error => {
        console.error(error);
        if (error.response && error.response.data && error.response.data.message) {
          window.alert(error.response.data.message);
        } else {
          window.alert("Something went wrong. Please try again later.");
        }
      });
  };

  return (
    <div className="signup-body">
      <div className='signup-container'>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="signup-form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email"
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="signup-form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username"
              onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="signup-form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password"
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className='signupbt'>Sign Up</button>
        </form>
        <div >
        <p style={{marginLeft:'120px'}}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
      </div>
    </div>
  );
};

export default Signup;
