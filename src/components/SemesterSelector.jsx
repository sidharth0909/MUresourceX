import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SemesterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

const SemesterCard = styled.div`
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: ${props => props.active ? '2px solid #00ff88' : 'none'};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 10px rgba(0,255,136,0.2);
  }
`;

const SemesterSelector = ({ branch, onSelect }) => {
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const [selected, setSelected] = useState(null);

  return (
    <SemesterGrid>
      {semesters.map(sem => (
        <SemesterCard 
          key={sem}
          onClick={() => {
            setSelected(sem);
            onSelect(sem);
          }}
          active={selected === sem}
        >
          Semester {sem}
        </SemesterCard>
      ))}
    </SemesterGrid>
  );
};

export default SemesterSelector;