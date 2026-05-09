from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
from dotenv import load_dotenv
from services import list_drive_files, list_email_messages, list_events
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