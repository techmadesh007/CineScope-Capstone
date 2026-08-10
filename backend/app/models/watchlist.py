from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.core.database import Base


class Watchlist(Base):
    __tablename__ = "watchlists"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    content_id = Column(
        Integer,
        ForeignKey("contents.id"),
        nullable=False
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )