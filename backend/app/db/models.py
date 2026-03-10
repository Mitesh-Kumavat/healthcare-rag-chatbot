import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, String, Text, JSON

from app.db.database import Base


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, index=True)
    role = Column(String, nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    sources = Column(JSON, nullable=True)
