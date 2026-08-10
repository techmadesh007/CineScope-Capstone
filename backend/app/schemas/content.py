from datetime import date, datetime

from pydantic import BaseModel, Field


class ContentCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content_type: str = Field(min_length=1, max_length=20)
    description: str | None = None
    release_date: date | None = None
    duration_minutes: int | None = None
    poster_url: str | None = None


class ContentResponse(BaseModel):
    id: int
    title: str
    content_type: str
    description: str | None
    release_date: date | None
    duration_minutes: int | None
    poster_url: str | None
    created_at: datetime | None
    updated_at: datetime | None

    class Config:
        from_attributes = True