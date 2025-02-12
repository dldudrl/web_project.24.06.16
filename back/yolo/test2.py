# import mysql.connector

# # 데이터베이스 연결 설정
# config = {
#     'user': 'root',
#     'password': '12345',
#     'host': 'host.docker.internal',
#     'port':3307,
#     'database': 'testdb'
# }

# # MySQL 데이터베이스에 연결
# conn = mysql.connector.connect(**config)
# cursor = conn.cursor()

# # BLOB 데이터 가져오기
# query = "SELECT scene_path FROM tb_mounting WHERE mount_idx = 168"
# cursor.execute(query)
# result = cursor.fetchone()

# if result:
#     # BLOB 데이터를 파일로 저장
#     # with open('output_video.mp4', 'wb') as file:
#     #     file.write(result[0])
#     with open('output_video.mp4', mode= 'rb') as file:
#         file.read(result[0])

# cursor.close()
# conn.close()

# print("Video data has been saved to output_video.mp4")
from pathlib import Path

print('yolo/detected_video/detected_mounting_4.mp4')