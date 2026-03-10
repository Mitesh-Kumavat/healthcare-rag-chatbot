from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import ChatMessage
from app.rag.chain import answer_question_with_rag


router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    question: str


class ChatResponse(BaseModel):
    session_id: str
    answer: str
    sources: list


@router.post("", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)) -> ChatResponse:
    
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question must not be empty.")

    session_id = request.session_id or str(uuid4())


    # Save user message
    user_msg = ChatMessage(
        session_id=session_id,
        role="user",
        content=request.question.strip(),
    )
    db.add(user_msg)
    db.commit()
    

    rag_result = answer_question_with_rag(request.question, session_id=session_id)
    answer = rag_result["answer"]
    sources = rag_result["sources"]

    # Save assistant message
    assistant_msg = ChatMessage(
        session_id=session_id,
        role="assistant",
        content=answer,
        sources=sources,
    )
    db.add(assistant_msg)
    db.commit()
    
    return ChatResponse(session_id=session_id, answer=answer, sources=sources)
