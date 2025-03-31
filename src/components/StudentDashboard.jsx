import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import BranchSelector from './BranchSelector';
import SemesterSelector from './SemesterSelector';
import SubjectSelector from './SubjectSelector';
import ResourceList from './ResourceList';
import Particles from 'react-tsparticles';
import { loadSlim } from "tsparticles-slim";
import styled from 'styled-components';
import ChatBot from './Chatbot';

const Container = styled.div`
  background: radial-gradient(ellipse at bottom, #1a1a2e 0%, #000000 100%);
  min-height: 100vh;
  color: #fff;
  position: relative;
  overflow: hidden;
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
    const particlesRef = useRef(null);
    const attractorRefs = useRef([]);

    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
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
                    enable: false, // Disable default attraction
                    rotateX: 0,
                    rotateY: 0
                }
            }
        },
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: "repulse",
                }
            },
            modes: {
                repulse: {
                    distance: 200,
                    duration: 0.4,
                    speed: 3,
                    factor: 1,
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
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={particlesOptions}
                ref={particlesRef}
                style={{ position: 'absolute' }}
            />
            
            {/* Attractor points (now acting as repulsors) */}
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
            {/* <ChatBot /> Chatbot component */}
        </Container>
    );
};

export default StudentDashboard;