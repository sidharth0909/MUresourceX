import React from 'react';
import styled from 'styled-components';

const BranchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

const BranchCard = styled.div`
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

const branches = [
  'Computer Engineering', 
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering'
];

const BranchSelector = ({ onSelect }) => {
  return (
    <BranchGrid>
      {branches.map(branch => (
        <BranchCard key={branch} onClick={() => onSelect(branch)}>
          {branch}
        </BranchCard>
      ))}
    </BranchGrid>
  );
};

export default BranchSelector;