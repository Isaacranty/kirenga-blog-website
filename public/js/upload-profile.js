// Client-side upload script (public/js/upload-profile.js)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('avatarForm');
  const input = document.getElementById('avatar');
  const img = document.getElementById('profileImage');

  // If a previously uploaded URL is stored in localStorage, show it
  const saved = localStorage.getItem('profile_avatar_url');
  if (saved) img.src = saved;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = input.files[0];
    if (!file) return alert('Please choose an image file');

    const fd = new FormData();
    fd.append('avatar', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      // Update UI and persist URL locally
      img.src = data.url + '?t=' + Date.now(); // cache-bust
      localStorage.setItem('profile_avatar_url', data.url);
      alert('Upload successful');
    } catch (err) {
      console.error(err);
      alert('Upload error: ' + (err.message || err));
    }
  });
});
