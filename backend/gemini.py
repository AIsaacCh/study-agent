import google.generativeai as genai
import os
from dotenv import load_dotenv
import requests as http_requests

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel(
    model_name="gemini-3-flash-preview",
    system_instruction="""
    Eres un asistente de estudio inteligente llamado Study Agent.
    Ayudas a estudiantes con sus tareas, archivos, calendario y materias.
    Responde siempre en el mismo idioma que use el estudiante.
    Si el estudiante escribe en español, responde en español.
    Si escribe en inglés, responde en inglés.
    NO te presentes en cada mensaje — solo responde lo que se te pregunta.
    Si es el primer mensaje y el usuario te saluda, preséntate brevemente.
    """
)

chat_session = model.start_chat(history=[])

def chat_with_gemini(message: str) -> str:
    try:
        response = chat_session.send_message(message)
        return response.text
    except Exception as e:
        return f"Error al conectar con Gemini: {str(e)}"

def summarize_text(text: str) -> str:
    prompt = f"""
    Resume el siguiente texto de forma clara y estructurada.
    Incluye los puntos más importantes en bullet points.
    Texto: {text}
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error al resumir: {str(e)}"

def create_flashcards(text: str) -> str:
    prompt = f"""
    Crea 5 fichas de estudio basadas en el siguiente texto.
    Formato:
    PREGUNTA: [pregunta]
    RESPUESTA: [respuesta]
    ---
    Texto: {text}
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error al crear fichas: {str(e)}"
    


    

def chat_with_context(message: str, context_docs: list, extra_context: str = "") -> str:
    try:
        
        calendar_result = handle_calendar_intent(message)
        if calendar_result and calendar_result.get("created"):
            confirmation_prompt = f"El evento '{calendar_result['title']}' fue creado exitosamente en el calendario para el {calendar_result['date']}. Confirma al usuario de forma natural y breve."
            response = model.generate_content(confirmation_prompt)
            return response.text

        prompt = f"""{extra_context}

Basándote en toda la información anterior, responde la pregunta del estudiante de forma clara y útil.
Si hay tareas urgentes, menciónalas primero. Usa fechas concretas cuando las tengas.
Responde en español de forma natural.

Pregunta: {message}"""
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error al conectar con Gemini: {str(e)}"
    


def handle_calendar_intent(message: str) -> dict | None:
    # Primero detectar intención con Gemini
    intent_prompt = f"""Analiza este mensaje y determina si el usuario quiere crear/agregar un evento o recordatorio en su calendario.
Responde SOLO con "SI" o "NO".
Mensaje: {message}"""
    
    try:
        intent_response = model.generate_content(intent_prompt)
        intent = intent_response.text.strip().upper()
        if "SI" not in intent and "SÍ" not in intent:
            return None
    except:
        return None

    # Extraer datos del evento
    prompt = f"""Extrae los datos de este evento de calendario.
Responde ÚNICAMENTE con JSON válido, sin explicaciones, sin backticks.
Formato: {{"title": "título", "date": "YYYY-MM-DD", "time": "HH:MM", "description": ""}}
Fecha de hoy: {__import__('datetime').datetime.now().strftime('%Y-%m-%d')}
Si hay hora específica inclúyela, si no usa "09:00".
Mensaje: {message}"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip().replace("```json","").replace("```","").replace("`","").strip()
        import json
        data = json.loads(text)

        # Combinar fecha y hora
        date_str = data.get("date", __import__('datetime').datetime.now().strftime('%Y-%m-%d'))
        time_str = data.get("time", "09:00")
        datetime_str = f"{date_str}T{time_str}:00"

        from services import create_calendar_event
        result = create_calendar_event(
            title=data.get("title", "Evento"),
            date=datetime_str,
            description=data.get("description", "")
        )
        if result.get("success"):
            return {"created": True, "title": result["title"], "date": date_str}
    except Exception as e:
        print(f"ERROR: {e}")
    return None 