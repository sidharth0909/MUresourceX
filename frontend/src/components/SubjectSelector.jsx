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
const LoadingMessage = styled.p`
  color: #00ff88;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: #ff5555;
  text-align: center;
`;

const SubjectSelector = ({ branch, semester, onSelect }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/files/subjects/${branch}/${semester}`
        );
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch subjects");
        }

        setSubjects(data.subjects);
        setError(null);
      } catch (err) {
        setError(err.message);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [branch, semester]);

  if (loading) {
    return <LoadingMessage>Loading subjects...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }

  return (
    <SubjectGrid>
      {subjects.map((subject) => (
        <SubjectCard key={subject} onClick={() => onSelect(subject)}>
          {subject}
        </SubjectCard>
      ))}
    </SubjectGrid>
  );
};

export default SubjectSelector;