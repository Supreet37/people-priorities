from fastapi import APIRouter, Depends, HTTPException, status
from ..db.mongo import get_collection
from ..core.dependencies import require_role
from datetime import datetime
from bson import ObjectId
from typing import List

router = APIRouter(prefix="/api/mp/submissions", tags=["mp_submissions"])

@router.get("")
async def get_all_submissions(current_user: dict = Depends(require_role("mp"))):
    submissions_collection = await get_collection("submissions")
    cursor = submissions_collection.find({"is_deleted": False})
    submissions = await cursor.to_list(length=1000)
    for s in submissions:
        s["_id"] = str(s["_id"])
    return submissions

@router.patch("/{id}/status")
async def update_submission_status(id: str, status: str, current_user: dict = Depends(require_role("mp"))):
    submissions_collection = await get_collection("submissions")
    submission = await submissions_collection.find_one({"_id": ObjectId(id)})
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    history_entry = {
        "status": status,
        "changed_at": datetime.utcnow(),
        "changed_by": current_user["_id"]
    }
    
    await submissions_collection.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {"status": status, "updated_at": datetime.utcnow()},
            "$push": {"status_history": history_entry}
        }
    )
    
    return {"message": f"Status updated to {status}"}
