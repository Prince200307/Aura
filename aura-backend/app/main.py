from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import create_db_and_tables, get_default_user, get_session
from app.routers import months, expenses, goals, contributions, recurring, deferred, recommendations


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    with next(get_session()) as session:
        get_default_user(session)
    yield


app = FastAPI(
    title="Aura Backend",
    description="Budget tracking and goal management API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(months.router)
app.include_router(expenses.router)
app.include_router(goals.router)
app.include_router(contributions.router)
app.include_router(recurring.router)
app.include_router(deferred.router)
app.include_router(recommendations.router)


@app.get("/")
def root():
    return {"message": "Aura Backend API", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "healthy"}