// const response = await fetch('http://localhost:8081/mounting/166'); // 적절한 비디오 ID 사용
// if (!response.ok) {
//     console.error('Failed to fetch video');
//     return;
// }
// const blob = await response.blob();
// const url = URL.createObjectURL(blob);
// console.log(url)

// import cv2
// import numpy as np
// import subprocess

// def create_video_with_opencv(output_file):
//     # 비디오 파일 설정
//     fourcc = cv2.VideoWriter_fourcc(*'mp4v')
//     fps = 30.0
//     frame_size = (640, 480)

//     # 비디오 라이터 객체 생성
//     out = cv2.VideoWriter(output_file, fourcc, fps, frame_size)

//     # 프레임 생성 및 비디오 파일에 쓰기
//     for i in range(120):  # 4초짜리 비디오 생성 (30fps * 4초 = 120프레임)
//         frame = np.zeros((480, 640, 3), dtype=np.uint8)
//         cv2.putText(frame, f'Frame {i}', (100, 240), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
//         out.write(frame)

//     # 비디오 라이터 객체 해제
//     out.release()

// def convert_to_h264(input_file, output_file):
//     # ffmpeg 명령어
//     command = [
//         'ffmpeg',
//         '-i', input_file,
//         '-c:v', 'libx264',
//         '-c:a', 'aac',
//         '-strict', 'experimental',
//         output_file
//     ]

//     try:
//         # ffmpeg 명령어 실행
//         subprocess.run(command, check=True)
//         print(f"파일 변환 성공: {output_file}")
//     except subprocess.CalledProcessError as e:
//         print(f"파일 변환 실패: {e}")

// # 비디오 파일 생성 및 변환
// input_file = 'input.mp4'
// output_file = 'output_h264.mp4'
// create_video_with_opencv(input_file)
// convert_to_h264(input_file, output_file)
