import React, { useState } from 'react';
import styled from 'styled-components';

const AdForm = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
`;

const FormField = styled.div`
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #00ff88;
  border-radius: 4px;
  color: white;
`;

const SubmitButton = styled.button`
  background: #00ff88;
  color: #1a1a2e;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
`;

const Message = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
  color: ${(props) => (props.type === 'success' ? '#155724' : '#721c24')};
  background-color: ${(props) => (props.type === 'success' ? '#d4edda' : '#f8d7da')};
  border: ${(props) => (props.type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb')};
`;

const AdManagement = () => {
  const [formData, setFormData] = useState({
    imageUrl: '',
    link: '',
    duration: 7, // days
  });

  // Define state for messages
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: formData.imageUrl.trim(),
          link: formData.link.trim(),
          duration: Number(formData.duration) || 7
        }),
      });
  
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server returned: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create advertisement');
      }
  
      // Success case
      setMessage({ type: 'success', text: data.message });
      setFormData({ imageUrl: '', link: '', duration: 7 });
      
    } catch (error) {
      console.error('Post error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to create advertisement. Please try again.' 
      });
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AdForm>
      <h3>Advertisement Management</h3>
      <form onSubmit={handleSubmit}>
        <FormField>
          <label>Image URL:</label>
          <Input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
          />
        </FormField>
        <FormField>
          <label>Destination Link:</label>
          <Input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            required
          />
        </FormField>
        <FormField>
          <label>Duration (days):</label>
          <Input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            required
          />
        </FormField>
        <SubmitButton type="submit">Post Advertisement</SubmitButton>
      </form>

      {/* Display Message */}
      {message && <Message type={message.type}>{message.text}</Message>}
    </AdForm>
  );
};

export default AdManagement;
