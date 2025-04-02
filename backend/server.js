const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const fileRoutes = require('./routes/fileroutes');
const adsRouter = require('./routes/ads');


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory        
app.use('/api/ads', adsRouter);
app.use('/api/ads',adsRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/files', fileRoutes);

const PORT = process.env.PORT || 5000;


app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`);
  }
});
console.log('Registered routes:');

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));