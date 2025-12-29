from sqlalchemy import Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

from app.database import Base

class MoodEntry(Base):
    __tablename__ = "mood_entries"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), index=True)
    
    mood_level: Mapped[int] = mapped_column(Integer) # 1-10
    energy_level: Mapped[int] = mapped_column(Integer) # 1-10
    stress_level: Mapped[int] = mapped_column(Integer) # 1-10
    note: Mapped[str | None] = mapped_column(String)
    custom_metrics: Mapped[dict | list | None] = mapped_column(JSON)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    user: Mapped["User"] = relationship(back_populates="mood_entries")
