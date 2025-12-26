from pydantic import BaseModel, EmailStr, UUID4
from typing import Optional

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: UUID4

    class Config:
        from_attributes = True

# Additional properties to return via API
class User(UserInDBBase):
    pass
