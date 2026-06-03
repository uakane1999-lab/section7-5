from fastapi import FastAPI
from app.api.v1 import auth

app = FastAPI()

# ルーターを登録
app.include_router(auth.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}