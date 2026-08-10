from sqlalchemy.orm import Session

from app.models.content import Content
from app.schemas.content import ContentCreate


def create_content(
    db: Session,
    content_data: ContentCreate
):
    content = Content(
        title=content_data.title,
        content_type=content_data.content_type,
        description=content_data.description,
        release_date=content_data.release_date,
        duration_minutes=content_data.duration_minutes,
        poster_url=content_data.poster_url
    )

    db.add(content)
    db.commit()
    db.refresh(content)

    return content


def get_all_content(db: Session):
    return (
        db.query(Content)
        .order_by(Content.id.desc())
        .all()
    )


def get_content_by_id(
    db: Session,
    content_id: int
):
    return (
        db.query(Content)
        .filter(Content.id == content_id)
        .first()
    )