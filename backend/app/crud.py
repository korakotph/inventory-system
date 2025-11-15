from sqlmodel import select
from .models import Item, ItemCreate, ItemUpdate
from .database import engine
from sqlmodel import Session




def create_item(item_in: ItemCreate) -> Item:
with Session(engine) as session:
item = Item.from_orm(item_in)
session.add(item)
session.commit()
session.refresh(item)
return item




def get_item(item_id: int) -> Item | None:
with Session(engine) as session:
return session.get(Item, item_id)




def list_items() -> list[Item]:
with Session(engine) as session:
return session.exec(select(Item).order_by(Item.id)).all()




def update_item(item_id: int, item_in: ItemUpdate) -> Item | None:
with Session(engine) as session:
item = session.get(Item, item_id)
if not item:
return None
item_data = item_in.dict(exclude_unset=True)
for key, value in item_data.items():
setattr(item, key, value)
session.add(item)
session.commit()
session.refresh(item)
return item




def delete_item(item_id: int) -> bool:
with Session(engine) as session:
item = session.get(Item, item_id)
if not item:
return False
session.delete(item)
session.commit()
return True