from fastapi import APIRouter, Depends
from ..db.mongo import get_collection
from ..core.dependencies import require_role
from ..services.ward_data import get_ward_coordinates
from typing import List

router = APIRouter(prefix="/api/mp/map", tags=["map"])

@router.get("/heatmap")
async def get_heatmap_data(current_user: dict = Depends(require_role("mp"))):
    submissions_collection = await get_collection("submissions")
    
    pipeline = [
        {"$match": {"is_deleted": False}},
        {"$group": {"_id": "$ward", "count": {"$sum": 1}}}
    ]
    ward_counts = await submissions_collection.aggregate(pipeline).to_list(length=100)
    
    heatmap_points = []
    for item in ward_counts:
        ward = item["_id"]
        count = item["count"]
        coords = get_ward_coordinates(ward)
        # Leaflet heat expects [lat, lng, intensity]
        heatmap_points.append([coords[0], coords[1], count])
        
    return heatmap_points

@router.get("/markers")
async def get_marker_data(current_user: dict = Depends(require_role("mp"))):
    submissions_collection = await get_collection("submissions")
    cursor = submissions_collection.find({"is_deleted": False}).limit(100)
    submissions = await cursor.to_list(length=100)
    
    markers = []
    for s in submissions:
        coords = get_ward_coordinates(s["ward"])
        markers.append({
            "id": str(s["_id"]),
            "lat": coords[0],
            "lng": coords[1],
            "theme": s["theme"],
            "status": s["status"]
        })
    return markers
