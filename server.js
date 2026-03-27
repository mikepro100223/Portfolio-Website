const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Data file path
const DATA_FILE = './content-data.json';

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  const initialData = {
    projects: [],
    skills: {
      frontend: { skills: [] },
      backend: { skills: [] },
      tools: { skills: [] }
    },
    about: {
      de: { text: "", highlight: "" },
      en: { text: "", highlight: "" }
    },
    stats: {
      projects: 10,
      technologies: 5,
      commits: 1000
    }
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// Helper functions
function readData() {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// ===== AUTH ROUTES =====

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Verify token
app.get('/api/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// ===== CONTENT ROUTES =====

// Get all content
app.get('/api/content', (req, res) => {
  const data = readData();
  res.json(data);
});

// Get projects
app.get('/api/projects', (req, res) => {
  const data = readData();
  res.json(data.projects || []);
});

// Create/Update project
app.post('/api/projects', authenticateToken, (req, res) => {
  const data = readData();
  const project = req.body;
  
  if (project.id) {
    // Update existing
    const index = data.projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      data.projects[index] = project;
    }
  } else {
    // Create new
    project.id = Date.now();
    data.projects.push(project);
  }
  
  writeData(data);
  res.json(project);
});

// Delete project
app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  const data = readData();
  data.projects = data.projects.filter(p => p.id != req.params.id);
  writeData(data);
  res.json({ success: true });
});

// Get skills
app.get('/api/skills', (req, res) => {
  const data = readData();
  res.json(data.skills || {});
});

// Update skills
app.post('/api/skills', authenticateToken, (req, res) => {
  const data = readData();
  data.skills = req.body;
  writeData(data);
  res.json(data.skills);
});

// Get about
app.get('/api/about', (req, res) => {
  const data = readData();
  res.json(data.about || {});
});

// Update about
app.post('/api/about', authenticateToken, (req, res) => {
  const data = readData();
  data.about = req.body;
  writeData(data);
  res.json(data.about);
});

// Get stats
app.get('/api/stats', (req, res) => {
  const data = readData();
  res.json(data.stats || {});
});

// Update stats
app.post('/api/stats', authenticateToken, (req, res) => {
  const data = readData();
  data.stats = req.body;
  writeData(data);
  res.json(data.stats);
});

// Get contact
app.get('/api/contact', (req, res) => {
  const data = readData();
  res.json(data.contact || {});
});

// Update contact
app.post('/api/contact', authenticateToken, (req, res) => {
  const data = readData();
  data.contact = req.body;
  writeData(data);
  res.json(data.contact);
});

// Upload file
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.filename });
});

// Validate required environment variables
const REQUIRED_ENV_VARS = ['JWT_SECRET', 'ADMIN_USERNAME', 'ADMIN_PASSWORD'];
const missingVars = REQUIRED_ENV_VARS.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  console.error('Please ensure your .env file is loaded or environment variables are set.');
  process.exit(1);
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Admin login: ${process.env.ADMIN_USERNAME} / ${process.env.ADMIN_PASSWORD}`);
  console.log(`🔒 JWT Secret: ${process.env.JWT_SECRET.substring(0, 10)}...`);
});
