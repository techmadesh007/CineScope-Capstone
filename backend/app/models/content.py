from sqlalchemy import Column, Integer, String, Text, Date, DateTime
from sqlalchemy.sql import func

from app.core.database import Base


class Content(Base):
    __tablename__ = "contents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content_type = Column(String(20), nullable=False)
    description = Column(Text, nullable=True)
    release_date = Column(Date, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    poster_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())