import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import styled from 'styled-components';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Import Firebase auth

const Container = styled.div`
  background: radial-gradient(ellipse at bottom, #1a1a2e 0%, #000000 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  position: relative;
  overflow: hidden;
`;

const LoginBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 400px;
  z-index: 1;
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: #fff;
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #00ff88;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #00cc6a;
  }
`;

const particlesOptions = {
  particles: {
    number: { value: 60 },
    color: { value: "#00ff88" },
    opacity: { value: 0.7 },
    size: { value: 1 },
    links: {
      enable: true,
      distance: 200,
      color: "#00ff88",
      opacity: 0.3,
      width: 1
    },
    move: {
      enable: true,
      speed: 5,
      direction: "none",
      outModes: "bounce",
      attract: {
        enable: true,
        rotateX: 1000,
        rotateY: 2000
      }
    }
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "attract",
        parallax: { enable: false, force: 60 }
      }
    },
    modes: {
      attract: {
        distance: 400,
        duration: 0.1,
        speed: 5,
        targets: [
          { type: "cursor", position: "cursor" },
          { selector: ".attractor", position: "attractor" }
        ]
      }
    }
  }
};

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard'); // Redirect to admin dashboard
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Container>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        style={{ position: 'absolute' }}
      />
      
      <LoginBox>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <InputField
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <InputField
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: '#ff4444', margin: '10px 0' }}>{error}</p>}
          <Button type="submit">Login</Button>
        </form>
      </LoginBox>
    </Container>
  );
};

export default AdminLogin;