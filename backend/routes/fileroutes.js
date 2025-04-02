const express = require('express');
const multer = require('multer');
const File = require('../models/file');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory

// Upload a file to the database
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { branch, semester, subject } = req.body;
    if (!branch || !semester || !subject || !req.file) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const file = new File({
      branch,
      semester,
      subject,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileData: req.file.buffer.toString('base64'), // Convert to Base64
    });

    await file.save();
    res.json({ success: true, message: 'File uploaded successfully', file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fetch files from the database
router.get('/:branch/:semester/:subject?', async (req, res) => {
  try {
    const { branch, semester, subject } = req.params;
    let query = { branch, semester };
    if (subject) query.subject = subject;

    const files = await File.find(query);
    res.json(files);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch files' });
  }
});

// Download a file
router.get('/download/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    const buffer = Buffer.from(file.fileData, 'base64');
    res.set({
      'Content-Type': file.fileType,
      'Content-Disposition': `attachment; filename="${file.fileName}"`,
    });
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a file from the database
router.delete('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    await file.deleteOne();
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



// Add this route to your router file
router.get('/subjects/:branch/:semester', (req, res) => {
  const { branch, semester } = req.params;
  
  // You can use the same subjectsData structure from your frontend
  const subjectsData = {
    "Computer Engineering": {
      "1": ["Mathematics-I", "Physics", "Chemistry", "Programming", "Communication Skills"],
      "2": ["Mathematics-II", "Data Structures", "Digital Logic", "OOP", "Discrete Math"],
      "3": ["Operating Systems", "DBMS", "Computer Networks", "Software Engineering", "Web Development"],
      "4": ["Machine Learning", "AI", "Computer Graphics", "Theory of Computation", "Cloud Computing"],
      "5": ["Big Data Analytics", "Cyber Security", "Embedded Systems", "Distributed Computing", "IoT"],
      "6": ["Blockchain", "Data Mining", "Wireless Networks", "Advanced Algorithms", "DevOps"],
      "7": ["Quantum Computing", "Deep Learning", "AR/VR", "Computational Linguistics", "Edge AI"],
      "8": ["Research Methods", "Industry Project", "Ethical Hacking", "Startup Engineering", "Robotics"]
    },
    "Mechanical Engineering": {
      "1": ["Mathematics-I", "Engineering Physics", "Engineering Chemistry", "Basic Electrical", "Workshop"],
      "2": ["Mathematics-II", "Mechanics", "Thermodynamics", "Engineering Graphics", "Material Science"],
      "3": ["Fluid Mechanics", "Machine Design", "Heat Transfer", "Manufacturing", "Engineering Drawing"],
      "4": ["Dynamics of Machines", "Control Systems", "CAD/CAM", "Power Plant Engineering", "Robotics"],
      "5": ["IC Engines", "Refrigeration & AC", "Automobile Engineering", "Finite Element Method", "Mechatronics"],
      "6": ["Industrial Engineering", "3D Printing", "Vibration Analysis", "Welding Tech", "Product Design"],
      "7": ["Automation & AI", "Turbomachinery", "Renewable Energy", "Advanced Manufacturing", "Smart Materials"],
      "8": ["Capstone Project", "Entrepreneurship", "Green Manufacturing", "Aerospace Engineering", "Nano Tech"]
    },
    "Electrical Engineering": {
      "1": ["Mathematics-I", "Basic Electrical Engineering", "Physics", "Chemistry", "Workshop"],
      "2": ["Mathematics-II", "Circuit Analysis", "Electronics", "Electromagnetic Theory", "Signals & Systems"],
      "3": ["Power Systems", "Control Systems", "Electrical Machines", "Analog Electronics", "Microprocessors"],
      "4": ["Digital Signal Processing", "Power Electronics", "Network Theory", "Instrumentation", "AI in Power"],
      "5": ["Electric Drives", "Renewable Energy Systems", "Embedded Systems", "High Voltage Engineering", "IoT"],
      "6": ["Smart Grids", "Electrical Vehicle Tech", "Wireless Power Transfer", "Robotics", "Power Management"],
      "7": ["Optoelectronics", "Advanced Control Systems", "AI in Electrical", "Industrial Automation", "Cybersecurity"],
      "8": ["Project", "Research", "Management & Economics", "Entrepreneurship", "Ethics in Engineering"]
    },
    "Civil Engineering": {
      "1": ["Mathematics-I", "Engineering Mechanics", "Physics", "Chemistry", "Drawing"],
      "2": ["Mathematics-II", "Strength of Materials", "Structural Analysis", "Surveying", "Hydraulics"],
      "3": ["Building Materials", "Concrete Technology", "Geotechnical Engineering", "Transportation", "Design of Structures"],
      "4": ["Environmental Engineering", "Water Resources", "Construction Management", "Earthquake Engineering", "Bridge Engineering"],
      "5": ["Smart Cities", "Infrastructure Planning", "Sustainable Construction", "Tunnel Engineering", "Traffic Engineering"],
      "6": ["GIS & Remote Sensing", "Pavement Design", "Advanced Concrete Structures", "Hydrology", "Rock Mechanics"],
      "7": ["Disaster Management", "Green Buildings", "Urban Planning", "Air Pollution Control", "Seismic Design"],
      "8": ["Final Year Project", "Internship", "Business in Civil Engineering", "Construction Automation", "Smart Materials"]
    }
  
  };
  
  if (subjectsData[branch] && subjectsData[branch][semester]) {
    res.json(subjectsData[branch][semester]);
  } else {
    res.status(404).json({ message: 'Subjects not found for this branch and semester' });
  }
});

module.exports = router;