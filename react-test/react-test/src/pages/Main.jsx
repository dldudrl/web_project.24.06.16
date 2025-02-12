// src/pages/Main.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CameraSelector from '../components/CameraSelector'; // 기존 카메라 선택 컴포넌트
import FarmSelector from '../components/FarmSelector'; // 새로운 농가 선택 컴포넌트
import Push from '../components/Push';

function Main() {
  const userInfo = JSON.parse(localStorage.getItem('user_info')); // user_info 객체를 가져옴
  const user_id = userInfo?.user_id; // user_id 추출

  const [farms, setFarms] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);

  // 로컬 스토리지에서 사용자별 농가 목록을 불러옵니다.
  useEffect(() => {
    if (user_id) {
      const storedFarms = JSON.parse(localStorage.getItem(`user_${user_id}_farms`)) || [];
      setFarms(storedFarms);
      if (storedFarms.length > 0) {
        setSelectedFarm(storedFarms[0]);
      }
    } else {
      // user_id가 없으면 로그인 페이지로 리디렉션
      window.location.href = '/login';
    }
  }, [user_id]);

  // 선택된 농가에 따라 카메라 목록을 필터링합니다.
  useEffect(() => {
    if (selectedFarm && user_id) {
      const storedCameras = JSON.parse(localStorage.getItem(`user_${user_id}_cameras`)) || {};
      setCameras(storedCameras[selectedFarm.id] || []);
      if (storedCameras[selectedFarm.id] && storedCameras[selectedFarm.id].length > 0) {
        setSelectedCamera(storedCameras[selectedFarm.id][0]);
      }
    } else {
      setCameras([]);
      setSelectedCamera(null);
    }
  }, [selectedFarm, user_id]);

  return (
    <MainContainer>
      <Content>
        <Sidebar>
          <label htmlFor="farm-select">농가 선택:</label>
          <FarmSelector
            farms={farms}
            onSelect={setSelectedFarm}
            selectedFarm={selectedFarm}
          />
          <label htmlFor="camera-select">카메라 선택:</label>
          {selectedFarm && (
            <CameraSelector
              cameras={cameras}
              onSelect={setSelectedCamera}
              selectedCamera={selectedCamera}
            />
          )}
        </Sidebar>
        <CameraFeed>
          {selectedCamera ? (
            <CameraVideo
              src={selectedCamera.src}
              title={selectedCamera.name}
              autoPlay
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=Error'; // Fallback URL
                e.target.onerror = null; // Prevent infinite loop
              }}
            />
          ) : (
            <p>'카메라 관리' 메뉴에서 농가와 카메라를 추가해주세요.</p>
          )}
        </CameraFeed>
        <PushContainer>
          <Push />
        </PushContainer>
      </Content>
    </MainContainer>
  );
}

export default Main;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 250px;
  border-right: 1px solid #ccc;
  padding: 20px;
  display: inline-block;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    width: 90%;
    max-height: 200px;
    overflow-x: auto;
  }
`;

const CameraFeed = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 20px;

  @media (max-width: 768px) {
    height: auto;
  }
`;

const CameraVideo = styled.video`
  border: none;
  width: 100%;
`;

const PushContainer = styled.div`
  padding: 20px;
  border-top: 1px solid #ccc;
`;
