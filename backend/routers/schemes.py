from fastapi import APIRouter, Depends, HTTPException
from ..db.mongo import get_collection
from ..core.dependencies import get_current_user, require_role
from datetime import datetime
from bson import ObjectId
from typing import List

router = APIRouter(prefix="/api/schemes", tags=["schemes"])

@router.get("")
async def get_schemes():
    schemes_collection = await get_collection("schemes")
    cursor = schemes_collection.find()
    schemes = await cursor.to_list(length=100)
    for s in schemes:
        s["_id"] = str(s["_id"])
    return schemes

@router.post("")
async def create_scheme(scheme_in: dict, current_user: dict = Depends(require_role("mp"))):
    schemes_collection = await get_collection("schemes")
    scheme_dict = scheme_in
    scheme_dict["created_by"] = current_user["_id"]
    scheme_dict["created_at"] = datetime.utcnow()
    scheme_dict["updated_at"] = datetime.utcnow()
    
    result = await schemes_collection.insert_one(scheme_dict)
    scheme_dict["_id"] = str(result.inserted_id)
    return scheme_dict

@router.put("/{id}")
async def update_scheme(id: str, scheme_in: dict, current_user: dict = Depends(require_role("mp"))):
    schemes_collection = await get_collection("schemes")
    scheme_in["updated_at"] = datetime.utcnow()
    await schemes_collection.update_one({"_id": ObjectId(id)}, {"$set": scheme_in})
    return {"message": "Scheme updated"}

@router.delete("/{id}")
async def delete_scheme(id: str, current_user: dict = Depends(require_role("mp"))):
    schemes_collection = await get_collection("schemes")
    await schemes_collection.delete_one({"_id": ObjectId(id)})
    return {"message": "Scheme deleted"}
