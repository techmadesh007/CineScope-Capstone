from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine

from app.models.user import User
from app.models.genre import Genre
from app.models.content import Content
from app.models.content_genre import ContentGenre
from app.models.rating import Rating
from app.models.review import Review
from app.models.watchlist import Watchlist

from app.api.auth import router as auth_router
from app.api.content import router as content_router
from app.api.ratings import router as ratings_router
from app.api.reviews import router as reviews_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Movies & Webseries Review Platform",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(content_router)
app.include_router(ratings_router)
app.include_router(reviews_router)


@app.get("/health")
def health_check():
    return {
        "status": "success",
        "message": "Movie Review Platform API is running"
    }