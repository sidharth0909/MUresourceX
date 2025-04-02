import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import Navbar from './Navbar';
import BranchSelector from './BranchSelector';
import SemesterSelector from './SemesterSelector';
import SubjectSelector from './SubjectSelector';
import ResourceList from './ResourceList';
import Particles from 'react-tsparticles';
import { loadSlim } from "tsparticles-slim";

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
  transform: translate(-50%, -50%);
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StudentDashboard = () => {
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
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

    const handleBranchSelect = (branch) => {
        setSelectedBranch(branch);
        setSelectedSemester(null);
        setSelectedSubject(null);
    };

    const handleSemesterSelect = (semester) => {
        setSelectedSemester(semester);
        setSelectedSubject(null);
    };

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
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
            
            {/* Attractor points */}
            <div className="attractor" ref={el => attractorRefs.current[0] = el} 
                style={{ position: 'absolute', left: '50%', top: '80px' }} />
            <div className="attractor" ref={el => attractorRefs.current[1] = el} 
                style={{ position: 'absolute', left: '30%', top: '50%' }} />
            <div className="attractor" ref={el => attractorRefs.current[2] = el} 
                style={{ position: 'absolute', left: '70%', top: '50%' }} />

            <Navbar />
            <Content>
                <SelectionContainer>
                    <BranchSelector onSelect={handleBranchSelect} />
                    {selectedBranch && (
                        <SemesterSelector 
                            branch={selectedBranch} 
                            onSelect={handleSemesterSelect} 
                        />
                    )}
                    {selectedSemester && (
                        <SubjectSelector
                            branch={selectedBranch}
                            semester={selectedSemester}
                            onSelect={handleSubjectSelect}
                        />
                    )}
                    {selectedSubject && (
                        <ResourceList
                            branch={selectedBranch}
                            semester={selectedSemester}
                            subject={selectedSubject}
                            onBack={() => setSelectedSubject(null)}
                        />
                    )}
                </SelectionContainer>
            </Content>
        </Container>
    );
};

export default StudentDashboard;