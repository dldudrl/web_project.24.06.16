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