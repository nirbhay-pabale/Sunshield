from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import init_db
from .api.endpoints import router as api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database and seed initial data
    init_db()
    yield

app = FastAPI(
    title="SAHAYYA.AI Heat Risk Intelligence API",
    description="Municipal Decision-Support Infrastructure for Extreme Heatwave Early Warning & Human Thermal Stress Prediction.",
    version="2.4.0",
    lifespan=lifespan
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
