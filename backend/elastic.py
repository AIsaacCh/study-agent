from elasticsearch import Elasticsearch
import os
from dotenv import load_dotenv

load_dotenv()

es = Elasticsearch(
    os.getenv("ELASTIC_ENDPOINT"),
    api_key=os.getenv("ELASTIC_API_KEY")
)

INDEX = "study-agent-docs"

def create_index():
    if not es.indices.exists(index=INDEX):
        es.indices.create(index=INDEX, body={
            "mappings": {
                "properties": {
                    "title":     {"type": "text"},
                    "content":   {"type": "text"},
                    "source":    {"type": "keyword"},
                    "file_id":   {"type": "keyword"},
                    "mime_type": {"type": "keyword"},
                    "indexed_at":{"type": "date"},
                }
            }
        })

def index_document(file_id: str, title: str, content: str, source: str, mime_type: str):
    from datetime import datetime, timezone
    create_index()
    es.index(index=INDEX, id=file_id, document={
        "title":      title,
        "content":    content,
        "source":     source,
        "file_id":    file_id,
        "mime_type":  mime_type,
        "indexed_at": datetime.now(timezone.utc).isoformat(),
    })

def search_documents(query: str, size: int = 5):
    create_index()
    results = es.search(index=INDEX, body={
        "query": {
            "multi_match": {
                "query": query,
                "fields": ["title^2", "content"],
                "type": "best_fields",
                "fuzziness": "AUTO"
            }
        },
        "size": size
    })
    hits = results["hits"]["hits"]
    return [
        {
            "title":   h["_source"]["title"],
            "content": h["_source"]["content"][:500],
            "source":  h["_source"]["source"],
            "file_id": h["_source"]["file_id"],
            "score":   h["_score"],
        }
        for h in hits
    ]

def list_indexed():
    create_index()
    results = es.search(index=INDEX, body={
        "query": {"match_all": {}},
        "size": 50,
        "_source": ["title", "source", "indexed_at"]
    })
    return [h["_source"] for h in results["hits"]["hits"]]

def delete_document(file_id: str):
    try:
        es.delete(index=INDEX, id=file_id)
        return True
    except:
        return False
    
    