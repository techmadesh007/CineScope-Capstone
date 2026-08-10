from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.rating import (
    RatingCreate,
    RatingResponse
)
from app.services.rating_service import (
    create_rating,
    get_ratings_for_content
)


router = APIRouter(
    prefix="/api/ratings",
    tags=["Ratings"]
)


@router.post(
    "",
    response_model=RatingResponse
)
def add_rating(
    rating_data: RatingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rating, status = create_rating(
        db,
        current_user.id,
        rating_data
    )

    if status == "CONTENT_NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Content not found"
        )

    return rating


@router.get(
    "/{content_id}",
    response_model=list[RatingResponse]
)
def get_ratings(
    content_id: int,
    db: Session = Depends(get_db)
):
    return get_ratings_for_content(
        db,
        content_id
    )