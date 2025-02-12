import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Dropdown = ({ isOpen, closeDropdown, toggleDarkMode, isDarkMode }) => {
  const navigate = useNavigate();
  const user_id = sessionStorage.getItem('user_id');
  const [user_name, setUser_name] = React.useState('');

  useEffect(() => {
    if (user_id) {
      const storedUser = JSON.parse(localStorage.getItem('user_info'));
      if (storedUser) {
        setUser_name(storedUser.user_name);
      }
    }
  }, [user_id]);

  useEffect(() => {
    if (isOpen) {
      const handleOutsideClick = (event) => {
        if (!event.target.closest('.dropdown-menu')) {
          closeDropdown();
        }
      };
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }
  }, [isOpen, closeDropdown]);

  if (!isOpen) return null;

  const handleLogout = () => {
    const confirmLogout = window.confirm('로그아웃 하시겠습니까?');
    if (confirmLogout) {
      localStorage.removeItem('user_info');
      // sessionStorage.removeItem('userId');
      navigate('/login');
    }
  };

  return ReactDOM.createPortal(
    <DropdownMenu className="dropdown-menu">
      <p>{`${user_name ? user_name : '사용자'}님 안녕하세요!`}</p>
      <Link to="/profile-edit">회원정보 수정</Link>
      <button className='button' onClick={toggleDarkMode}>
        {isDarkMode ? '다크 모드 해제' : '다크 모드 활성화'}
      </button>
      <LogOutBtn onClick={handleLogout}>로그아웃</LogOutBtn>
    </DropdownMenu>,
    document.body
  );
};

export default Dropdown;

const DropdownMenu = styled.div`
  position: fixed;
  top: 75px;
  right: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;

  p {
    font-weight: bold;
    font-size: 20px;
    margin: 0;
  }

  a {
    text-decoration: none;
    color: #007bff;
    font-size: 16px;
  }

  button {
    background: none;
    border: 1px solid #007bff;
    color: #007bff;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s, color 0.3s;

    &:hover {
      background: #007bff;
      color: #fff;
    }
  }

  @media (max-width: 768px) {
    top: 120px;
  }
`;

const LogOutBtn = styled.button`
  color: red;

  &:hover{
    background-color: red;
  }
`