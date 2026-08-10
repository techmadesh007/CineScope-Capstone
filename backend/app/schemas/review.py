from datetime import datetime

from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    content_id: int
    review_text: str = Field(
        min_length=1,
        max_length=5000
    )


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    content_id: int
    review_text: str
    status: str
    created_at: datetime | None
    updated_at: datetime | None

    class Config:
        from_attributes = True