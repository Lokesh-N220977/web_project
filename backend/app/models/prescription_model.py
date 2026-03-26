from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MedicineItem(BaseModel):
    id: str = ""
    medicine: str
    strength: Optional[str] = None
    dosage: str
    frequency: str = "Daily"
    duration: str
    instructions: Optional[str] = None

class PrescriptionBase(BaseModel):
    patient_id: str
    patient_name: str
    doctor_id: str
    doctor_name: str
    # Keep single fields for backward compatibility with old records
    medicine: Optional[str] = None
    strength: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    instructions: Optional[str] = None
    # NEW: List of medicines for multi-medicine support
    medicines: List[MedicineItem] = []
    date: str = datetime.now().strftime("%B %d, %Y")

class PrescriptionCreate(PrescriptionBase):
    pass

class PrescriptionResponse(PrescriptionBase):
    id: str
    status: str = "Active"
