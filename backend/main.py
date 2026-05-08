from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
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

@app.get("/")
def root():
    return {"status": "Study Agent API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

