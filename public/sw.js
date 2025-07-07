// Handle incoming push notifications
self.addEventListener('push', (event) => {
  const payload = event.data?.json() || { 
    title: 'Reminder', 
    body: 'You have a new reminder!' 
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/placeholder.svg', // Use your own icon
      vibrate: [200, 100, 200] // Optional vibration pattern
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') // Opens your app homepage
  );
});