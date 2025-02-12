from fastapi import APIRouter, Depends, HTTPException
from pywebpush import webpush, WebPushException
from sqlalchemy.orm import Session
from db import schemas, database
from api.crud import save_subscription, find_subscription_by_id
from api.utils import generate_vapid_keypair

push_router = APIRouter()

@push_router.get("/vapid-public-key")
def generate_keys():
        keys = generate_vapid_keypair()
        if not keys:
                raise ValueError("Failed to generate VAPID keys")
        return keys

@push_router.post("/subscribe")
async def subscribe(subscription: schemas.Subscription, db: Session = Depends(database.get_db)):
        save_subscription(db, subscription)
        # subscribed_user = find_subscription_by_id(db, subscription.user_id)
        # if not subscribed_user:
        # return {"message": "You've subscribed."}
        return {"message": "Subscription added."}
        