from fastapi import FastAPI
import uvicorn
from database import engine, Base
import models.user
import models.menu
import models.order
import models.setting
from routers import auth, order, menu 
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(auth.router,prefix="/api/auth",tags=["Authentication"])
app.include_router(order.router,prefix="/api/orders",tags=["Orders"])
app.include_router(menu.router,prefix="/api",tags=["Menus & Toppings"])

@app.get("/")
def read_root():
    return {"message": "Backend ร้านข้าวแม่ แอปสั่งข้าว "}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
