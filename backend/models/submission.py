from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class StatusHistory(BaseModel):
    status: str
    changed_at: datetime
    changed_by: str

class SubmissionBase(BaseModel):
    text_content: str
    language: str = "English"
    source: str = "Web"
    ward: str
    input_type: str = Field(..., pattern="^(text|voice|photo)$")
    media_url: Optional[str] = None
    theme: Optional[str] = "Uncategorized"

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionUpdate(BaseModel):
    text_content: Optional[str] = None
    status: Optional[str] = None
    theme: Optional[str] = None

class SubmissionResponse(SubmissionBase):
    id: str = Field(..., alias="_id")
    citizen_id: str
    status: str = "pending"
    status_history: List[StatusHistory] = []
    is_deleted: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
