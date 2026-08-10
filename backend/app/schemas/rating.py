from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class RatingCreate(BaseModel):
    content_id: int
    rating: Decimal = Field(
        ge=1,
        le=5,
        decimal_places=1
    )


class RatingResponse(BaseModel):
    id: int
    user_id: int
    content_id: int
    rating: Decimal
    created_at: datetime | None
    updated_at: datetime | None

    class Config:
        from_attributes = True