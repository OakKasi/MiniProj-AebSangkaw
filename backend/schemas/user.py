from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    phonenumber: str
    role: str = "customer"

class UserLogin(BaseModel):
    username: str
    password: str

class UserUpdate(BaseModel):
    username: str
    password: str
    new_password: str
class UserResponse(BaseModel):
    id: int
    username: str
    phonenumber: str
    role: str

class Config:
    from_attributes = True