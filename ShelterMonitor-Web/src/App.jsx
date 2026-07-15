import React, { useState, useEffect } from 'react';
import LoginForm from './Login';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('shelter_user');
    const storedToken = localStorage.getItem('shelter_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (err) {
        localStorage.removeItem('shelter_user');
        localStorage.removeItem('shelter_token');
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('shelter_user', JSON.stringify(data.user));
    localStorage.setItem('shelter_token', data.token);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('shelter_user');
    localStorage.removeItem('shelter_token');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader-spinner"></div>
        <p>Restoring session...</p>
      </div>
    );
  }

  return (
    <div className="app-root">
      {!token ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard user={user} token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
