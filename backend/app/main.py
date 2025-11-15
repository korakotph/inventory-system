from fastapi import FastAPI, HTTPException, Depends
from sqlmodel import Session
from .database import init_db, engine
from .models import Item, ItemCreate, ItemUpdate
import crud


app = FastAPI(title="Inventory API")


@app.on_event("startup")
def on_startup():
init_db()


@app.get("/health")
def health():
return {"status": "ok"}


@app.post("/items", response_model=Item)
def create_item(item: ItemCreate):
return crud.create_item(item)


@app.get("/items")
def read_items():
return crud.list_items()


@app.get("/items/{item_id}")
def read_item(item_id: int):
item = crud.get_item(item_id)
if not item:
raise HTTPException(status_code=404, detail="Item not found")
return item


@app.put("/items/{item_id}", response_model=Item)
def edit_item(item_id: int, item: ItemUpdate):
updated = crud.update_item(item_id, item)
if not updated:
raise HTTPException(status_code=404, detail="Item not found")
return updated


@app.delete("/items/{item_id}")
def remove_item(item_id: int):
success = crud.delete_item(item_id)
if not success:
raise HTTPException(status_code=404, detail="Item not found")
return {"ok": True}