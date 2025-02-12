import cv2
import os
from ultralytics import YOLO
from api.crud import create_mounting, find_subscription_by_id
from db import database, schemas
from sqlalchemy.orm import Session
from decimal import Decimal
from fastapi import HTTPException
from pywebpush import webpush, WebPushException
import logging
import json
import subprocess


record = {
        'camera_idx': '1',
        'detection_accuracy': Decimal(0.00),
        # 'mount_yn': 0,  # Default value
        # 'is_deleted': 0,  # Default value
        'scene_path': ''
    }
# YOLO 모델 불러오기 (커스터마이징된 가중치 사용)
model = YOLO('yolo/best.pt')

# 클래스 이름 리스트 (YOLO 모델에 따라 수정 필요)
class_names = ["mounting"]

# 동영상 파일 열기 (11번째)
video_path = 'yolo/videos/cow_yolo.mp4'
cap = cv2.VideoCapture(video_path)

# 원본 비디오의 프레임 속도 가져오기
fps = cap.get(cv2.CAP_PROP_FPS)

# 저장할 비디오 설정
fourcc = cv2.VideoWriter_fourcc(*'VP80')
# 초기화
frame_idx = 0
detect_frame_idx = -1
out = None
detect_frame_count = 0  # 탐지된 프레임 수를 추적
filename = None
cnt_conf = 0

# 저장할 비디오가 저장될 폴더
output_dir = 'yolo/detected_video'
os.makedirs(output_dir, exist_ok=True)  # 폴더가 없으면 생성
def get_unique_filename(base_filename, ext='webm'):
    cnt = 1
    while True:
        filename = os.path.join(output_dir, f"{base_filename}_{cnt}.{ext}")
        if not os.path.exists(filename):
            return filename
        cnt += 1

# bounding box 그리기
def draw_boxes(frame, boxes, confidences, class_ids):
    for box, confidence, class_id in zip(boxes, confidences, class_ids):
        x1, y1, x2, y2 = box
        cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
        label = f"{class_names[int(class_id)]}: {confidence:.2f}"
        cv2.putText(frame, label, (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    return frame

# 푸시
def send_push(message: dict, db:Session = database.SessionLocal()):
    try:
        subscribed_user = find_subscription_by_id(db)
        
        # 웹 푸시 전송
        webpush(
            subscription_info={
                "endpoint": subscribed_user.endpoint,
                "keys": {
                    "auth": subscribed_user.auth,
                    "p256dh": subscribed_user.p256dh
                }
            },
            data=json.dumps({'title':message['title'], 'body': message['message']}),
            vapid_private_key=subscribed_user.private_key,
            vapid_claims={"sub": f"mailto:{subscribed_user.user_email}"}
        )
    except WebPushException as ex:
        print("I'm sorry, Dave, but I can't do that: {}", repr(ex))
    # Mozilla returns additional information in the body of the response.
        if ex.response and ex.response.json():
            extra = ex.response.json()
            print("Remote service replied with a {}:{}, {}",
                extra.code,
                extra.errno,
                extra.message
                )
            raise HTTPException(status_code=500, detail=f"Web push failed: {repr(ex)}")
    except Exception as e:
        logging.error(f"An unexpected error occurred: {repr(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {repr(e)}")

    return {"message": "Push notifications sent."}

# def convert_to_h264(input_file, output_file):
#     # ffmpeg 명령어
#     command = [
#     'ffmpeg',
#     '-y',  # overwrite without asking
#     '-i', input_file,
#     '-c:v', 'libx264',
#     '-c:a', 'aac',
#     '-strict', 'experimental',
#     output_file
# ]

#     try:
#         # ffmpeg 명령어 실행
#         subprocess.run(command, check=True)
#         print(f"파일 변환 성공: {output_file}")
#     except subprocess.CalledProcessError as e:
#         print(f"파일 변환 실패: {e}")

# DB 연결 코드
def create_mounting_from_record(record: dict, db: Session):
    mounting_create = schemas.MountingCreate(
        detection_accuracy=record['detection_accuracy'],
        camera_idx=record['camera_idx'],
        scene_path=record['scene_path']
    )

    # message = {
    # "title": "승가[MT]",
    # "message": f"{mounting_create.camera_idx}번 카메라에서 승가 발생" 
    # }

    # send_push(message)

    create_mounting(db=db, mounting=mounting_create)



### run ###
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
        # 승가 탐지
        if boxes.shape[0] > 0:
            frame = draw_boxes(frame, boxes, confidences, class_ids)
            # 첫 탐지 프레임
            if out is None:
                filename = get_unique_filename('detected_mounting')
                out = cv2.VideoWriter(filename, fourcc, fps, (int(cap.get(3)), int(cap.get(4))))
                detect_frame_count = 0  # 새로운 비디오 클립에 대해 탐지된 프레임 수 초기화
            # 첫 탐지 idx 저장
            detect_frame_idx = frame_idx
            # accuracy 모두 더하기
            cnt_conf += confidences.sum().item()
            # 프레임 수 count
            detect_frame_count += 1
            out.write(frame)
            
        else:
            # 탐지가 지속되지 않는 경우
            if out is not None:
                # 탐지되지 않은 프레임이 30개 이하일 때
                if frame_idx - detect_frame_idx <= 30:
                    out.write(frame)
                # 더이상 탐지 X
                else:
                    out.release()
                    # convert_to_h264(f"{filename}", f"{filename}")
                    # out 초기화
                    out = None
                    # 정확도 dictionary에 넣기
                    record['detection_accuracy'] = cnt_conf / detect_frame_count
                    # 정확도 초기화
                    cnt_conf = 0
                    
                    # 탐지된 프레임이 5 이하일 경우 저장하지 않음
                    if detect_frame_count <= 5 and filename:
                        os.remove(filename)
                        filename = None
                    
                    if filename is not None:
                        record['scene_path'] = f"{filename}"
                        # DB에 삽입
                        with database.SessionLocal() as db:
                            create_mounting_from_record(record, db)

    else:
        # results가 비어있을 때, 안전한 처리
        if out is not None:
            if frame_idx - detect_frame_idx <= 30:
                out.write(frame)
            else:
                out.release()
                # convert_to_h264(f"{filename}", f"{filename}")
                out = None
                record['detection_accuracy'] = cnt_conf / detect_frame_count
                cnt_conf = 0
                
                # 탐지된 프레임이 5 이하일 경우 저장하지 않음
                if detect_frame_count <= 5 and filename:
                    os.remove(filename)
                    filename = None
                
                if filename is not None:
                    record['scene_path'] = f"{filename}"
                    # DB에 삽입
                    with database.SessionLocal() as db:
                        create_mounting_from_record(record, db)
    
    # 프레임 idx
    frame_idx += 1

# 남아있는 비디오 처리기 종료
if out is not None:
    out.release()
    # convert_to_h264(f"{filename}", f"{filename}")
    out = None
    record['detection_accuracy'] = cnt_conf / detect_frame_count
    cnt_conf = 0
    
    # 탐지된 프레임이 5 이하일 경우 저장하지 않음
    if detect_frame_count <= 5 and filename:
        os.remove(filename)
    
    if filename is not None:
        record['scene_path'] = f"{filename}"
        with database.SessionLocal() as db:
            create_mounting_from_record(record, db)

cap.release()
