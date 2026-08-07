Avatar upload example

This branch adds a simple example server and front-end to demonstrate avatar uploads.

Files added under the branch feature/add-avatar-upload:

- server/package.json
- server/server.js
- public/profile.html
- public/js/upload-profile.js
- .gitignore

Quick start (local):

1. Install dependencies and start the server
   cd server
   npm install
   npm start

2. Open http://localhost:5173/profile.html in your browser (the Express server serves the public/ directory at /)

Notes:
- Uploaded files are stored in the repository root's uploads/ directory when using the example server.
- This example is for local testing and demonstration only. For production use, replace local storage with S3/Cloud Storage and secure the endpoints with authentication.
- If you have a service worker registered in the site, unregister it while testing (DevTools → Application → Service Workers) to avoid cached pages interfering with the test.
