import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import BranchSelector from './BranchSelector';
import SemesterSelector from './SemesterSelector';
import SubjectSelector from './SubjectSelector';
import ResourceList from './ResourceList';
import Particles from 'react-tsparticles';
import { loadSlim } from "tsparticles-slim";
import styled, { keyframes } from 'styled-components';

const cursorPull = keyframes`
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
  100% { transform: translate(-50%, -50%) scale(1); }
`;

const Container = styled.div`
  background: radial-gradient(ellipse at bottom, #1a1a2e 0%, #000000 100%);
  min-height: 100vh;
  color: #fff;
  position: relative;
  overflow: hidden;
  cursor: none;
  
  &:hover .cursor-trail {
    opacity: 1;
  }
`;

const CursorTrail = styled.div`
  position: fixed;
  pointer-events: none;
  width: 20px;
  height: 20px;
  border: 2px solid #00ff88;
  border-radius: 50%;
  animation: ${cursorPull} 2s infinite;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 9999;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StudentDashboard = () => {
    const [selectedBranch, setBranch] = useState(null);
    const [selectedSemester, setSemester] = useState(null);
    const [selectedSubject, setSubject] = useState(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const particlesRef = useRef(null);
    const attractorRefs = useRef([]);

    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    useEffect(() => {
        const updateCursorPosition = (e) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', updateCursorPosition);
        return () => window.removeEventListener('mousemove', updateCursorPosition);
    }, []);

    const particlesOptions = {
    particles: {
        number: { value: 60 }, // Slightly reduced number for better performance
        color: { value: "#00ff88" },
        opacity: { value: 0.7 },
        size: { value: 1 },
        links: {
            enable: true,
            distance: 200, // Increased link distance
            color: "#00ff88",
            opacity: 0.3,
            width: 1
        },
        move: {
            enable: true,
            speed: 5, // Increased general movement speed
            direction: "none",
            outModes: "bounce",
            attract: {
                enable: true,
                rotateX: 1000, // Stronger rotation forces
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
                distance: 400, // Larger attraction radius
                duration: 0.1, // Faster attraction response
                speed: 5, // Stronger attraction force
                targets: [
                    { type: "cursor", position: "cursor" },
                    { selector: ".attractor", position: "attractor" }
                ]
            }
        }
    }
    };

    return (
        <Container>
            <CursorTrail 
                className="cursor-trail" 
                style={{ 
                    left: `${cursorPos.x}px`,
                    top: `${cursorPos.y}px`
                }} 
            />
            
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={particlesOptions}
                ref={particlesRef}
                style={{ position: 'absolute' }}
            />
            
            {/* Add attractor points to navigation elements */}
            <div className="attractor" ref={el => attractorRefs.current[0] = el} 
                style={{ position: 'absolute', left: '50%', top: '80px' }} />
            <div className="attractor" ref={el => attractorRefs.current[1] = el} 
                style={{ position: 'absolute', left: '30%', top: '50%' }} />
            <div className="attractor" ref={el => attractorRefs.current[2] = el} 
                style={{ position: 'absolute', left: '70%', top: '50%' }} />

            <Navbar />
            <Content>
                <div className="selection-container">
                    <BranchSelector onSelect={setBranch} />
                    {selectedBranch && (
                        <SemesterSelector branch={selectedBranch} onSelect={setSemester} />
                    )}
                    {selectedSemester && (
                        <SubjectSelector
                            branch={selectedBranch}
                            semester={selectedSemester}
                            onSelect={setSubject}
                        />
                    )}
                    {selectedSubject && (
                        <ResourceList
                            branch={selectedBranch}
                            semester={selectedSemester}
                            subject={selectedSubject}
                        />
                    )}
                </div>
            </Content>
        </Container>
    );
};

export default StudentDashboard;