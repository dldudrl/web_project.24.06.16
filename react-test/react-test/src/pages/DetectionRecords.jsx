import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DetectionModal from '../components/DetectionModal';

function DetectionRecords() {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [list, setList] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const getSampleRecords = async () => {
    try {
      const response = await fetch('http://172.30.1.56:8081/mounting');
      if (!response.ok) {
        throw new Error(`HTTP 오류! 상태: ${response.status}`);
      }
      const data = await response.json();
      setList(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getSampleRecords();
  }, []);

  const handleBoxClick = async (record) => {
    setIsDownloading(true);
    try {
      // 비디오 다운로드 처리
      const response = await fetch(`http://172.30.1.56:8081/mounting/${record.mount_idx}`);
      if (!response.ok) {
        throw new Error('비디오 다운로드 실패');
      }
      const blob = await response.blob();
      const videoUrl = URL.createObjectURL(blob);
      // 저장하지 않고 URL만 만듦
      setSelectedRecord({ ...record, videoUrl });
    } catch (error) {
      console.error('비디오 다운로드 오류:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedRecord(null);
  };

  return (
    <DetectionRecordsContainer>
      <RecordsGrid>
        {list.map((record) => (
          <RecordBox key={record.mount_idx} onClick={() => handleBoxClick(record)}>
            <Info>
              <VideoName>{`탐지 ID: ${record.mount_idx}`}</VideoName>
              <DateTime>{`탐지 일자 및 시간: ${record.detection_time}`}</DateTime>
              <DetectionType>{`탐지 정확도: ${record.detection_accuracy}`}</DetectionType>
              <Duration>{`승가 여부: ${record.mount_yn}`}</Duration>
              <Decision>{`삭제 여부: ${record.is_deleted}`}</Decision>
            </Info>
          </RecordBox>
        ))}
      </RecordsGrid>
      {selectedRecord && (
        <DetectionModal
          record={selectedRecord}
          videoUrl={selectedRecord.videoUrl}
          onClose={handleCloseModal}
          isDownloading={isDownloading}
        />
      )}
    </DetectionRecordsContainer>
  );
}

export default DetectionRecords;

const DetectionRecordsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 800px;
  max-height: 700px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 50px auto;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const RecordsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const RecordBox = styled.div`
  display: flex;
  width: 350px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, background-color 0.2s;

  &:hover {
    transform: scale(1.05);
    background-color: #f0f0f0;
    color: black;
  }
`;

const Info = styled.div`
  width: 300px;
  padding: 10px;
`;

const VideoName = styled.h3`
  font-size: 18px;
  margin: 0;
`;

const DateTime = styled.p`
  font-size: 14px;
  color: #555;
`;

const DetectionType = styled.p`
  font-size: 14px;
  color: #888;
`;

const Duration = styled.p`
  font-size: 14px;
  color: #000;
  font-weight: bold;
`;

const Decision = styled.p`
  font-size: 16px;
  font-weight: bold;
`;
