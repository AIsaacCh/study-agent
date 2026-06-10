from services import list_courses, list_coursework, list_events, list_email_messages
from notion import list_pages, get_page_content
from elastic import search_documents
from datetime import datetime, timezone

def parse_date(date_obj):
    if not date_obj:
        return None
    try:
        if isinstance(date_obj, dict):
            if 'dateTime' in date_obj:
                return datetime.fromisoformat(date_obj['dateTime'].replace('Z', '+00:00'))
            if 'year' in date_obj:
                return datetime(date_obj['year'], date_obj['month'], date_obj['day'], tzinfo=timezone.utc)
        if isinstance(date_obj, str):
            return datetime.fromisoformat(date_obj.replace('Z', '+00:00'))
    except:
        return None
    return None

def format_date(dt):
    if not dt:
        return "Sin fecha"
    return dt.strftime("%d/%m/%Y")

def days_until(dt):
    if not dt:
        return None
    now = datetime.now(timezone.utc)
    delta = dt - now
    return delta.days

def assemble_context(query: str) -> dict:
    context = {
        "query": query,
        "classroom_tasks": [],
        "drive_documents": [],
        "notion_notes": [],
        "calendar_events": [],
        "gmail_mentions": [],
        "relationships": [],
    }

    try:
        elastic_results = search_documents(query, size=5)
        context["drive_documents"] = elastic_results
    except:
        pass

    try:
        courses = list_courses()
        query_lower = query.lower()
        for course in courses:
            course_name = course.get("name", "").lower()
            course_section = course.get("section", "").lower()
            course_subject = course.get("subject", "").lower()
            relevant = any(
                word in course_name or word in course_section or word in course_subject
                for word in query_lower.split() if len(word) > 3
            )
            if relevant or len(query_lower.split()) <= 2:
                try:
                    coursework = list_coursework(course["id"])
                    for work in coursework:
                        due_date = parse_date(work.get("dueDate"))
                        days = days_until(due_date)
                        context["classroom_tasks"].append({
                            "course": course.get("name"),
                            "title": work.get("title"),
                            "description": work.get("description", "")[:200],
                            "due_date": format_date(due_date),
                            "days_remaining": days,
                            "max_points": work.get("maxPoints"),
                            "type": work.get("workType", "ASSIGNMENT"),
                            "link": work.get("alternateLink", ""),
                            "urgency": "urgente" if days and days <= 3 else "próximo" if days and days <= 7 else "pendiente"
                        })
                except:
                    pass
    except:
        pass

    try:
        pages = list_pages()
        query_lower = query.lower()
        for page in pages:
            title = page.get("title", "").lower()
            if any(word in title for word in query_lower.split() if len(word) > 3):
                try:
                    content = get_page_content(page["id"])
                    if content:
                        context["notion_notes"].append({
                            "title": page.get("title"),
                            "content": content[:500],
                            "last_edited": page.get("last_edited_time", ""),
                        })
                except:
                    pass
    except:
        pass

    try:
        events = list_events(max_results=20)
        for event in events:
            start = parse_date(event.get("start"))
            context["calendar_events"].append({
                "title": event.get("summary"),
                "date": format_date(start),
                "days_remaining": days_until(start),
                "description": event.get("description", "")[:200],
            })
    except:
        pass

    try:
        emails = list_email_messages(max_results=10)
        for email in emails:
            context["gmail_mentions"].append({
                "subject": email.get("subject"),
                "from": email.get("from"),
                "date": email.get("date"),
            })
    except:
        pass

    relationships = []
    for task in context["classroom_tasks"]:
        for doc in context["drive_documents"]:
            task_words = set(task["title"].lower().split())
            doc_words = set(doc["title"].lower().split())
            if task_words & doc_words:
                relationships.append(f"La tarea '{task['title']}' puede estar relacionada con '{doc['title']}'")
        for note in context["notion_notes"]:
            task_words = set(task["title"].lower().split())
            note_words = set(note["title"].lower().split())
            if task_words & note_words:
                relationships.append(f"La tarea '{task['title']}' puede estar relacionada con tu nota '{note['title']}'")
    context["relationships"] = relationships[:5]

    return context

def format_context_for_gemini(context: dict) -> str:
    parts = []
    now = datetime.now()
    parts.append(f"CURRENT DATE AND TIME: {now.strftime('%Y-%m-%d %H:%M')} (local server time)")
    parts.append(f"Any date before today is OVERDUE. Reason with this in mind.\n")
    parts.append(f"Student's question: {context.get('query', '')}\n")

    if context["classroom_tasks"]:
        parts.append("CLASSROOM TASKS:")
        for task in context["classroom_tasks"][:5]:
            emoji = "🔴" if task["urgency"] == "urgente" else "🟡" if task["urgency"] == "próximo" else "🟢"
            parts.append(f"{emoji} {task['course']} — {task['title']}")
            if task['days_remaining'] is not None:
                parts.append(f"   Due: {task['due_date']} ({task['days_remaining']} days)")
            else:
                parts.append(f"   Due: {task['due_date']}")
            if task["max_points"]:
                parts.append(f"   Points: {task['max_points']}")
        parts.append("")

    if context["drive_documents"]:
        parts.append("RELATED DRIVE FILES:")
        for doc in context["drive_documents"][:3]:
            parts.append(f"• {doc['title']}: {doc['content'][:200]}")
        parts.append("")

    if context["notion_notes"]:
        parts.append("NOTION NOTES:")
        for note in context["notion_notes"][:2]:
            parts.append(f"• {note['title']}: {note['content'][:200]}")
        parts.append("")

    if context["calendar_events"]:
        parts.append("CALENDAR EVENTS:")
        for event in context["calendar_events"][:10]:
            parts.append(f"• {event['title']} — {event['date']} ({event['days_remaining']} days)")
        parts.append("")

    if context["gmail_mentions"]:
        parts.append("RECENT EMAILS:")
        for email in context["gmail_mentions"][:10]:
            parts.append(f"• {email['subject']} — {email['from']}")
        parts.append("")

    if context["relationships"]:
        parts.append("DETECTED RELATIONSHIPS:")
        for rel in context["relationships"]:
            parts.append(f"• {rel}")
        parts.append("")

    return "\n".join(parts)