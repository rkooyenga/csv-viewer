if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registered'))
    .catch(error => console.error('Service Worker registration failed:', error));
  
  self.addEventListener('fetch', function(event) {
  // it can be empty if you just want to load from cache
});
