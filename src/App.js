import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import StudentDashboard from './components/StudentDashboard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import './styles/main.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;