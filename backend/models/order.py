from sqlalchemy import Column, Integer, String, Float, Boolean,ForeignKey,DateTime
from sqlalchemy.sql import func

from database import Base

class Order(Base):
    __tablename__ = 'orders'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    total_price = Column(Float, nullable=False)
    status = Column(String, default='pending')
    order_type = Column(String, default='pickup') # 'pickup' หรือ 'delivery' 
    created_at = Column(DateTime, server_default=func.now())
    slip_url = Column(String, nullable=True)

class OrderItem(Base):
    __tablename__ = 'order_items'
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey('orders.id'))
    menu_id = Column(Integer, ForeignKey('menus.id'))
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)

class OrderToppings(Base):
    __tablename__ = 'order_toppings'
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey('orders.id'))
    toppings_id = Column(Integer, ForeignKey('toppings.id'))
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)