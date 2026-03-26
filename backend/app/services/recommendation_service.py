from typing import List, Dict, Any
from datetime import datetime
from bson import ObjectId
from app.database import doctors_collection, appointments_collection
from app.services.dynamic_slot_service import DynamicSlotService

class RecommendationService:
    SYMPTOM_MAP = {
        "fever": "General Physician",
        "cold": "General Physician",
        "cough": "General Physician",
        "heart": "Cardiology",
        "chest": "Cardiology",
        "skin": "Dermatology",
        "rash": "Dermatology",
        "bones": "Orthopedics",
        "fracture": "Orthopedics",
        "headache": "Neurology",
        "seizure": "Neurology",
        "eye": "Ophthalmology",
        "vision": "Ophthalmology",
        "child": "Pediatrics",
        "baby": "Pediatrics",
        "breathing": "General Physician",
        "unconscious": "General Physician",
        "stomach": "General Physician",
        "ortho": "Orthopedics",
        "neuro": "Neurology"
    }
    
    @staticmethod
    async def get_emergency_slot(symptoms: str, preferred_date: str, location_id: str = None) -> Dict:
        # Detect relevant specialization
        target_spec = None
        s_lower = symptoms.lower()
        for s_key, spec in RecommendationService.SYMPTOM_MAP.items():
            if s_key in s_lower:
                target_spec = spec
                break
        
        async def scan_doctors(cursor):
            docs = await cursor.to_list(100)
            best_opt = None
            for d in docs:
                d_id = str(d["_id"])
                try:
                    # Use DynamicSlotService to check availability
                    res = await DynamicSlotService.generate_slots(d_id, preferred_date)
                    slots = res.get("slots", [])
                    
                    # Also check if doctor is on leave
                    if res.get("reason") == "LEAVE":
                        continue

                    avail = [s for s in slots if not s["is_full"]]
                    if avail:
                        first = avail[0]
                        if best_opt is None or first["time"] < best_opt["time"]:
                            best_opt = {
                                "doctor_id": d_id,
                                "doctor_name": d.get("name"),
                                "specialization": d.get("specialization"),
                                "time": first["time"],
                                "date": preferred_date,
                                "available": True,
                                "message": f"Found earlier slot with Dr. {d.get('name')}"
                            }
                except Exception:
                    continue
            return best_opt

        # 1. Primary: Search specialized doctors first, preferably in same location
        search_query = {"available": True, "is_deleted": {"$ne": True}}
        if target_spec:
            search_query["specialization"] = target_spec
            
        if location_id:
            # Note: Assuming doctor document has location_id or we use doctor_locations mapping
            # For simplicity, let's just search by specialization first
            pass

        spec_opt = await scan_doctors(doctors_collection.find(search_query))
        if spec_opt: return spec_opt
                
        # 2. Secondary: Fallback to all doctors for maximum speed if specialized not found
        return await scan_doctors(doctors_collection.find({"available": True, "is_deleted": {"$ne": True}}))

    @staticmethod
    async def get_related_doctors(doctor_id: str, date: str) -> List[Dict]:
        """
        Find doctors with same specialization who have slots on the given date.
        Useful when the primary doctor is full or on leave.
        """
        from bson import ObjectId
        primary_doc = await doctors_collection.find_one({"_id": ObjectId(doctor_id)})
        if not primary_doc:
            return []
            
        spec = primary_doc.get("specialization")
        # Find others with same spec
        cursor = doctors_collection.find({
            "specialization": spec,
            "_id": {"$ne": ObjectId(doctor_id)},
            "available": True,
            "is_deleted": {"$ne": True}
        })
        
        docs = await cursor.to_list(10)
        recommendations = []
        
        for d in docs:
            try:
                res = await DynamicSlotService.generate_slots(str(d["_id"]), date)
                slots = res.get("slots", [])
                avail_slots = [s for s in slots if not s["is_full"]]
                
                if avail_slots:
                    recommendations.append({
                        "doctor_id": str(d["_id"]),
                        "doctor_name": d.get("name"),
                        "specialization": d.get("specialization"),
                        "earliest_slot": avail_slots[0]["time"],
                        "total_slots": len(avail_slots)
                    })
            except Exception:
                continue
                
        return sorted(recommendations, key=lambda x: x["earliest_slot"])
