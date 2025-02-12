// src/components/FarmSelector.js
import React from 'react';
import styled from 'styled-components';

const FarmSelector = ({ farms, onSelect, selectedFarm }) => {
  const handleChange = (event) => {
    const selectedFarmId = event.target.value;
    const farm = farms.find((f) => f.id === selectedFarmId);
    onSelect(farm);
  };

  return (
    <StyledSelect id="farm-select" onChange={handleChange} value={selectedFarm ? selectedFarm.id : ''}>
      <option value="" disabled>농가를 선택하세요</option>
      {farms.map((farm) => (
        <option key={farm.id} value={farm.id}>
          {farm.name}
        </option>
      ))}
    </StyledSelect>
  );
};

export default FarmSelector;

const StyledSelect = styled.select`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
`;