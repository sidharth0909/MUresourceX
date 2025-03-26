import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';


const SubjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

const SubjectCard = styled.div`
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 15px rgba(0,255,136,0.3);
  }
`;

const SubjectSelector = ({ branch, semester, onSelect }) => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/subjects/${branch}/${semester}`)
      .then(res => res.json())
      .then(setSubjects);
  }, [branch, semester]);

  return (
    <SubjectGrid>
      {subjects.map(subject => (
        <SubjectCard key={subject} onClick={() => onSelect(subject)}>
          {subject}
        </SubjectCard>
      ))}
    </SubjectGrid>
  );
};

export default SubjectSelector;