from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
from dotenv import load_dotenv
from services import list_drive_files, list_email_messages, list_events, download_drive_file,list_courses,list_coursework,list_announcements, download_drive_file, create_calendar_event
from gemini import chat_with_gemini, summarize_text, create_flashcards, chat_with_context
from notion import list_pages, get_page_content, list_databases
from youtube import search_videos, get_video_details, search_study_videos
from elastic import index_document, search_documents, list_indexed, delete_document
from context_assembler import assemble_context, format_context_for_gemini
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
    "https://www.googleapis.com/auth/calendar",  # ← escritura completa
    "https://www.googleapis.com/auth/classroom.courses.readonly",
    "https://www.googleapis.com/auth/classroom.announcements.readonly",
    "https://www.googleapis.com/auth/classroom.student-submissions.me.readonly",
    "https://www.googleapis.com/auth/youtube.readonly",
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
def gmail_emails(max: int = 10):
    try:
        emails = list_email_messages(max_results=max)
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

class NotionPageRequest(BaseModel):
    page_id:str


class SearchQuery(BaseModel):
    query: str

class IndexRequest(BaseModel):
    file_id: str
    title: str
    mime_type: str

class YoutubeSearchRequest(BaseModel):
    query: str
    subject: str=""


class CalendarEventRequest(BaseModel):
    title: str
    date: str
    description: str = ""
    duration_hours: int = 1



@app.post("/chat")
def chat(body: ChatMessage):
    try:
        # Ensamblar contexto multicontexto
        context = assemble_context(body.message)
        context_text = format_context_for_gemini(context)
        
        # Construir prompt con contexto
        has_context = any([
            context["classroom_tasks"],
            context["drive_documents"],
            context["notion_notes"],
            context["calendar_events"],
            context["gmail_mentions"],
        ])
        
        if has_context:
            from gemini import chat_with_context
            docs = context["drive_documents"]
            response = chat_with_context(body.message, docs, extra_context=context_text)
        else:
            response = chat_with_gemini(body.message)
        
        sources = []
        if context["classroom_tasks"]:
            sources.append(f"Classroom ({len(context['classroom_tasks'])} tareas)")
        if context["drive_documents"]:
            sources += [d["title"] for d in context["drive_documents"]]
        if context["notion_notes"]:
            sources += [n["title"] for n in context["notion_notes"]]
        if context["calendar_events"]:
            sources.append("Calendar")
        if context["gmail_mentions"]:
            sources.append("Gmail")

        return {
            "response": response,
            "sources": sources,
            "context_used": has_context,
        }
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
    
@app.get("/notion/pages")
def notion_pages():
    try:
        pages = list_pages()
        return {"pages": pages}
    except Exception as e:
        return {"error": str(e)}
    
@app.get("/notion/databases")
def notion_databases():
    try:
        databases = list_databases()
        return {"databases": databases}
    except Exception as e:
        return {"error": str(e)}
    

@app.post("/notion/page/content")
def notion_page_content(body:NotionPageRequest):
    try:
        content=get_page_content(body.page_id)
        if not content:
            return {"error": "no se pudo obtener el contenido de la pagina "}
        
        return {"content": content}
    
    except Exception as e:
        return {"error": str(e)}


@app.post("/notion/page/summarize")
def notion_page_summarize(body: NotionPageRequest):
    try:
        content = get_page_content(body.page_id)
        if not content or len(content) < 50:
            return {"error": "La página no tiene suficiente contenido para resumir"}
        summary = summarize_text(content[:10000])
        return {"summary": summary}
    except Exception as e:
        return {"error": str(e)}
    

@app.post("/elastic/index")
def index_file(body: IndexRequest):
    try:

        content=download_drive_file(body.file_id, body.mime_type)
        if not content or len(content.strip())<50:
            return {"error": "No se pudo extraer el conytenido del archivo"}
        


        index_document(
            file_id=body.file_id,
            title=body.title,
            source="google_drive",
            content=content[:50000],
            mime_type=body.mime_type
        )


        return {"Success": True, "message": f"'{body.title}' indexado correctamente"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/elastic/search")
def elastic_search(body: SearchQuery):
    try:
        results = search_documents(query=body.query)
        return {"results": results}
    except Exception as e:
        return {"error": str(e)}
    

@app.get("/elastic/indexed")
def elastic_indexed():
    try:
        docs=list_indexed()
        return {"documents": docs}
    except Exception as e:
        return {"error": str(e)}
    
@app.delete("/elastic/document/{file_id}")
def elastic_delete(file_id: str):
    try:
        succes=delete_document(file_id)
        return {"Success": succes}
    except Exception as e:
        return {"error": str(e)}
    
@app.post("/youtube/search")
def youtube_search (body: YoutubeSearchRequest):
    try:
        videos= search_study_videos(body.query, body.subject)
        return {"videos": videos}
    except Exception as e:
        return {"error": str(e)}
    


@app.get("/youtube/video/{video_id}")
def youtube_video(video_id: str):
    try:
        video = get_video_details(video_id)
        if not video:
            return {"error": "Video no encontrado"}
        return {"video": video}
    except Exception as e:
        return {"error": str(e)}
    


@app.post("/calendar/create")
def create_event(body: CalendarEventRequest):
    try:
        result = create_calendar_event(
            body.title, body.date, body.description, body.duration_hours
        )
        return result
    except Exception as e:
        return {"error": str(e)}