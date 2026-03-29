from typing import Optional
from sqlalchemy.orm import Session
from server.database import UserModel


def get_user(db: Session, email: str) -> Optional[UserModel]:
    return db.query(UserModel).filter(UserModel.email == email).first()


def create_user(db: Session, name: str, email: str, hashed_password: str) -> UserModel:
    user = UserModel(name=name, email=email, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_password(db: Session, email: str, hashed_password: str) -> bool:
    user = get_user(db, email)
    if not user:
        return False
    user.hashed_password = hashed_password
    db.commit()
    return True
