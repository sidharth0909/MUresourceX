const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve PDFs from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Ensure 'uploads' directory exists
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Subject Data for Each Branch & Semester
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

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { branch, semester, subject } = req.body;

    // ✅ Debugging logs
    console.log("Received data:", req.body);

    if (!branch || !semester || !subject) {
      return cb(new Error("Branch, semester, and subject are required"));
    }

    const dir = path.join(__dirname, `uploads/${branch}/${semester}/${subject}`);

    ensureDirExists(dir); // ✅ Create necessary directories
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).fields([
  { name: 'file', maxCount: 1 },
  { name: 'branch' },
  { name: 'semester' },
  { name: 'subject' }
]);

// Admin Credentials
const ADMIN = {
  email: "admin@gmail.com",
  password: "admin123"
};

// Admin login route
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN.email && password === ADMIN.password) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

// Upload Route
app.post('/api/upload', (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.error("Error in file upload:", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.files || !req.files.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    res.json({
      success: true,
      path: req.files.file[0].path,
      name: req.files.file[0].originalname
    });
  });
});

// Delete File Route
app.delete('/api/delete', (req, res) => {
  const { filePath } = req.body;
  try {
    fs.unlinkSync(path.join(__dirname, filePath));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Fetch Uploaded Files
app.get('/api/resources/:branch/:semester/:subject', (req, res) => {
  const dir = path.join(__dirname, `uploads/${req.params.branch}/${req.params.semester}/${req.params.subject}`);

  if (!fs.existsSync(dir)) return res.json([]);

  const files = fs.readdirSync(dir).map(file => ({
    id: uuidv4(),
    name: file,
    path: `/uploads/${req.params.branch}/${req.params.semester}/${req.params.subject}/${file}`
  }));

  res.json(files);
});

// Fetch Subjects for a Given Branch & Semester
app.get('/api/subjects/:branch/:semester', (req, res) => {
  const { branch, semester } = req.params;

  // Ensure valid branch and semester
  if (!subjectsData[branch] || !subjectsData[branch][semester]) {
    return res.status(404).json({ error: "Subjects not found" });
  }

  res.json(subjectsData[branch][semester]);
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
