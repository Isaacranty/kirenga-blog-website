const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5173;

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const safeName = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, safeName);
  }
});

function fileFilter (req, file, cb) {
  // Accept images only
  if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are allowed'), false);
  cb(null, true);
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

app.use(cors());
// Serve the public static site from the repo's public/ directory
app.use('/', express.static(path.join(__dirname, '..', 'public')));
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Simple upload endpoint
app.post('/api/upload', upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`; // served by this server
  return res.json({ url });
});

// Basic health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err && err.message ? err.message : err);
  res.status(400).json({ message: err && err.message ? err.message : 'Upload error' });
});

app.listen(PORT, () => console.log(`Avatar upload server listening on http://localhost:${PORT}`));
