from fastapi import APIRouter, Depends
from ..db.mongo import get_collection
from ..core.dependencies import require_role
from ..services.ranking import calculate_priority_score
from typing import List

router = APIRouter(prefix="/api/mp/dashboard", tags=["dashboard"])

@router.get("/stats")
async def get_dashboard_stats(current_user: dict = Depends(require_role("mp"))):
    submissions_collection = await get_collection("submissions")
    
    total = await submissions_collection.count_documents({"is_deleted": False})
    pending = await submissions_collection.count_documents({"status": "pending", "is_deleted": False})
    in_review = await submissions_collection.count_documents({"status": "in_review", "is_deleted": False})
    resolved = await submissions_collection.count_documents({"status": "resolved", "is_deleted": False})
    
    # Theme counts
    pipeline = [
        {"$match": {"is_deleted": False}},
        {"$group": {"_id": "$theme", "count": {"$sum": 1}}}
    ]
    theme_counts = await submissions_collection.aggregate(pipeline).to_list(length=100)
    
    # Ward counts
    pipeline = [
        {"$match": {"is_deleted": False}},
        {"$group": {"_id": "$ward", "count": {"$sum": 1}}}
    ]
    ward_counts = await submissions_collection.aggregate(pipeline).to_list(length=100)
    
    return {
        "total": total,
        "pending": pending,
        "in_review": in_review,
        "resolved": resolved,
        "themes": {t["_id"]: t["count"] for t in theme_counts},
        "wards": {w["_id"]: w["count"] for w in ward_counts}
    }

@router.get("/rankings")
async def get_dashboard_rankings(current_user: dict = Depends(require_role("mp"))):
    submissions_collection = await get_collection("submissions")
    
    # Group by ward and theme to find potential projects
    pipeline = [
        {"$match": {"is_deleted": False}},
        {"$group": {
            "_id": {"ward": "$ward", "theme": "$theme"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    groups = await submissions_collection.aggregate(pipeline).to_list(length=10)
    
    rankings = []
    for i, group in enumerate(groups, 1):
        ward = group["_id"]["ward"]
        theme = group["_id"]["theme"]
        count = group["count"]
        
        scores = calculate_priority_score(count, {})
        rankings.append({
            "_id": f"rank_{i}",
            "project_name": f"{theme} Improvement - {ward}",
            "ward": ward,
            "theme": theme,
            **scores
        })
    
    return rankings
