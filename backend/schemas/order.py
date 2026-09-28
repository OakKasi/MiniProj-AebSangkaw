from pydantic import BaseModel
from typing import List, Optional

class OrderItemCreate(BaseModel):
    menu_id: int
    quantity: int
    price: float

class OrderCreate(BaseModel):
    user_id: int
    total_price: float
    order_type: Optional[str] = "pickup"
    items: List[OrderItemCreate]
