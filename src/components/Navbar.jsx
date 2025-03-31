import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiUser, FiLogIn, FiMessageSquare } from 'react-icons/fi';
import { IconButton, useMediaQuery } from '@mui/material';

const Nav = styled.nav`
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #00ff88, #00ffee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Links = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const ActionIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
`;

const Navbar = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Nav>
      <Logo onClick={() => navigate('/')}>MUResourceX</Logo>

      <Links>
        <NavLink onClick={() => navigate('/student')}>
          <FiUser /> {!isMobile && 'Student'}
        </NavLink>
        <NavLink onClick={() => navigate('/admin')}>
          <FiLogIn /> {!isMobile && 'Admin'}
        </NavLink>

        {/* <ActionIcons>
          <IconButton 
            onClick={() => navigate('/chat')} // ✅ Navigate to the chat page
            style={{ color: '#00ff88' }}
            aria-label="PDF Chat"
            size="small"
          >
            <FiMessageSquare />
          </IconButton>
        </ActionIcons> */}
      </Links>
    </Nav>
  );
};

export default Navbar;
