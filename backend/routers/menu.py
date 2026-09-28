from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.menu import Menu, Toppings, menu_toppings

router = APIRouter()

@router.get("/menus")
def get_menus(db: Session = Depends(get_db)):
    menus = db.query(Menu).all()
    return menus

@router.get("/toppings")
def get_toppings(db: Session = Depends(get_db)):
    toppings = db.query(Toppings).filter(Toppings.is_available == True).all()
    # ส่งคืนทั้ง name และ toppings_name เพื่อให้ Frontend ใช้งานได้สะดวก
    return [
        {
            "id": t.id,
            "name": t.toppings_name,
            "toppings_name": t.toppings_name,
            "price": getattr(t, "price", 10.0),
            "is_available": t.is_available
        }
        for t in toppings
    ]

@router.get("/menu_toppings")
def get_menu_toppings(db: Session = Depends(get_db)):
    return db.query(menu_toppings).all()
