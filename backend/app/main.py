from fastapi import FastAPI
from app.models.content import Content
from app.core.database import Base, engine
from app.models.user import User
from app.models.genre import Genre
from app.models.content_genre import ContentGenre
from app.models.rating import Rating
from app.models.review import Review
from app.models.watchlist import Watchlist

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Movies & Webseries Review Platform",
    version="1.0.0"
)


@app.get("/health")
def health_check():
    return {
        "status": "success",
        "message": "Movie Review Platform API is running"
    }