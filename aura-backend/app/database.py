from sqlmodel import SQLModel, create_engine, Session, select
from sqlalchemy.pool import NullPool
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, poolclass=NullPool, echo=False)


def create_db_and_tables():
    from app.models import user, month_snapshot, expense, goal, goal_contribution, recurring_template, deferred_want
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


def get_default_user(session: Session):
    from app.models.user import User

    statement = select(User)
    user = session.exec(statement).first()
    if not user:
        user = User(name="Prince", currency="INR", created_at=datetime.now())
        session.add(user)
        session.commit()
        session.refresh(user)
    return user