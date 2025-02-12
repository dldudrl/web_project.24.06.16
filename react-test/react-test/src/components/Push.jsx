import React, { useEffect, useState } from 'react';

const Push = () => {
  const [vapidKey, setVapidKey] = useState(null);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const fetchVapidKey = async () => {
    try {
      const response = await fetch('http://172.30.1.56:8081/vapid-public-key');
      if (!response.ok) {
        throw new Error(`HTTP 오류! 상태: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("JSON 응답이 아닙니다");
      }
      const data = await response.json();
      setVapidKey(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) return;

    let registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      registration = await navigator.serviceWorker.register('/service-worker.js');
    }
  };

  const subscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();

      if (existingSubscription) {
        await existingSubscription.unsubscribe();
      }

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey.public_key)
      });

      console.log('사용자가 구독되었습니다:', newSubscription.toJSON());

      let user_info = localStorage.getItem('user_info');
      user_info = JSON.parse(user_info);

      const subscribtion = {
        user_id: user_info.user_id,
        endpoint: newSubscription.toJSON().endpoint,
        user_email: user_info.user_email,
        private_key: vapidKey.private_key,
        auth: newSubscription.toJSON().keys.auth,
        p256dh: newSubscription.toJSON().keys.p256dh
      };

      const response = await fetch('http://172.30.1.85:8081/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscribtion)
      });

      const data = await response.json();
      console.log('서버에 구독 정보 전송 완료:', data);

    } catch (error) {
      console.error('사용자 구독 실패:', error);
    }
  };

  const init = async () => {
    await fetchVapidKey();
    await registerServiceWorker();
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (vapidKey) {
      subscribeUser();
    }
  }, [vapidKey]);

  return <></>;
};

export default Push;
