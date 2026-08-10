from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.review import (
    ReviewCreate,
    ReviewResponse
)
from app.services.review_service import (
    create_review,
    get_reviews_for_content
)


router = APIRouter(
    prefix="/api/reviews",
    tags=["Reviews"]
)


@router.post(
    "",
    response_model=ReviewResponse
)
def add_review(
    review_data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    review, status = create_review(
        db,
        current_user.id,
        review_data
    )

    if status == "CONTENT_NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Content not found"
        )

    return review


@router.get(
    "/{content_id}",
    response_model=list[ReviewResponse]
)
def get_reviews(
    content_id: int,
    db: Session = Depends(get_db)
):
    return get_reviews_for_content(
        db,
        content_id
    )