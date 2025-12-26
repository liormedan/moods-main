from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS
import os
frontend_url = os.getenv("FRONTEND_URL", "*")
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    frontend_url if frontend_url != "*" else "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "app": settings.PROJECT_NAME}

from backend.app.api.api import api_router

app.include_router(api_router, prefix=settings.API_V1_STR)

