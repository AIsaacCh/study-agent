from googleapiclient.discovery import build 
from services import get_credentials


def search_videos(query: str, max_results: int=6):
    creds=get_credentials()
    service=build("youtube", "v3", credentials=creds)


    results=service.search().list(
        q=query,
        part="snippet",
        type="video",
        maxResults=max_results,
        relevanceLanguage="es",
        safeSearch="strict",
        videoEmbeddable="true",

    ).execute()

    videos=[]

    for item in results.get("items", []):
        snippet=item["snippet"]
        videos.append({
            "id": item["id"]["videoId"],
            "title": snippet["title"],
            "description": snippet["description"] [:200],
            "channel": snippet["channelTitle"],
            "published_at": snippet["publishedAt"],
            "thumbnail": snippet["thumbnails"]["medium"]["url"],
            "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
            "embebd_url": f"https://www.youtube.com/embed/{item['id']['videoId']}"
        })
    return videos

def get_video_details(video_id: str):
    creds=get_credentials()
    service=build("youtube", "v3", credentials=creds)

    result= service.videos().list(
        part="snippet,statistics,contentDetails",
        id=video_id
    ).execute()

    if not result.get("items"):
        return None
    
    item=result["items"][0]
    snippet=item["snippet"]
    stats=item.get("statistics", {})

    return {
        "id": video_id,
        "title": snippet["title"],
        "description": snippet["description"][:500],
        "channel": snippet["channelTitle"],
        "published_at": snippet["publishedAt"],
        "thumbnail": snippet["thumbnails"]["medium"]["url"],
        "url": f"https://www.youtube.com/watch?v={video_id}",
        "embebd_url": f"https://www.youtube.com/embed/{video_id}",
        "views": stats.get("viewCount", "0"),
        "likes": stats.get("likeCount", "0"),
        "duration": item["contentDetails"]["duration"]
    }

def search_study_videos(query: str, subject: str=""):
    full_query= f"{query} {subject} explicacion tutorial".strip()
    return search_videos(full_query, max_results=6)





        
