import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
// import { saveAs } from 'file-saver';

const DetectionModal = ({ record, onClose, isDownloading }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  // const [isSaved, setIsSaved] = useState(false);
  const [decision, setDecision] = useState(null);

  useEffect(() => {
    if (record) {
      // 비디오 다운로드
      const downloadVideo = async () => {
        try {
          const response = await fetch(`http://172.30.1.56:8081/mounting/${record.mount_idx}`);
          if (!response.ok) {
            throw new Error('비디오 다운로드 실패');
          }
          const blob = await response.blob();
          const videoBlobUrl = URL.createObjectURL(blob);
          setVideoUrl(videoBlobUrl);
          // 비디오 다운로드 자동 시작
          // saveAs(blob, `cow_${record.mount_idx}.webm`);
        } catch (error) {
          console.error('비디오 다운로드 오류:', error);
        }
      };

      downloadVideo();
    }
  }, [record]);

  // const handleSave = () => {
  //   setIsSaved(true);
  // };

  const handleDelete = () => {
    if (window.confirm('정말로 이 기록을 삭제하시겠습니까?')) {
      // 로컬 스토리지에서 기록 삭제
      const savedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
      const updatedNotifications = savedNotifications.filter(notification => notification.title !== `탐지 ID: ${record.mount_idx}`);
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

      // 모달을 닫음
      onClose();
    }
  };

  const handleDecision = (value) => {
    setDecision(value);
  };

  if (!record) return null;

  return ReactDOM.createPortal(
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2>영상 세부정보</h2>
        {videoUrl && (
          <video src={videoUrl} width="640" height="360" controls autoPlay />
        )}
        <Detail>
          <p><strong>제목:</strong> {`MT-${record.mount_idx}`}</p>
          <p><strong>일자:</strong> {record.detection_time}</p>
          <p><strong>탐지 정확도:</strong> {record.detection_accuracy}</p>
          <p><strong>Mount Y/N:</strong> {record.mount_yn}</p>
          <p><strong>삭제 여부:</strong> {record.is_deleted}</p>
        </Detail>
        <Decision>
          <p>승인 여부 결정:</p>
          <ButtonGroup>
            <DecisionButton
              active={decision === 'Y'}
              onClick={() => handleDecision('Y')}
            >
              Y
            </DecisionButton>
            <DecisionButton
              active={decision === 'N'}
              onClick={() => handleDecision('N')}
            >
            N
            </DecisionButton>
          </ButtonGroup>
        </Decision>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};

export default DetectionModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  color: #000;

  body.dark-mode & {
    background: #333;
    color: #e0e0e0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #000;

  body.dark-mode & {
    color: #e0e0e0;
  }
`;

const Detail = styled.div`
  margin-bottom: 20px;
`;

const Decision = styled.div`
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const DecisionButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: ${(props) => (props.active ? '#007bff' : '#fff')};
  color: ${(props) => (props.active ? '#fff' : '#007bff')};
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.active ? '#0056b3' : '#f1f1f1')};
  }

  body.dark-mode & {
    border-color: #444;
    background-color: ${(props) => (props.active ? '#0056b3' : '#333')};
    color: ${(props) => (props.active ? '#fff' : '#bbb')};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  font-size: 14px;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  body.dark-mode & {
    background-color: #0056b3;
  }
`;
