import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const AdContainer = styled.div`
  background: rgba(32, 32, 32, 0.7);
  padding: 1rem 0; /* Reduced vertical padding */
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px; /* Set minimum height */
`;

const AdContent = styled.div`
  width: 100%;
  max-width: 100%; /* Take full width */
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  
  a {
    display: block;
    width: 100%;
    text-align: center;
  }

  img {
    width: 100%;
    max-height: 150px; /* Adjust based on your needs */
    object-fit: contain; /* Maintain aspect ratio */
    cursor: pointer;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 50%;
  z-index: 101;
`;

const AdFooter = () => {
  const [adData, setAdData] = useState(null);
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/ads/current');
        
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON, got: ${text.substring(0, 50)}...`);
        }

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || `HTTP error! Status: ${response.status}`);
        }

        setAdData(data.ad);
        setError(null);
      } catch (err) {
        console.error('Ad fetch error:', err);
        setError(err.message);
        setAdData(null);
      }
    };

    fetchAd();
  }, []);

  if (!visible) return null;

  return (
    <AdContainer>
      {error ? (
        <div className="error-message">
          Advertisement unavailable: {error}
        </div>
      ) : adData ? (
        <>
          <AdContent>
            <a 
              href={`http://localhost:5000/api/ads/click/${adData._id || adData.adId}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img 
                src={adData.imageUrl} 
                alt="Advertisement" 
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '100px'
                }}
              />
            </a>
          </AdContent>
          <CloseButton onClick={() => setVisible(false)}>×</CloseButton>
        </>
      ) : (
        <div className="loading-message">
          Loading advertisement...
        </div>
      )}
    </AdContainer>
  );
};

export default AdFooter;