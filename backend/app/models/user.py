from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from backend.app.database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    is_active: Mapped[bool] = mapped_column(default=True)
    
    settings: Mapped["UserSettings"] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    mood_entries: Mapped[list["MoodEntry"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    therapist_info: Mapped["TherapistInfo"] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    emergency_contacts: Mapped[list["EmergencyContact"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    therapist_tasks: Mapped[list["TherapistTask"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    appointments: Mapped[list["Appointment"]] = relationship(back_populates="user", cascade="all, delete-orphan")

class UserSettings(Base):
    __tablename__ = "user_settings"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), primary_key=True)
    theme: Mapped[str | None] = mapped_column(String, default="system")
    language: Mapped[str | None] = mapped_column(String, default="en")
    # Add other settings as needed
    
    user: Mapped["User"] = relationship(back_populates="settings")
