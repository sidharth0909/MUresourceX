import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PDFViewer from "./PDFViewer";
import { supabase, getResourcePath } from "../supabase";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 2rem;
`;

const Card = styled.div`
  background: #10131a;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 255, 136, 0.2);
  padding: 1rem;
  width: 280px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 255, 136, 0.3);
  }
`;

const Preview = styled.div`
  height: 150px;
  background: #222;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;

  &:hover {
    opacity: 0.9;
  }
`;

const PDFOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }

  span {
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
  }
`;

const PDFFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
`;

const FileName = styled.div`
  color: #00ff88;
  font-weight: bold;
  margin: 0.5rem 0;
`;

const DownloadButton = styled.a`
  display: block;
  background: #00ff88;
  color: #000;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.3s ease;

  &:hover {
    background: #00ffee;
  }
`;

const ResourceList = ({ branch, semester, subject }) => {
  const [resources, setResources] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      const cleanBranch = branch.replace(/\s+/g, '-').toLowerCase();
      const cleanSemester = `semester-${semester}`;
      const cleanSubject = subject.replace(/\s+/g, '-').toLowerCase();
  
      const { data } = await supabase.storage
        .from('books')
        .list(`${cleanBranch}/${cleanSemester}/${cleanSubject}`);
  
      setResources(data || []);
    };
    
    if (branch && semester && subject) fetchResources();
  }, [branch, semester, subject]);
  
  const getFileUrl = (fileName) => 
    supabase.storage
      .from('books')
      .getPublicUrl(
        `${branch.replace(/\s+/g, '-').toLowerCase()}/` +
        `semester-${semester}/` + // This matches upload format
        `${subject.replace(/\s+/g, '-').toLowerCase()}/` +
        fileName
      ).data.publicUrl;

  return (
    <Container>
      {resources.map((resource) => (
        <Card key={resource.name}>
          <Preview onClick={() => setSelectedPdf(resource)}>
            {resource.name.endsWith(".pdf") ? (
              <>
<PDFFrame
  src={`${getFileUrl(resource.name)}#toolbar=0&view=fitH`}
  title={resource.name}
  onError={(e) => {
    console.error('PDF load error:', e);
    setSelectedPdf(null);
  }}
/>
                <PDFOverlay>
                  <span>Click to View</span>
                </PDFOverlay>
              </>
            ) : (
              <span>📁 {resource.name}</span>
            )}
          </Preview>
          <FileName>{resource.name}</FileName>
          <DownloadButton
            href={getFileUrl(resource.name)}
            download
          >
            Download
          </DownloadButton>
        </Card>
      ))}
      {selectedPdf && (
        <PDFViewer
          file={getFileUrl(selectedPdf.name)}
          onClose={() => setSelectedPdf(null)}
        />
      )}
    </Container>
  );
};

export default ResourceList;
