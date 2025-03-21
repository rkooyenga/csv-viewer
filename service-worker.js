if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch(error => console.error('Service Worker registration failed:', error));
}

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
  //check url first.
    if (event.request.method === 'POST' && url.pathname === '/index.html') {
        event.respondWith((async () => {
            try {
                const formData = await event.request.formData();
                const file = formData.get('file');

                if (!file) {
                  console.warn('No file received in share.');
                  return Response.redirect('./index.html?error=nofile', 303);
                }
                //check for empty or invalid
                if (!(file instanceof Blob)) {
                   console.error('Invalid file object received.');
                   return Response.redirect('./index.html?error=invalidfile', 303);
                }
              //store the data.
                await caches.open('shared-csv-data').then(cache => {
                    cache.put('shared.csv', new Response(file));
                });

                return Response.redirect('./index.html?shared=true', 303);  // Redirect to main page, indicating a share.

            } catch (error) {
                console.error("Error in service worker:", error);
                return Response.redirect(`./index.html?error=${encodeURIComponent(error.message)}`, 303);
            }
        })());
    }
});

