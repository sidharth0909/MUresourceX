import React, { useState } from "react"; 
import styled, { keyframes } from "styled-components";
import { FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
`;

const ViewerContainer = styled.div`
  background: #121212;
  border-radius: 12px;
  width: 80%;
  height: 85vh;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background: ${({ color }) => color || "#00ff88"};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #000;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ hoverColor }) => hoverColor || "#00ffee"};
  }
`;

const PDFFrame = styled.iframe`
  width: 100%;
  height: 90%;
  border: none;
  border-radius: 8px;
  background: #222;
`;

const PDFViewer = ({ file, onClose }) => {
  const [pageNumber, setPageNumber] = useState(1);

  return (
    <Overlay>
      <ViewerContainer>
        <Controls>
          <Button onClick={() => setPageNumber((p) => Math.max(1, p - 1))}>
            <FiArrowLeft /> Previous
          </Button>
          <span style={{ color: "#fff", fontSize: "1.2rem" }}>
            Page {pageNumber}
          </span>
          <Button onClick={() => setPageNumber((p) => p + 1)}>
            Next <FiArrowRight />
          </Button>
          <Button color="#ff4444" hoverColor="#ff6666" onClick={onClose}>
            <FiX /> Close
          </Button>
        </Controls>
        <PDFFrame src={`${file}#page=${pageNumber}`} title="PDF Viewer" />
      </ViewerContainer>
    </Overlay>
  );
};

export default PDFViewer;
