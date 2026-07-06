from fastapi import APIRouter, Depends, HTTPException, status
from ..models.submission import SubmissionCreate, SubmissionResponse, SubmissionUpdate
from ..db.mongo import get_collection
from ..core.dependencies import get_current_user, require_role
from ..services.ai_processing import suggest_category
from datetime import datetime
from bson import ObjectId
from typing import List

router = APIRouter(prefix="/api/submissions", tags=["citizen_submissions"])

@router.post("", response_model=SubmissionResponse)
async def create_submission(submission_in: SubmissionCreate, current_user: dict = Depends(require_role("citizen"))):
    submissions_collection = await get_collection("submissions")
    
    submission_dict = submission_in.dict()
    submission_dict["citizen_id"] = current_user["_id"]
    submission_dict["status"] = "pending"
    submission_dict["status_history"] = [{
        "status": "pending",
        "changed_at": datetime.utcnow(),
        "changed_by": "system"
    }]
    submission_dict["is_deleted"] = False
    submission_dict["created_at"] = datetime.utcnow()
    submission_dict["updated_at"] = datetime.utcnow()
    
    if not submission_dict.get("theme") or submission_dict["theme"] == "Uncategorized":
        submission_dict["theme"] = suggest_category(submission_dict["text_content"])
    
    result = await submissions_collection.insert_one(submission_dict)
    submission_dict["_id"] = str(result.inserted_id)
    return submission_dict

@router.get("/mine", response_model=List[SubmissionResponse])
async def get_my_submissions(current_user: dict = Depends(require_role("citizen"))):
    submissions_collection = await get_collection("submissions")
    cursor = submissions_collection.find({"citizen_id": current_user["_id"], "is_deleted": False})
    submissions = await cursor.to_list(length=100)
    for s in submissions:
        s["_id"] = str(s["_id"])
    return submissions

@router.put("/{id}", response_model=SubmissionResponse)
async def update_my_submission(id: str, submission_in: SubmissionUpdate, current_user: dict = Depends(require_role("citizen"))):
    submissions_collection = await get_collection("submissions")
    submission = await submissions_collection.find_one({"_id": ObjectId(id), "citizen_id": current_user["_id"]})
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    if submission["status"] != "pending":
        raise HTTPException(status_code=403, detail="Only pending submissions can be edited")
    
    update_data = submission_in.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await submissions_collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    
    updated_submission = await submissions_collection.find_one({"_id": ObjectId(id)})
    updated_submission["_id"] = str(updated_submission["_id"])
    return updated_submission

@router.delete("/{id}")
async def delete_my_submission(id: str, current_user: dict = Depends(require_role("citizen"))):
    submissions_collection = await get_collection("submissions")
    submission = await submissions_collection.find_one({"_id": ObjectId(id), "citizen_id": current_user["_id"]})
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    if submission["status"] != "pending":
        raise HTTPException(status_code=403, detail="Only pending submissions can be deleted")
    
    await submissions_collection.update_one({"_id": ObjectId(id)}, {"$set": {"is_deleted": True, "updated_at": datetime.utcnow()}})
    return {"message": "Submission deleted successfully"}
