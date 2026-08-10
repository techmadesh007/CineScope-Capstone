from sqlalchemy.orm import Session

from app.models.content import Content
from app.models.review import Review
from app.schemas.review import ReviewCreate


def create_review(
    db: Session,
    user_id: int,
    review_data: ReviewCreate
):
    content = (
        db.query(Content)
        .filter(Content.id == review_data.content_id)
        .first()
    )

    if content is None:
        return None, "CONTENT_NOT_FOUND"

    review = Review(
        user_id=user_id,
        content_id=review_data.content_id,
        review_text=review_data.review_text,
        status="ACTIVE"
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return review, "CREATED"


def get_reviews_for_content(
    db: Session,
    content_id: int
):
    return (
        db.query(Review)
        .filter(
            Review.content_id == content_id,
            Review.status == "ACTIVE"
        )
        .order_by(Review.created_at.desc())
        .all()
    )