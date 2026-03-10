from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import ChatMessage


router = APIRouter(prefix="/history", tags=["history"])


class MessageSchema(BaseModel):
    role: str
    content: str
    timestamp: str
    sources: list = []


@router.get("/{session_id}", response_model=List[MessageSchema])
def get_history(session_id: str, db: Session = Depends(get_db)):
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )
    return [
        MessageSchema(
            role=m.role,
            content=m.content,
            timestamp=m.created_at.isoformat(),
            sources=m.sources or [],
        )
        for m in messages
    ]
