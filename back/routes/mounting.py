from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse, FileResponse
from io import BytesIO
from sqlalchemy.orm import Session
from db import schemas, database
from api.crud import find_mountings, get_mounting_scene
from typing import List
from pathlib import Path
import logging
import os

mounting_router = APIRouter()

@mounting_router.get("/mounting", response_model=List[schemas.MountingList])
def get_mounting(db: Session = Depends(database.get_db)):
    db_mounting = find_mountings(db)
    return db_mounting

def generate_video_stream(file_path: Path):
    with open(file_path, 'rb') as file:
        chunk_size = 8192
        while chunk := file.read(chunk_size):
            yield chunk

def iterfile(result):
    with open(result, mode='rb') as file:
        yield from file
# @mounting_router.get("/mounting/{mount_idx}")
# def get_scene():
   
#     file_path = Path('yolo/detected_video/detected_mounting_1.mp4')

#     return StreamingResponse(generate_video_stream(file_path), media_type="video/mp4")


@mounting_router.get("/mounting/{mount_idx}")
def get_scene(mount_idx: str, db: Session = Depends(database.get_db)):
    db_mounting = get_mounting_scene(db, mount_idx)
    if not db_mounting or db_mounting.scene_path is None:
        raise HTTPException(status_code=404, detail="Video not found")
    video_data = db_mounting.scene_path

    if not os.path.exists(video_data):
        logging.error(f"Video file not found: {video_data}")
        raise HTTPException(status_code=404, detail="Video file not found")

    logging.info(f"Serving video file: {video_data}")

    return FileResponse(video_data, media_type='video/mp4')


# @mounting_router.get("/mounting/{mount_idx}")
# def get_scene(mount_idx: str, db: Session = Depends(database.get_db)):
#     db_mounting = get_mounting_scene(db, mount_idx)
#     if not db_mounting or db_mounting.scene_path is None:
#         raise HTTPException(status_code=404, detail="Video not found")
#     video_data = db_mounting.scene_path
#     file_path = Path(video_data)

#     return StreamingResponse(iterfile(file_path), media_type="video/mp4")