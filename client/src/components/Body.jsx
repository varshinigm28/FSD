import React from 'react';
import { Outlet } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MessageIcon from '@mui/icons-material/Message';
import '../index.css';

const Body = () => {
  console.log('Body component rendered');
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">Logo</div>
        <ul className="navbar-links">
          <li><a href="/body/home">Home</a></li>
          <li><a href="/body/explore">Explore</a></li>
          <li><a href="/body/cart">Cart</a></li>
          <li><a href="/body/post">Post</a></li>
          {/* <li><a href="/body/message"><MessageIcon /></a></li> */}
          <li><a href="/body/profile"><AccountCircleIcon /></a></li>
        </ul>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Body;
