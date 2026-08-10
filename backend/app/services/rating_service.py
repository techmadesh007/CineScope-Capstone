from sqlalchemy.orm import Session

from app.models.content import Content
from app.models.rating import Rating
from app.schemas.rating import RatingCreate


def create_rating(
    db: Session,
    user_id: int,
    rating_data: RatingCreate
):
    content = (
        db.query(Content)
        .filter(Content.id == rating_data.content_id)
        .first()
    )

    if content is None:
        return None, "CONTENT_NOT_FOUND"

    existing_rating = (
        db.query(Rating)
        .filter(
            Rating.user_id == user_id,
            Rating.content_id == rating_data.content_id
        )
        .first()
    )

    if existing_rating:
        existing_rating.rating = rating_data.rating
        db.commit()
        db.refresh(existing_rating)

        return existing_rating, "UPDATED"

    rating = Rating(
        user_id=user_id,
        content_id=rating_data.content_id,
        rating=rating_data.rating
    )

    db.add(rating)
    db.commit()
    db.refresh(rating)

    return rating, "CREATED"


def get_ratings_for_content(
    db: Session,
    content_id: int
):
    return (
        db.query(Rating)
        .filter(Rating.content_id == content_id)
        .order_by(Rating.created_at.desc())
        .all()
    )