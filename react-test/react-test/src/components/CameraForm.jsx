// src/components/CameraForm.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CameraForm = ({ addCamera, closeModal, initialData }) => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setId(initialData.id);
      setLocation(initialData.location);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const src = `/videos/cctv${id}.mp4`; // 카메라 ID를 기반으로 src 생성
    addCamera({ name, id, location, src });
    setName('');
    setId('');
    setLocation('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="cameraName">카메라 이름:</Label>
        <Input
          type="text"
          id="cameraName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="cameraId">카메라 ID:</Label>
        <Input
          type="text"
          id="cameraId"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="cameraLocation">설치 위치:</Label>
        <Input
          type="text"
          id="cameraLocation"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </FormGroup>
      <Button type="submit">저장</Button>
      <Button type="button" onClick={closeModal}>취소</Button>
    </Form>
  );
};

export default CameraForm;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #404040;
  }
`;
