import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiUser, FiLogIn, FiMenu, FiX } from 'react-icons/fi';

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

const MenuIcon = styled.div`
  display: none;
  cursor: pointer;
  font-size: 1.8rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Links = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: rgba(10, 10, 10, 0.9);
    backdrop-filter: blur(10px);
    padding: 1rem;
    display: ${({ open }) => (open ? 'flex' : 'none')};
  }
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

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Nav>
      <Logo onClick={() => navigate('/')}>MUResourceX</Logo>
      <MenuIcon onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </MenuIcon>
      <Links open={menuOpen}>
        <NavLink onClick={() => { setMenuOpen(false); navigate('/student'); }}>
          <FiUser /> Student
        </NavLink>
        <NavLink onClick={() => { setMenuOpen(false); navigate('/admin'); }}>
          <FiLogIn /> Admin
        </NavLink>
      </Links>
    </Nav>
  );
};

export default Navbar;