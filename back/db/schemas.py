from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel


class MountingCreate(BaseModel):
    detection_accuracy: Decimal
    camera_idx: int
    scene_path: str

    class Config:
        orm_mode = True

class MountingList(BaseModel):
    mount_idx: str
    detection_time:datetime
    detection_accuracy: Decimal
    mount_yn: str
    is_deleted: str

    class Config:
        orm_mode = True

class MountingVideo(BaseModel):
    scene_path: str

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    user_id: str
    user_name: str
    user_email: str
    user_phone: str

class UserCreate(UserBase):
    user_pw: str

class UserLogin(BaseModel):
    user_id: str
    user_pw: str
    user_email: Optional[str] = None

    class Config:
        orm_mode = True

class User(UserBase):
    joined_at: datetime
    user_role: str
    is_deleted: str

    class Config:
        orm_mode = True

class Subscription(BaseModel):
    user_id: str
    private_key: str
    endpoint: str
    user_email: str
    auth: str
    p256dh: str

    class Config:
            orm_mode = True
