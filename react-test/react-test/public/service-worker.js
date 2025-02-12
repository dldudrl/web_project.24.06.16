((self)=>{

  self.addEventListener('push', (event) => {
    const message = event.data?.json();
    console.log('푸시 메시지:', message);
    
    event.waitUntil(
      self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
        // 모든 열린 클라이언트에 푸시 데이터 전송
        clients.forEach((client) => {
          client.postMessage({
            type: 'NEW_NOTIFICATION',
            data: message
          });
        });
        
        return self.registration.showNotification(message.title, {
          body: message.body,
        });
      })
    );
  });
  
})(self)