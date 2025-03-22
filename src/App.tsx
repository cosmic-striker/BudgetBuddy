import React, { useState } from 'react';
import { Auth } from './components/Auth';
import { Budget } from './components/Budget';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('currentUser');
  });

  const handleAuth = (username: string) => {
    setCurrentUser(username);
    localStorage.setItem('currentUser', username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <ThemeProvider>
      {currentUser ? (
        <Budget userId={currentUser} onLogout={handleLogout} />
      ) : (
        <Auth onAuth={handleAuth} />
      )}
    </ThemeProvider>
  );
}

export default App;