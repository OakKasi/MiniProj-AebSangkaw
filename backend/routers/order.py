from fastapi import APIRouter , HTTPException , status , Depends ,Request
from models.order import Order, OrderItem
from models.menu import Menu, Toppings, menu_toppings
from schemas.order import OrderCreate
from database import get_db
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/")
def create_order(order_data:OrderCreate,db:Session = Depends(get_db)):
    new_order = Order(
        user_id = order_data.user_id,
        total_price = order_data.total_price,
        order_type = order_data.order_type,
        status = "pending"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for item in order_data.items:
        order_item = OrderItem (
            order_id = new_order.id,
            menu_id = item.menu_id,
            quantity= item.quantity,
            price = item.price
        )
        db.add(order_item)
    db.commit()
    return {"status": "success", "order_id": new_order.id, "message": "สั่งซื้อสำเร็จ!"}

@router.get("/")
def get_all_order(db:Session = Depends(get_db)):
    order = db.query(Order).order_by(Order.id.desc()).all()
    return order

@router.put("/{order_id}/status")
def update_order_status(order_id:int,status:str,db:Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404,detail="Order not found")
    order.status=status
    db.commit()
    return{
        "status" : "success","message" : f"อัปเดตสถานะออเดอร์ #{order_id} เรียบร้อย"
    }

@router.delete("/{order_id}")
def delete_order(order_id:int,db:Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404,detail="Order not found")
    db.query(OrderItem).filter(OrderItem.order_id == order_id).delete()
    db.delete(order)
    db.commit()
    return{
        "status" : "success","message": f"ทำการลบออเดอร์หมายเลข #{order_id} เรียบร้อย" 
    }

@router.get("/user/{user_id}")
def get_user_orders(user_id: int, db: Session = Depends(get_db)):
    return db.query(Order).filter(Order.user_id == user_id).all()



