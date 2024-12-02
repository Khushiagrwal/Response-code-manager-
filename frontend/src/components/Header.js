import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css'; // Updated import path after moving the file to src/styles/

function Header() {
  const navigate = useNavigate();

  // Check if the user is logged in by checking the token in localStorage
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    navigate('/'); // Redirect to the login page
  };

  return (
    isLoggedIn && (
      <header className="app-header">
        <h1>Response Code Manager</h1>
        <nav>
          <a href="/search">Search</a>
          <a href="/lists">View List</a>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>
    )
  );
}

export default Header;


