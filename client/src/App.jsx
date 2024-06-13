import React from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FirstPage from './components/FirstPage';
import Home from './components/Home';
import Post from './components/Post';
import Explore from './components/Explore';
import UserProfile from './components/UserProfile';
import Cart from './components/Cart';
import Message from './components/Message';
import Body from './components/Body';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FirstPage />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/body" element={<Body />}>
            <Route path="home" element={<Home />} />
            <Route path="post" element={<Post />} />
           <Route path="explore" element={<Explore />} /> 
            <Route path="cart" element={<Cart />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="message" element={<Message />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
