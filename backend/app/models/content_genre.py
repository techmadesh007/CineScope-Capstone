from sqlalchemy import Column, Integer, ForeignKey

from app.core.database import Base


class ContentGenre(Base):
    __tablename__ = "content_genres"

    content_id = Column(
        Integer,
        ForeignKey("contents.id"),
        primary_key=True
    )

    genre_id = Column(
        Integer,
        ForeignKey("genres.id"),
        primary_key=True
    )