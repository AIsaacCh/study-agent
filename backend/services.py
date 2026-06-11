from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build 
from googleapiclient.http import MediaIoBaseDownload
from pypdf import PdfReader
import io
import json 
import os 

def get_credentials():
    import os, json, base64
    
    token_b64 = os.getenv("GOOGLE_TOKEN_B64")
    if token_b64:
        token_data = json.loads(base64.b64decode(token_b64).decode("utf-8"))
    elif os.path.exists("token.json"):
        with open("token.json", "r") as f:
            token_data = json.load(f)
    else:
        raise Exception("No Google credentials found")
    
    from google.oauth2.credentials import Credentials
    creds = Credentials(
        token=token_data.get("token"),
        refresh_token=token_data.get("refresh_token"),
        token_uri=token_data.get("token_uri"),
        client_id=token_data.get("client_id"),
        client_secret=token_data.get("client_secret"),
        scopes=token_data.get("scopes"),
    )
    return creds

#-----drive-----

def list_drive_files():
    creds=get_credentials()
    service=build("drive", "v3", credentials=creds)
    results=service.files().list(
        pageSize=20,
        fields="files(id,name, mimeType, modifiedTime)"
    ).execute()
    return results.get("files",[])

#-----gmail-----
def list_email_messages(max_results=10):
    creds = get_credentials()
    service = build("gmail", "v1", credentials=creds)
    results = service.users().messages().list(
        userId="me",
        maxResults=max_results,
        labelIds=["INBOX"]
    ).execute()
    messages = results.get("messages", [])
    emails = []
    for msg in messages:
        detail = service.users().messages().get(
            userId="me",
            id=msg["id"],
            format="metadata",
            metadataHeaders=["Subject", "From", "Date"]
        ).execute()
        headers = {h["name"]: h["value"] for h in detail["payload"]["headers"]}
        emails.append({
            "id": msg["id"],
            "subject": headers.get("Subject", "Sin asunto"),
            "from": headers.get("From", ""),
            "date": headers.get("Date", "")
        })
    return emails
    
#-----calendars-----
def list_events(max_results=10):
    creds = get_credentials()
    service = build("calendar", "v3", credentials=creds)
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc).isoformat()
    results = service.events().list(
        calendarId="primary",
        timeMin=now,
        maxResults=max_results,
        singleEvents=True,
        orderBy="startTime"
    ).execute()
    return results.get("items", [])


def download_drive_file(file_id: str, mime_type: str) -> str:
    creds = get_credentials()
    service = build("drive", "v3", credentials=creds)
    
    try:
        if "google-apps.document" in mime_type:
            request = service.files().export_media(
                fileId=file_id,
                mimeType="text/plain"
            )
            buffer = io.BytesIO()
            downloader = MediaIoBaseDownload(buffer, request)
            done = False
            while not done:
                _, done = downloader.next_chunk()
            buffer.seek(0)
            return buffer.read().decode("utf-8", errors="ignore")

        elif "google-apps.spreadsheet" in mime_type:
            request = service.files().export_media(
                fileId=file_id,
                mimeType="text/csv"
            )
            buffer = io.BytesIO()
            downloader = MediaIoBaseDownload(buffer, request)
            done = False
            while not done:
                _, done = downloader.next_chunk()
            buffer.seek(0)
            return buffer.read().decode("utf-8", errors="ignore")

        elif "google-apps" in mime_type:
            return None

        elif mime_type == "application/pdf":
            request = service.files().get_media(fileId=file_id)
            buffer = io.BytesIO()
            downloader = MediaIoBaseDownload(buffer, request)
            done = False
            while not done:
                _, done = downloader.next_chunk()
            buffer.seek(0)
            reader = PdfReader(buffer)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text if text.strip() else None

        else:
            return None

    except Exception as e:
        error_str = str(e)
        if "cannotDownloadFile" in error_str:
            return None
        return None
    

#----cladssroom----

def list_courses():
    creds = get_credentials()
    service=build("classroom", "v1", credentials=creds)
    results=service.courses().list(
        pageSize=20,
        courseStates=["ACTIVE"]
    ).execute()

    return results.get("courses", [])

def list_coursework(course_id: str):
    creds = get_credentials()
    service = build("classroom", "v1", credentials=creds)
    results = service.courses().courseWork().list(
        courseId=course_id,
        pageSize=20,
        orderBy="dueDate desc"
    ).execute()
    return results.get("courseWork", [])


def list_announcements(course_id: str):
    creds=get_credentials()
    service=build("classroom", "v1", credentials=creds)
    results=service.courses().announcements().list(
        courseId=course_id,
        pageSize=10
    ).execute()
    return results.get("announcements", [])


def create_calendar_event(title: str, date: str, description: str = "", duration_hours: int = 1):
    from datetime import datetime, timedelta, timezone
    creds = get_credentials()
    service = build("calendar", "v3", credentials=creds)

    try:
        # Intenta parsear con hora incluida
        if "T" in date:
            dt = datetime.fromisoformat(date)
        elif "/" in date:
            parts = date.split("/")
            if len(parts[2]) == 4:
                dt = datetime.strptime(date, "%d/%m/%Y")
            else:
                dt = datetime.strptime(date, "%m/%d/%Y")
        else:
            dt = datetime.strptime(date, "%Y-%m-%d")
    except:
        dt = datetime.now(timezone.utc)

    event = {
        "summary": title,
        "description": description,
        "start": {
            "dateTime": dt.strftime("%Y-%m-%dT%H:%M:%S"),
            "timeZone": "America/Mexico_City",
        },
        "end": {
            "dateTime": (dt + timedelta(hours=duration_hours)).strftime("%Y-%m-%dT%H:%M:%S"),
            "timeZone": "America/Mexico_City",
        },
    }

    created = service.events().insert(calendarId="primary", body=event).execute()
    return {
        "success": True,
        "title": created.get("summary"),
        "date": date,
        "link": created.get("htmlLink"),
    }