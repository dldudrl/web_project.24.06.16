from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import schemas, database
from api.crud import signin_user, signup_user, get_user_by_id

message_router = APIRouter()

# @message_router.get("/message")
# def get_message(user: schemas.messageList, db: Session = Depends(database.get_db)):
#     list = signin_user(db, user)
#     if list is None:
#         raise HTTPException(status_code=404, detail="Message list not found")
#     return list

# @message_router.post("/login")
# def get_user(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
#     user = signin_user(db, user)
#     if user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return user


# @message_router.post("/join")
# def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
#     db_user = get_user_by_id(db, user.user_id)
#     if db_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
#     return signup_user(db, user)