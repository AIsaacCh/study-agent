from notion_client import Client
import os
from dotenv import load_dotenv

load_dotenv()

notion = Client(auth=os.getenv("NOTION_TOKEN"))

def list_pages():
    try:
        results = notion.search(
            filter={"property": "object", "value": "page"}
        ).get("results", [])
        pages = []
        for page in results:
            title = ""
            props = page.get("properties", {})
            for prop in props.values():
                if prop.get("type") == "title":
                    title_arr = prop.get("title", [])
                    if title_arr:
                        title = title_arr[0].get("plain_text", "Sin título")
                    break
            if not title:
                title = "Sin título"
            pages.append({
                "id": page["id"],
                "title": title,
                "url": page.get("url", ""),
                "created_time": page.get("created_time", ""),
                "last_edited_time": page.get("last_edited_time", ""),
            })
        return pages
    except Exception as e:
        return []

def get_page_content(page_id: str) -> str:
    try:
        blocks = notion.blocks.children.list(block_id=page_id).get("results", [])
        text = ""
        for block in blocks:
            block_type = block.get("type", "")
            block_data = block.get(block_type, {})
            rich_text = block_data.get("rich_text", [])
            for rt in rich_text:
                text += rt.get("plain_text", "") + " "
            text += "\n"
        return text.strip()
    except Exception as e:
        return ""

def list_databases():
    try:
        results = notion.search(
            filter={"property": "object", "value": "database"}
        ).get("results", [])
        databases = []
        for db in results:
            title_arr = db.get("title", [])
            title = title_arr[0].get("plain_text", "Sin título") if title_arr else "Sin título"
            databases.append({
                "id": db["id"],
                "title": title,
                "url": db.get("url", ""),
                "last_edited_time": db.get("last_edited_time", ""),
            })
        return databases
    except Exception as e:
        return []