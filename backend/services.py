from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build 
import json 
import os 

def get_credentials():
    if not os.path.exists("token.json"):
        return None
    with open("token.json", "r") as f:
        token_data=json.load(f)
    creds=Credentials(
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
    creds=get_credentials()
    service=build("gmail","v1",credentials=creds)
    results=service.users().messages().list(
        userId="me",
        maxResults=max_results,
        labelIds=["INBOX"]
    ).execute()

    messages=results.get("messages", [])
    emails=[]
    for msg in messages:
        detail=service.users().messages().get(
            userId="me",
            id=msg["id"],
            format="metadata",
            metadataHeaders=["Subject", "From", "Date"]
        ).execute()
        headers={h["name"]: h["value"] for h in detail["payload"]["headers"]}
        emails.append({
            "id": msg["id"],
            "subject":headers.get("Subject", "Sin asunto"),
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
