import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Dropdown from './Dropdown';
import NotificationDropdown from './NotificationDropdown';
import styled from 'styled-components';

function Header({ username, onLogout, isDarkMode, toggleDarkMode }) {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(true);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (!isNotificationOpen) {
      setUnreadNotifications(false);
    }
  };

  const closeNotification = () => {
    setIsNotificationOpen(false);
    setUnreadNotifications(false);
  };

  return (
    <HeaderContainer className={`header ${isDarkMode ? 'dark-mode' : ''}`}>
      <Nav>
        <Link to="/main">
          <Logo src={isDarkMode ? "/images/CattleBell_logoDM.png" : "/images/CattleBell_logo.png"} alt="CattleBell Logo" />
        </Link>
        <NavLinks>
          <StyledLink to="/camera-management" active={location.pathname === '/camera-management'}>
            카메라 관리
          </StyledLink>
          <StyledLink to="/detection-records" active={location.pathname === '/detection-records'}>
            탐지 기록
          </StyledLink>
        </NavLinks>
      </Nav>
      <Icons>
        <NotificationIconWrapper onClick={toggleNotification}>
          <img src={isDarkMode ? '/images/notificationiconDM.png' : '/images/notificationicon.png'} alt="Notification Icon" />
          {unreadNotifications && <NotificationPoint />}
        </NotificationIconWrapper>
        <NotificationDropdown
          isOpen={isNotificationOpen}
          closeDropdown={closeNotification}
        />
        <UserIcon onClick={toggleDropdown}>
          <img src={isDarkMode ? '/images/usericonDM.png' : '/images/usericon.png'} alt="User Icon" />
        </UserIcon>
        <Dropdown
          isOpen={isDropdownOpen}
          closeDropdown={closeDropdown}
          username={username}
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
          onLogout={onLogout}
        />
      </Icons>
    </HeaderContainer>
  );
}

export default Header;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);

  &.dark-mode {
    background-color: #333;
    color: #e0e0e0;
  }
`;

const Logo = styled.img`
  height: 50px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;

  @media (max-width:768px){
    flex-direction: column;
    align-items: start;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  align-items: end;
  font-size: 20px;
  font-weight: bold;
`;

const StyledLink = styled(Link)`
  font-size: ${(props) => (props.active ? '24px' : '20px')};
  color: ${(props) => (props.active ? '#000' : '#555')};
  text-decoration: none;

  &:hover {
    color: black;
  }

  @media (max-width: 768px) {
    font-size: ${(props) => (props.active ? '20px' : '16px')};
    padding: 10px 0;
  }
`;

const Icons = styled.div`
  display: flex;
  gap: 15px;
  position: relative;
  top: 10px;
`;

const NotificationIconWrapper = styled.span`
  position: relative;
  cursor: pointer;

  img {
    width: 40px;
  }
`;

const UserIcon = styled.span`
  cursor: pointer;

  img {
    width: 40px;
  }
`;

const NotificationPoint = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
`;