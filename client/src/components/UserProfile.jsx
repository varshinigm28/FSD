import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';

const UserProfile = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const userId = sessionStorage.getItem('userId'); // Ensure this returns a valid userId

  useEffect(() => {
    if (userId) { // Only make the request if userId is present
      axios.get(`http://localhost:7000/user`, { params: { userId } })
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the user data!', error);
        });
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    axios.put(`http://localhost:7000/user`, { ...user, userId })
      .then(response => {
        setUser(response.data);
        setIsEditing(false);
      })
      .catch(error => {
        console.error('There was an error saving the user data!', error);
      });
  };

  return (
    <div className="user-profile-wrapper">
      <div className="user-profile-container">
        <h1>User Profile</h1>
        <div className="profile-info">
          <label>Username:</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
            />
          ) : (
            <span>{user.name}</span>
          )}
        </div>
        <div className="profile-info">
          <label>Email:</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
          ) : (
            <span>{user.email}</span>
          )}
        </div>
        {isEditing ? (
          <button onClick={handleSave} className="save-button">Save</button>
        ) : (
          <button onClick={handleEdit} className="edit-button">Edit</button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
