from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.content import Content

router = APIRouter(
    prefix="/api/content",
    tags=["Content"]
)


@router.get("")
def get_all_content(db: Session = Depends(get_db)):
    contents = (
        db.query(Content)
        .order_by(Content.created_at.desc())
        .all()
    )

    return [
        {
            "id": content.id,
            "title": content.title,
            "content_type": content.content_type,
            "description": content.description,
            "release_date": content.release_date,
            "duration_minutes": content.duration_minutes,
            "poster_url": content.poster_url,
            "created_at": content.created_at,
            "updated_at": content.updated_at
        }
        for content in contents
    ]


@router.get("/{content_id}")
def get_content(
    content_id: int,
    db: Session = Depends(get_db)
):
    content = (
        db.query(Content)
        .filter(Content.id == content_id)
        .first()
    )

    if not content:
        return {
            "message": "Content not found"
        }

    return {
        "id": content.id,
        "title": content.title,
        "content_type": content.content_type,
        "description": content.description,
        "release_date": content.release_date,
        "duration_minutes": content.duration_minutes,
        "poster_url": content.poster_url,
        "created_at": content.created_at,
        "updated_at": content.updated_at
    }