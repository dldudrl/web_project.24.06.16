프로젝트 구조
CattleBell/

	main.py
	
	database/
		connection.py
	routes/
		users.py
		events.py
	models/
		users.py
		events.py

	yolo/
		runs/detect/predict/
				labels/
				results...
		trained.pt
		yolov10n.pt
		videos/
			inputs...
		convert.py # mp4 변환 후 db에 넣는 코드 필요

[YOLO - detection.py ]
```python
from ultralytics import YOLO

model = YOLO("best.pt")
predictions = model.predict("./cow.mp4",show=True, save=True, save_txt=True)
# results = model.predict()  # save predictions as labels

for i, result in enumerate(predictions) :
    if result.boxes.shape[0] > 0 :
        # 알림 push
        print("탐지")
    else :
        print("탐지안됨")
        continue

```

[동영상 Longblob으로 저장]
```python
import pymysql

# MySQL 데이터베이스 연결 설정
    # 'host': '172.17.0.1',     # MySQL 서버 주소
db_config = {
    'host': 'host.docker.internal',     # MySQL 서버 주소
    'user': 'sogaeting', # MySQL 사용자 이름
    'password': '12345', # MySQL 비밀번호
    'database': 'sogaeting',  # 사용할 데이터베이스 이름
    'port' : 3307
}

# MP4 파일 경로
file_path = "./cow.mp4"
# file_name = 'cow.mp4'

# 파일을 읽고 MySQL에 저장하는 함수
def save_video_to_db(file_path):
    connection = None
    cursor = None
    try:
        # MySQL 데이터베이스에 연결
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()

        # MP4 파일을 바이너리 모드로 읽기
        with open(file_path, 'rb') as file:
            binary_data = file.read()

        # INSERT 문을 사용하여 바이너리 데이터를 LONGBLOB 필드에 저장
        sql = "INSERT INTO test (detection_scene) VALUES (%s)"
        cursor.execute(sql, (binary_data))

        # 커밋하여 변경 사항을 저장
        connection.commit()

        print("File saved to database successfully.")

    except Exception as e:
        print(f"Error: {e}")

    finally:
        # 커서가 None이 아닌 경우 닫기
        if cursor is not None:
            cursor.close()
        # 연결이 None이 아닌 경우 닫기
        if connection is not None:
            connection.close()

# 함수 호출
save_video_to_db(file_path)

# 데이터베이스에서 비디오를 가져와서 파일로 저장하는 함수
def retrieve_video_from_db(output_file_path):
    connection = None
    cursor = None
    try:
        # MySQL 데이터베이스에 연결
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()

        # 데이터베이스에서 비디오를 가져오기 위한 SELECT 쿼리
        sql = "SELECT detection_scene FROM test WHERE mount_idx = %s"
        cursor.execute(sql, (1))

        # 결과에서 LONGBLOB 데이터 가져오기
        result = cursor.fetchone()
        if result:
            binary_data = result[0]
            
            # 바이너리 데이터를 파일로 저장
            with open(output_file_path, 'wb') as file:
                file.write(binary_data)
            
            print("File retrieved from database and saved successfully.")
        else:
            print("No data found for the given camera_idx.")

    except Exception as e:
        print(f"Error: {e}")

    finally:
        # 커서가 None이 아닌 경우 닫기
        if cursor is not None:
            cursor.close()
        # 연결이 None이 아닌 경우 닫기
        if connection is not None:
            connection.close()

output_file_path = ".retrieved_cow.mp4"

# retrieve_video_from_db(output_file_path)
```


[convert.py]
```python
import cv2

input_video = cv2.VideoCapture('./runs/detect/predict3/cow.avi')
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
fps = input_video.get(cv2.CAP_PROP_FPS)
width = int(input_video.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(input_video.get(cv2.CAP_PROP_FRAME_HEIGHT))

output_video = cv2.VideoWriter('output_video.mp4', fourcc, fps, (width, height))

while True:
    ret, frame = input_video.read()
    if not ret:
        break
    output_video.write(frame)

input_video.release()
output_video.release()
```
[YOLO - requirements.text]
```text
torch==2.0.1
torchvision==0.15.2
onnx==1.14.0
onnxruntime==1.15.1
pycocotools==2.0.7
PyYAML==6.0.1
scipy==1.13.0
onnxsim==0.4.36
onnxruntime-gpu==1.18.0
gradio==4.31.5
opencv-python==4.9.0.80
psutil==5.9.8
py-cpuinfo==9.0.0
huggingface-hub==0.23.2
safetensors==0.4.3
```

-님의 -농가의 -카메라에서 승가 탐지되었습니다.

참고 URL
### PushAPI, NotificationAPI
[push1](https://duske.me/posts/sending-push-notifications-with-payloads-using-web-push-and-vapid/)

[push2](https://medium.com/beginners-guide-to-mobile-web-development/web-push-notifications-9a785db55569)

[push3](https://developer.chrome.com/blog/push-notifications-on-the-open-web?hl=ko)