import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// ReactDOM.createRoot를 사용하여 루트 요소에 React 애플리케이션을 렌더링합니다.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <App />
  </>
);

// 서비스 워커 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// // 클라이언트 측 코드
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/service-worker.js')
//     .then(registration => {
//       console.log('Service Worker registered with scope:', registration.scope);
//     })
//     .catch(error => {
//       console.error('Service Worker registration failed:', error);
//     });
  
//   navigator.serviceWorker.addEventListener('message', (event) => {
//     if (event.data && event.data.type === 'SAVE_PUSH_DATA') {
//       const pushData = event.data.data;
//       console.log('Saving push data to localStorage:', pushData);
      
//       // 로컬 스토리지에 저장
//       localStorage.setItem('pushData', JSON.stringify(pushData));
//     }
//   });
// }
