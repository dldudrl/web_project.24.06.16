from sqlalchemy.orm import Session
from db import models, schemas


def signin_user(db: Session, user: schemas.UserLogin):
    found_user = db.query(models.User).filter(models.User.user_id == user.user_id, models.User.user_pw == user.user_pw).first()
    if found_user:
        return {'user_id': found_user.user_id, 'user_email':found_user.user_email}
    return None

def signup_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(user_id = user.user_id, user_pw = user.user_pw, user_name = user.user_name, user_email = user.user_email, user_phone = user.user_phone)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return "가입성공"

def find_subscription_by_id(db: Session, user_id: str):
    return db.query(models.PushSubscription).filter(models.PushSubscription.user_id == user_id).first()

def save_subscription(db: Session, subscription: schemas.Subscription):
    # Check if the subscription for this user_id already exists
    existing_subscription = find_subscription_by_id(db, subscription.user_id)
    
    if existing_subscription:
        # Update existing subscription
        existing_subscription.private_key = subscription.private_key
        existing_subscription.user_email = subscription.user_email
        existing_subscription.endpoint = subscription.endpoint
        existing_subscription.auth = subscription.auth
        existing_subscription.p256dh = subscription.p256dh
    else:
        # Create a new subscription
        new_subscription = models.PushSubscription(
            user_id=subscription.user_id,
            private_key=subscription.private_key,
            user_email=subscription.user_email,
            endpoint=subscription.endpoint,
            auth=subscription.auth,
            p256dh=subscription.p256dh
        )
        db.add(new_subscription)
    
    db.commit()
    # No need to refresh if we are not creating a new object
    if existing_subscription:
        db.refresh(existing_subscription)
        return existing_subscription
    else:
        return new_subscription

def get_user_by_id(db: Session, user_id: schemas.UserCreate):
    return db.query(models.User).filter(models.User.user_id == user_id).first()

def find_mountings(db: Session):
    db_mountings = db.query(models.Mounting).all()
    return db_mountings

def get_mounting_scene(db: Session, mount_idx: str):
    db_mounting = db.query(models.Mounting).filter(models.Mounting.mount_idx == mount_idx).first()
    return db_mounting

def create_mounting(db: Session, mounting: schemas.MountingCreate):
    db_mounting = models.Mounting(detection_accuracy=mounting.detection_accuracy, camera_idx = mounting.camera_idx, scene_path=mounting.scene_path)
    db.add(db_mounting)
    db.commit()
    db.refresh(db_mounting)
    return db_mounting





# def get_user(db: Session, user_id: int):
#     return db.query(models.User).filter(models.User.id == user_id).first()


# def get_user_by_email(db: Session, email: str):
#     return db.query(models.User).filter(models.User.email == email).first()

# def create_user(db: Session, user: schemas.UserCreate):
#     fake_hashed_password = user.password + "notreallyhashed"
#     db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user


# def get_items(db: Session, skip: int = 0, limit: int = 100):
#     return db.query(models.Item).offset(skip).limit(limit).all()


# def create_user_item(db: Session, item: schemas.ItemCreate, user_id: int):
#     db_item = models.Item(**item.dict(), owner_id=user_id)
#     db.add(db_item)
#     db.commit()
#     db.refresh(db_item)
#     return db_item