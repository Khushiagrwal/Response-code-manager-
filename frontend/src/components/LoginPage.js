import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';  // Adjust the path as needed

function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(''); // To hold error message
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false); // To toggle popup visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const response = await fetch(`http://localhost:5000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.token) {
      console.log(data.token)
      localStorage.setItem('token', data.token);
      navigate('/search');
    } else {
      setError(data.error || 'Invalid credentials or user not found');
      setIsErrorPopupVisible(true);
      setTimeout(() => {
        setIsErrorPopupVisible(false);
      }, 3000); // Hide the popup after 3 seconds
    }
  };

  const closePopup = () => {
    setIsErrorPopupVisible(false);
  };

  return (
    <div>
      <h1>{isLogin ? 'Login' : 'Signup'} to Code Response</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text" 
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Signup' : 'Switch to Login'}
      </button>

      {/* Error Popup */}
      {isErrorPopupVisible && (
        <div className={`error-popup ${isErrorPopupVisible ? 'show' : ''}`}>
          <h2>Wrong Credentials</h2>
          <p>{error}</p>
          <button className="close-btn" onClick={closePopup}>Close</button>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
