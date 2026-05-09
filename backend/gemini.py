import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    system_instruction="""
    Eres un asistente de estudio inteligente llamado Study Agent.
    Ayudas a estudiantes a:
    - Resumir documentos y apuntes
    - Crear fichas de estudio (flashcards)
    - Organizar su agenda de estudio
    - Responder preguntas sobre sus materias
    - Crear planes de estudio personalizados
    Responde siempre en español, de forma clara y estructurada.
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