from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field


class Item(SQLModel, table=True):
id: Optional[int] = Field(default=None, primary_key=True)
name: str
description: Optional[str] = None
quantity: int = 0
location: Optional[str] = None
created_at: datetime = Field(default_factory=datetime.utcnow)


class ItemCreate(SQLModel):
name: str
description: Optional[str] = None
quantity: int = 0
location: Optional[str] = None


class ItemUpdate(SQLModel):
name: Optional[str] = None
description: Optional[str] = None
quantity: Optional[int] = None
location: Optional[str] = None