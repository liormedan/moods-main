from fastapi import APIRouter
from app.api.endpoints import auth, moods, users, appointments

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(moods.router, prefix="/moods", tags=["moods"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
