from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow 
import os

load_dotenv()

app=FastAPI(title="Study Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:5174",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SCOPES = [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/calendar.readonly",
]



@app.get("/")
def root():
    return {"status": "Study Agent API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/auth/login")
def login():
    flow=Flow.from_client_secrets_file(
        "credentials.json",
        scopes=SCOPES,
        redirect_uri="http://localhost:8000/auth/callback"
    )
    auth_url, _=flow.authorization_url(prompt="consent")
    return RedirectResponse(auth_url)

@app.get("/auth/callback")
def auth_callback(code: str):
    flow=Flow.from_client_secrets_file(
        "credentials.json",
        scopes=SCOPES,
        redirect_uri="http://localhost:8000/auth/callback"
    )
    flow.fetch_token(code=code)
    credentials=flow.credentials
    with open("token.json", "w") as f:
        f.write(credentials.to_json())
    return RedirectResponse("http://localhost:5174?auth=success")

