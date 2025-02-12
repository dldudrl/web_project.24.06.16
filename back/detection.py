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