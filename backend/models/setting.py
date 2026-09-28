from sqlalchemy import Column, Integer, Boolean
from database import Base

class StoreSetting(Base):
    __tablename__ = 'setting'
    id = Column(Integer, primary_key=True, index=True)
    standard_wait_time = Column(Integer, default=15)
    peak_wait_time = Column(Integer, default=30)
    is_peak_time = Column(Boolean, default=False)
    is_paused = Column(Boolean, default=False)    