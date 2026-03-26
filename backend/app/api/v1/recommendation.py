from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
from app.services.recommendation_service import RecommendationService

router = APIRouter()


class EmergencyRequest(BaseModel):
    symptoms: str
    preferred_date: str


@router.post("/emergency-slot")
async def emergency_slot(data: EmergencyRequest, location_id: Optional[str] = None):
    try:
        slot = await RecommendationService.get_emergency_slot(data.symptoms, data.preferred_date, location_id)
        if not slot:
            raise HTTPException(status_code=404, detail="No emergency slots available for today")
        return slot
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/related-doctors/{doctor_id}")
async def get_related_doctors(doctor_id: str, date: str):
    try:
        recommendations = await RecommendationService.get_related_doctors(doctor_id, date)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
