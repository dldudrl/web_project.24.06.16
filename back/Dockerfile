# 베이스 이미지를 설정합니다.
FROM python:3.9

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# 필요한 패키지들을 설치합니다.
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 파일을 복사합니다.
COPY . /app

# Uvicorn을 사용하여 FastAPI 애플리케이션을 실행합니다.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80", "--reload"]
