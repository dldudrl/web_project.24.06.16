import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CameraForm from '../components/CameraForm'; 
import FarmForm from '../components/FarmForm'; 

function CameraManagement() {
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [cameras, setCameras] = useState({});

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
    if (userInfo && userInfo.user_id) {
      loadFarms(userInfo.user_id);
      loadCameras(userInfo.user_id);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const loadFarms = (user_id) => {
    const storedFarms = JSON.parse(localStorage.getItem(`user_${user_id}_farms`)) || [];
    setFarms(storedFarms);
  };

  const loadCameras = (user_id) => {
    const storedCameras = JSON.parse(localStorage.getItem(`user_${user_id}_cameras`)) || {};
    setCameras(storedCameras);
  };

  const openFarmModal = () => setIsFarmModalOpen(true);
  const closeFarmModal = () => setIsFarmModalOpen(false);

  const openCameraModal = (farmId) => {
    setSelectedFarm(farmId);
    setIsCameraModalOpen(true);
  };

  const closeCameraModal = () => {
    setIsCameraModalOpen(false);
    setIsEditing(false);
    setEditIndex(null);
  };

  const addFarm = (farmName) => {
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
    if (userInfo && userInfo.user_id) {
      const newFarm = { id: Date.now().toString(), name: farmName, user_id: `${userInfo.user_id}` };
      const updatedFarms = [...farms, newFarm];
      localStorage.setItem(`user_${userInfo.user_id}_farms`, JSON.stringify(updatedFarms));
      setFarms(updatedFarms);
      setCameras({ ...cameras, [newFarm.id]: [] });
      closeFarmModal();
    }
  };

  const addCamera = (camera) => {
    if (selectedFarm) {
      const userInfo = JSON.parse(localStorage.getItem('user_info'));
      if (userInfo && userInfo.user_id) {
        let updatedCameras = { ...cameras };
        if (isEditing && editIndex !== null) {
          updatedCameras[selectedFarm][editIndex] = camera;
        } else {
          updatedCameras[selectedFarm] = [...(updatedCameras[selectedFarm] || []), camera];
        }
        localStorage.setItem(`user_${userInfo.user_id}_cameras`, JSON.stringify(updatedCameras));
        setCameras(updatedCameras);
      }
      closeCameraModal();
    }
  };

  const editCamera = (index) => {
    setEditIndex(index);
    setIsEditing(true);
    setIsCameraModalOpen(true);
  };

  const deleteCamera = (index) => {
    if (selectedFarm) {
      const confirmed = window.confirm('정말 이 카메라를 삭제하시겠습니까?');
      if (confirmed) {
        const userInfo = JSON.parse(localStorage.getItem('user_info'));
        if (userInfo && userInfo.user_id) {
          const updatedCameras = cameras[selectedFarm].filter((_, i) => i !== index);
          
          // 로컬 스토리지와 상태 업데이트
          const updatedCamerasState = { ...cameras, [selectedFarm]: updatedCameras };
          localStorage.setItem(`user_${userInfo.user_id}_cameras`, JSON.stringify(updatedCamerasState));
          setCameras(updatedCamerasState);
        }
      }
    }
  };

  const deleteFarm = (farmId) => {
    const confirmed = window.confirm('정말 이 농가를 삭제하시겠습니까?');
    if (confirmed) {
      const userInfo = JSON.parse(localStorage.getItem('user_info'));
      if (userInfo && userInfo.user_id) {
        const updatedFarms = farms.filter(farm => farm.id !== farmId);
        localStorage.setItem(`user_${userInfo.user_id}_farms`, JSON.stringify(updatedFarms));
        setFarms(updatedFarms);

        const updatedCameras = { ...cameras };
        delete updatedCameras[farmId];
        localStorage.setItem(`user_${userInfo.user_id}_cameras`, JSON.stringify(updatedCameras));
        setCameras(updatedCameras);
      }
    }
  };

  return (
    <CamManageContainer>
      <AddButton onClick={openFarmModal}>농가 추가</AddButton>

      {isFarmModalOpen && (
        <Modal>
          <ModalContent>
            <h3>농가 추가</h3>
            <FarmForm
              addFarm={addFarm}
              closeModal={closeFarmModal}
            />
          </ModalContent>
        </Modal>
      )}

      {farms.map(farm => (
        <FarmBox key={farm.id}>
          <FarmHeader>{farm.name}</FarmHeader>
          <Button onClick={() => openCameraModal(farm.id)}>카메라 추가</Button>
          <DeleteButton onClick={() => deleteFarm(farm.id)}>농가 삭제</DeleteButton>
          {isCameraModalOpen && selectedFarm === farm.id && (
            <Modal>
              <ModalContent>
                <h3>{isEditing ? '카메라 수정' : '카메라 추가'}</h3>
                <CameraForm
                  addCamera={addCamera}
                  closeModal={closeCameraModal}
                  initialData={isEditing ? cameras[selectedFarm][editIndex] : null}
                />
              </ModalContent>
            </Modal>
          )}
          <CameraTable>
            <thead>
              <tr>
                <th>이름</th>
                <th>ID</th>
                <th>설치 위치</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {cameras[farm.id]?.map((camera, index) => (
                <tr key={camera.id}>
                  <td>{camera.name}</td>
                  <td>{camera.id}</td>
                  <td>{camera.location}</td>
                  <td>
                    <Button className='actionBtn' onClick={() => editCamera(index)}>수정</Button>
                    <Button className='actionBtn' onClick={() => deleteCamera(index)}>삭제</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </CameraTable>
        </FarmBox>
      ))}
    </CamManageContainer>
  );
}

export default CameraManagement;

const CamManageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100vh;
  width: 100%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px;
  background-color: black;
  border: 1px solid white;
  color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #404040;
  }
`;

const AddButton = styled(Button)`
  margin-left: 45%;

  @media (max-width: 768px) {
    margin-left: auto;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FarmBox = styled.div`
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;

  @media (max-width: 768px) {
    width: auto;
  }
`;

const FarmHeader = styled.h2`
  margin-top: 0;
`;

const CameraTable = styled.table`
  margin-top: 20px;
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
  }

  th {
    background-color: #f4f4f4;
  }
`;
