import React, { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

const getStoredAuthState = () => {
  const authToken = sessionStorage.getItem('auth-token');
  const storedName = sessionStorage.getItem('name') || '';
  const storedEmail = sessionStorage.getItem('email') || '';

  return {
    isLoggedIn: Boolean(authToken),
    userName: storedName,
    userEmail: storedEmail,
    authToken,
  };
};

export const AuthProvider = ({ children }) => {
  const storedAuth = getStoredAuthState();
  const [isLoggedIn, setIsLoggedIn] = useState(storedAuth.isLoggedIn);
  const [userName, setUserName] = useState(storedAuth.userName);
  const [userEmail, setUserEmail] = useState(storedAuth.userEmail);
  const [authToken, setAuthToken] = useState(storedAuth.authToken);

  const login = ({ token, userName: nextName, userEmail: nextEmail }) => {
    sessionStorage.setItem('auth-token', token);
    sessionStorage.setItem('name', nextName || '');
    sessionStorage.setItem('email', nextEmail || '');
    setAuthToken(token);
    setUserName(nextName || '');
    setUserEmail(nextEmail || '');
    setIsLoggedIn(true);
  };

  const logout = () => {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('email');
    setAuthToken('');
    setUserName('');
    setUserEmail('');
    setIsLoggedIn(false);
  };

  const value = useMemo(() => ({
    isLoggedIn,
    setIsLoggedIn,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    authToken,
    setAuthToken,
    login,
    logout,
  }), [authToken, isLoggedIn, userEmail, userName]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used inside an AuthProvider');
  }

  return context;
};
