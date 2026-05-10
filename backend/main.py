from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
from dotenv import load_dotenv
from services import list_drive_files, list_email_messages, list_events, download_drive_file,list_courses,list_coursework,list_announcements
from gemini import chat_with_gemini, summarize_text, create_flashcards
from pydantic import BaseModel 

import os

load_dotenv()
os.environ["PYTHONIOENCODING"] = "utf-8"

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

app = FastAPI(title="Study Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SCOPES = [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/classroom.courses.readonly",
    "https://www.googleapis.com/auth/classroom.announcements.readonly",
    "https://www.googleapis.com/auth/classroom.student-submissions.me.readonly",
]


flow_store = {}

@app.get("/")
def root():
    return {"status": "Study Agent API running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/auth/login")
def login():
    flow = Flow.from_client_secrets_file(
        "credentials.json",
        scopes=SCOPES,
        redirect_uri="http://localhost:8000/auth/callback"
    )
    auth_url, state = flow.authorization_url(
        prompt="consent",
        access_type="offline"
    )
    flow_store[state] = flow
    return RedirectResponse(auth_url)

@app.get("/auth/callback")
def auth_callback(state: str, code: str):
    flow = flow_store.get(state)
    if not flow:
        return {"error": "Sesión inválida, intenta de nuevo"}
    flow.fetch_token(code=code)
    credentials = flow.credentials
    with open("token.json", "w") as f:
        f.write(credentials.to_json())
    del flow_store[state]
    return RedirectResponse("http://localhost:5173?auth=success")


@app.get("/drive/files")
def drive_files():
    try:
        files = list_drive_files()
        return {"files": files}
    except Exception as e:
        return {"error": str(e)}

@app.get("/gmail/emails")
def gmail_emails():
    try:
        emails = list_email_messages()
        return {"emails": emails}
    except Exception as e:
        return {"error": str(e)}

@app.get("/calendar/events")
def calendar_events():
    try:
        events = list_events()
        return {"events": events}
    except Exception as e:
        return {"error": str(e)}
    

class ChatMessage(BaseModel):
    message: str

class TextInput(BaseModel):
    text: str

class FileRequest(BaseModel):
    file_id: str
    mime_type:str

@app.post("/chat")
def chat(body: ChatMessage):
    try:
        response=chat_with_gemini(body.message)
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}
    
@app.post("/summarize")
def summarize(body: TextInput):
    try:
        result = summarize_text(body.text)
        return {"summary": result}
    except Exception as e:
        return {"error": str(e)}

@app.post("/flashcards")
def flashcards(body: TextInput):
    try:
        result = create_flashcards(body.text)
        return {"flashcards": result}
    except Exception as e:
        return {"error": str(e)}
    

@app.post("/drive/summarize")
def summarize_file(body: FileRequest):
    try:
        text = download_drive_file(body.file_id, body.mime_type)
        if not text or len(text.strip()) < 50:
            return {"error": "No se puede acceder a este archivo. Asegúrate de que te pertenece y tiene permisos de descarga."}
        text = text[:10000]
        summary = summarize_text(text)
        return {"summary": summary}
    except Exception as e:
        return {"error": str(e)}

@app.post("/drive/flashcards")
def file_flashcards(body: FileRequest):
    try:
        text = download_drive_file(body.file_id, body.mime_type)
        if not text or len(text.strip()) < 50:
            return {"error": "No se puede acceder a este archivo. Asegúrate de que te pertenece y tiene permisos de descarga."}
        text = text[:10000]
        cards = create_flashcards(text)
        return {"flashcards": cards}
    except Exception as e:
        return {"error": str(e)}
    

@app.get("/classroom/courses")
def get_courses():
    try:
        courses = list_courses()
        return {"courses": courses}
    except Exception as e:
        return {"error": str(e)}
    

@app.get("/classroom/courses/{course_id}/work")
def get_coursework(course_id: str):
    try:
        work = list_coursework(course_id)
        return {"coursework": work}
    except Exception as e:
        return {"error": str(e)}

@app.get("/classroom/courses/{course_id}/announcements")
def get_announcements(course_id: str):
    try:
        announcements = list_announcements(course_id)
        return {"announcements": announcements}
    except Exception as e:
        return {"error": str(e)}