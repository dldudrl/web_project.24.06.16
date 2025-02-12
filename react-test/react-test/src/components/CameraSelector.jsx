// src/components/CameraSelector.js
import React from 'react';
import styled from 'styled-components';

const CameraSelector = ({ cameras, onSelect, selectedCamera }) => {
  return (
    <CameraList>
      {cameras.map((camera) => (
        <CameraItem
          key={camera.id} // ID를 key로 사용
          onClick={() => onSelect(camera)}
          isSelected={selectedCamera && selectedCamera.id === camera.id} // ID를 비교
        >
          {camera.name}
        </CameraItem>
      ))}
    </CameraList>
  );
};

export default CameraSelector;

const CameraList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  list-style-type: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;

  @media (max-width: 768px) {
    max-width: auto;
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    white-space: nowrap;
  }
`;

const CameraItem = styled.div`
  padding: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.isSelected ? '#7e7e7ecf' : 'transparent')};
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #7e7e7ecf;
  }

  @media (max-width: 768px) {
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 0;
  }
`;