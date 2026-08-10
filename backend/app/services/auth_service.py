from sqlalchemy.orm import Session

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest
)


def register_user(
    db: Session,
    user_data: RegisterRequest
):
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        return None

    user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        role="USER"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def login_user(
    db: Session,
    login_data: LoginRequest
):
    user = (
        db.query(User)
        .filter(User.email == login_data.email)
        .first()
    )

    if user is None:
        return None

    if not verify_password(
        login_data.password,
        user.password_hash
    ):
        return None

    token = create_access_token(
        user.id,
        user.role
    )

    return user, token