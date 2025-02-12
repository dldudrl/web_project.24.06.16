import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const NotificationDropdown = ({ isOpen, closeDropdown }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data) {
        if (event.data.type === 'NEW_NOTIFICATION') {
          const newNotification = event.data.data;

          setNotifications((prevNotifications) => [
            newNotification,
            ...prevNotifications,
          ]);

          // 알림을 로컬 스토리지에 저장
          const savedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
          localStorage.setItem('notifications', JSON.stringify([newNotification, ...savedNotifications]));
        }
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
    }

    const handleOutsideClick = (event) => {
      if (!event.target.closest('.notification-dropdown')) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      }
    };
  }, [isOpen, closeDropdown]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <NotificationMenu className="notification-dropdown">
      <h3>{notifications.length > 0 ? `새로운 알림이 ${notifications.length}개 있습니다!` : '알림이 없습니다.'}</h3>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <li key={index}>
              <p><strong>탐지 ID:</strong> {notification.title}</p>
              <p><strong>탐지 내용:</strong> {notification.body}</p>
              {/* <p><strong>탐지 정확도:</strong> {notification.detection_accuracy}</p> */}
            </li>
          ))
        ) : (
          <li>알림이 없습니다.</li>
        )}
      </ul>
    </NotificationMenu>,
    document.body
  );
};

export default NotificationDropdown;

const NotificationMenu = styled.div`
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
  width: 300px;
  max-height: 300px;
  overflow-y: auto;

  h3 {
    margin: 0;
    font-size: 16px;
  }

  p {
    font-weight: bold;
    font-size: 14px;
    margin: 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      border-bottom: 1px solid #ddd;
      border-radius: 8px;
      padding: 10px 0;

      &:hover {
        background-color: #e0e0e0;
      }

      p {
        margin: 5px 5px;
      }
    }
  }

  body.dark-mode & {
    background-color: #333;
    color: #fff;
    border-color: #555;
  }
`;
