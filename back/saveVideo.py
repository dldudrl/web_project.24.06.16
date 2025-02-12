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
