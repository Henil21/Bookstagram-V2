const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5000;

// CORS middleware to allow React app to access the backend
app.use(cors());

// Set up storage engine for multer (saving books to a local folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filenames
  },
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// POST route to upload books
app.post('/upload', upload.single('book'), (req, res) => {
  res.json({ file: req.file });
});

// Get all uploaded books
app.get('/books', (req, res) => {
  const fs = require('fs');
  const path = './uploads/';
  fs.readdir(path, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Unable to fetch books' });
    }
    res.json({ books: files });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
