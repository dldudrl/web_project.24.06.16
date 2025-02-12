import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Main from './pages/Main';
import DetectionRecords from './pages/DetectionRecords';
import CameraManagement from './pages/CameraManagement'
import ProfileEdit from './pages/ProfileEdit';
import Header from './components/Header';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [username, setUsername] = useState(() => {
    // 세션 스토리지에서 사용자 이름을 가져옵니다.
    return sessionStorage.getItem('username') || '';
  });

  useEffect(() => {
    // 다크 모드 클래스를 문서에 추가/제거합니다.
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const handleLogin = (user) => {
    setUsername(user.name);
    sessionStorage.setItem('username', user.name);
  };

  const handleLogout = () => {
    setUsername('');
    sessionStorage.removeItem('username');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleLogin} />} />
        <Route element={<LayoutWithHeader username={username} onLogout={handleLogout} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />}>
          <Route path="/main" element={<Main />} />
          <Route path="/camera-management" element={<CameraManagement />} />
          <Route path="/detection-records" element={<DetectionRecords />} />
          <Route path="/profile-edit" element={<ProfileEdit onUserUpdate={handleLogin} />} />
        </Route>
      </Routes>
    </Router>
  );
}

function LayoutWithHeader({ username, onLogout, isDarkMode, toggleDarkMode }) {
  return (
    <>
      <Header username={username} onLogout={onLogout} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <Outlet />
    </>
  );
}

export default App;