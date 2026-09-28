from sqlalchemy import Column, Integer, String, Boolean, Float,ForeignKey
from database import Base

class Menu(Base):
    __tablename__ = 'menus'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    image_key = Column(String, nullable=True)
class Ingredient(Base):
    __tablename__ = 'ingredients'
    id = Column(Integer, primary_key=True, index=True)
    ingredients_name = Column(String, nullable=False)
    is_available = Column(Boolean, default=True)

class Toppings(Base):
    __tablename__ = 'toppings'
    id = Column(Integer, primary_key=True, index=True)
    toppings_name = Column(String, nullable=False)
    price = Column(Float, default=10.0, nullable=False)
    is_available = Column(Boolean, default=True)

class menu_toppings(Base):
    __tablename__ = 'menu_toppings'
    id = Column(Integer, primary_key=True, index=True)
    menu_id = Column(Integer, ForeignKey('menus.id'))
    toppings_id = Column(Integer, ForeignKey('toppings.id'))

