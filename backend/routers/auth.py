from fastapi import APIRouter, Depends, HTTPException, status
from ..models.user import UserCreate, UserLogin, UserResponse
from ..core.security import get_password_hash, verify_password, create_access_token
from ..db.mongo import get_collection
from ..core.dependencies import get_current_user
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/citizen/register", response_model=UserResponse)
async def register_citizen(user_in: UserCreate):
    users_collection = await get_collection("users")
    
    # Check if user already exists
    if await users_collection.find_one({"email": user_in.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user_in.dict()
    user_dict["password_hash"] = get_password_hash(user_dict.pop("password"))
    user_dict["role"] = "citizen"
    user_dict["created_at"] = datetime.utcnow()
    
    result = await users_collection.insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    return user_dict

@router.post("/citizen/login")
async def login_citizen(user_in: UserLogin):
    users_collection = await get_collection("users")
    user = await users_collection.find_one({"email": user_in.email, "role": "citizen"})
    
    if not user or not verify_password(user_in.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer", "role": "citizen"}

@router.post("/mp/login")
async def login_mp(user_in: UserLogin):
    users_collection = await get_collection("users")
    user = await users_collection.find_one({"email": user_in.email, "role": "mp"})
    
    if not user or not verify_password(user_in.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer", "role": "mp"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
