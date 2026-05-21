// Service Worker — ทำให้เปิดแอปได้แม้สัญญาณไม่ดี และจำเป็นสำหรับการติดตั้ง PWA
const CACHE = 'rio3-dash-v27';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  // ข้อมูลจาก Google Apps Script ต้องดึงสดเสมอ (ไม่ cache)
  if (e.request.url.includes('script.google.com')) {
    return; // ปล่อยให้ fetch ปกติ ดึงข้อมูลใหม่ทุกครั้ง
  }
  // ไฟล์อื่นๆ ลองใช้ network ก่อน ถ้าไม่ได้ค่อยใช้ cache
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
