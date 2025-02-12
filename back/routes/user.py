from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import schemas, database
from api.crud import signin_user, signup_user, get_user_by_id

user_router = APIRouter()

@user_router.post("/login")
def get_user(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = signin_user(db, user)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@user_router.post("/join")
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = get_user_by_id(db, user.user_id)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return signup_user(db, user)