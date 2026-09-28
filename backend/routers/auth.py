from fastapi import APIRouter , HTTPException , status , Depends
from models.user import User
from schemas.user import UserCreate, UserLogin, UserUpdate, UserResponse
from database import SessionLocal
from sqlalchemy.orm import Session

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register",response_model=UserResponse)
def register(user:UserCreate,db: Session = Depends(get_db)):
    userexit = db.query(User).filter(User.username == user.username).first()
    if userexit:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ไอดีใช้ไปแล้ว"
        )
    new_user = User(
        username=user.username,
        password=user.password,
        phonenumber=user.phonenumber,
        role=user.role,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login",response_model=UserResponse)
def login(user_data:UserLogin,db:Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user_data.username,User.password == user_data.password).first()

    if not db_user :
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ไอดีหรือรหัสผ่านไม่สามารถเข้าได้"
        )

    return db_user

@router.post("/reser-password")
def reset_password(user_data:UserUpdate,db:Session = Depends(get_db)):
    db_user = db.query(User).filter(
        User.username == user_data.username,
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ไม่พบผู้ใช้งาน "
        )
    db_user.password = user_data.new_password
    db.commit()
    return {"message":"เปลี่ยนรหัสผ่านสำเร็จ"}