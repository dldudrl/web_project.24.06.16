import cv2
import os
from ultralytics import YOLO
from api.crud import create_mounting
from db import database, schemas
from sqlalchemy.orm import Session
from decimal import Decimal

record = {
        'camera_idx': '1',
        'detection_accuracy': Decimal(0.00),
        # 'mount_yn': 0,  # Default value
        # 'is_deleted': 0,  # Default value
        'detection_scene': b''
    }


def create_mounting_from_record(record, db: Session):
    mounting_create = schemas.MountingCreate(
        detection_accuracy=record['detection_accuracy'],
        camera_idx=record['camera_idx'],
        detection_scene=record['detection_scene']
    )
    create_mounting(db=db, mounting=mounting_create)



# YOLO 모델 불러오기 (커스터마이징된 가중치 사용)
model = YOLO('yolo/best.pt')

# 클래스 이름 리스트 (YOLO 모델에 따라 수정 필요)
class_names = ["mounting"]

# 동영상 파일 열기 (11번째)
video_path = 'yolo/videos/cow1.mp4'
cap = cv2.VideoCapture(video_path)

# 원본 비디오의 프레임 속도 가져오기
fps = cap.get(cv2.CAP_PROP_FPS)

# 저장할 비디오 설정
fourcc = cv2.VideoWriter_fourcc(*'mp4v')

frame_idx = 0
detect_frame_idx = -1
out = None
detect_frame_count = 0  # 탐지된 프레임 수를 추적
filename = None
cnt_conf = 0

# 저장할 비디오가 저장될 폴더
output_dir = 'detected_video'
os.makedirs(output_dir, exist_ok=True)  # 폴더가 없으면 생성
def get_unique_filename(base_filename, ext='mp4'):
    cnt = 1
    while True:
        filename = os.path.join(output_dir, f"{base_filename}_{cnt}.{ext}")
        if not os.path.exists(filename):
            return filename
        cnt += 1

def draw_boxes(frame, boxes, confidences, class_ids):
    for box, confidence, class_id in zip(boxes, confidences, class_ids):
        x1, y1, x2, y2 = box
        cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
        label = f"{class_names[int(class_id)]}: {confidence:.2f}"
        cv2.putText(frame, label, (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    return frame

# 정확도 계산
def accuarcy(cnt_conf, detect_frame_count):
    cnt_conf / detect_frame_count

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    # YOLO 모델로 프레임에서 객체 감지
    results = model.predict(frame, conf=0.75)
    
    if results:
        result = results[0]  # 첫 번째 결과를 선택
        boxes = result.boxes.xyxy  # Bounding boxes
        confidences = result.boxes.conf  # Confidence scores
        class_ids = result.boxes.cls  # Class IDs
        if boxes.shape[0] > 0:
            frame = draw_boxes(frame, boxes, confidences, class_ids)
            if out is None:
                filename = get_unique_filename('detected_mounting')
                out = cv2.VideoWriter(filename, fourcc, fps, (int(cap.get(3)), int(cap.get(4))))
                detect_frame_count = 0  # 새로운 비디오 클립에 대해 탐지된 프레임 수 초기화
            detect_frame_idx = frame_idx
            cnt_conf += confidences.sum().item()
            detect_frame_count += 1
            out.write(frame)
        else:
            # 탐지가 지속되지 않는 경우
            if out is not None:
                if frame_idx - detect_frame_idx <= 30:
                    out.write(frame)
                else:
                    out.release()
                    out = None
                    # 탐지된 프레임이 5 이하일 경우 저장하지 않음
                    if detect_frame_count <= 5 and filename:
                        os.remove(filename)
                        filename = None
                    if filename is not None:
                        # mp4파일 바이너리로 읽기
                        with open(filename, 'rb') as file:
                            binary_data = file.read()  # 비디오 파일의 전체 데이터를 바이너리로 읽기
                        record['detection_scene'] = binary_data
                        with database.SessionLocal() as db:
                            create_mounting_from_record(record, db)
    else:
        # results가 비어있을 때, 안전한 처리
        if out is not None:
            if frame_idx - detect_frame_idx <= 30:
                out.write(frame)
            else:
                out.release()
                out = None
                # 탐지된 프레임이 5 이하일 경우 저장하지 않음
                if detect_frame_count <= 5 and filename:
                    os.remove(filename)
                    filename = None
                if filename is not None:
                    # mp4파일 바이너리로 읽기
                    with open(filename, 'rb') as file:
                        binary_data = file.read()  # 비디오 파일의 전체 데이터를 바이너리로 읽기
                    record['detection_scene'] = binary_data
                    with database.SessionLocal() as db:
                        create_mounting_from_record(record, db)
    
    frame_idx += 1

# 남아있는 비디오 처리기 종료
if out is not None:
    out.release()
    out = None
    # 탐지된 프레임이 5 이하일 경우 저장하지 않음
    if detect_frame_count <= 5 and filename:
        os.remove(filename)
    if filename is not None:
        # mp4파일 바이너리로 읽기
        with open(filename, 'rb') as file:
            binary_data = file.read()  # 비디오 파일의 전체 데이터를 바이너리로 읽기
        record['detection_scene'] = binary_data
        with database.SessionLocal() as db:
            create_mounting_from_record(record, db)

cap.release()


