// src/components/FarmForm.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const FarmForm = ({ addFarm, closeModal }) => {
  const [farmName, setFarmName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addFarm(farmName);
    setFarmName('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="farmName">농가 이름:</Label>
        <Input
          type="text"
          id="farmName"
          value={farmName}
          onChange={(e) => setFarmName(e.target.value)}
          required
        />
      </FormGroup>
      <Button type="submit">추가</Button>
      <Button type="button" onClick={closeModal}>취소</Button>
    </Form>
  );
};

export default FarmForm;

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