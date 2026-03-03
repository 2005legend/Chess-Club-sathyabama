import spacy
import dateparser
from datetime import datetime, timedelta
from typing import List, Dict, Any
import re
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Load spaCy model (you'll need to download this: python -m spacy download en_core_web_sm)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    logger.warning("spaCy model not found. Install with: python -m spacy download en_core_web_sm")
    nlp = None

def extract_tasks_from_text(text: str) -> List[Dict[str, Any]]:
    """
    Extract tasks and deadlines from text using NLP
    
    Args:
        text: Input text to extract tasks from
        
    Returns:
        List of dictionaries with 'description' and 'deadline' keys
    """
    if not nlp:
        logger.error("spaCy model not available")
        return []
    
    try:
        # Process text with spaCy
        doc = nlp(text.lower())
        
        # Extract potential task descriptions
        tasks = []
        
        # Look for action verbs and their objects
        for token in doc:
            if token.pos_ == "VERB" and token.dep_ == "ROOT":
                # Find the verb phrase
                verb_phrase = extract_verb_phrase(doc, token)
                
                # Look for date/time information
                deadline = extract_deadline(doc, token)
                
                if verb_phrase and deadline:
                    tasks.append({
                        "description": verb_phrase.capitalize(),
                        "deadline": deadline
                    })
        
        # If no tasks found with NLP, try pattern matching
        if not tasks:
            tasks = extract_tasks_with_patterns(text)
        
        logger.info(f"Extracted {len(tasks)} tasks from text")
        return tasks
        
    except Exception as e:
        logger.error(f"Error extracting tasks from text: {str(e)}")
        return extract_tasks_with_patterns(text)

def extract_verb_phrase(doc, verb_token) -> str:
    """Extract the complete verb phrase for a task"""
    phrase_parts = []
    
    # Add the verb
    phrase_parts.append(verb_token.text)
    
    # Add direct object
    for child in verb_token.children:
        if child.dep_ in ["dobj", "pobj"]:
            phrase_parts.append(child.text)
            
            # Add adjectives and other modifiers
            for modifier in child.children:
                if modifier.dep_ in ["amod", "compound"]:
                    phrase_parts.insert(-1, modifier.text)
    
    # Add other important modifiers
    for child in verb_token.children:
        if child.dep_ in ["advmod", "prep"] and child.text not in phrase_parts:
            phrase_parts.append(child.text)
            
            # Add prepositional object
            if child.dep_ == "prep":
                for prep_child in child.children:
                    if prep_child.dep_ in ["pobj"]:
                        phrase_parts.append(prep_child.text)
    
    return " ".join(phrase_parts)

def extract_deadline(doc, verb_token) -> datetime:
    """Extract deadline from text using dateparser"""
    try:
        # Look for date/time entities
        for ent in doc.ents:
            if ent.label_ in ["DATE", "TIME"]:
                parsed_date = dateparser.parse(ent.text)
                if parsed_date:
                    return parsed_date
        
        # Look for relative dates
        relative_patterns = [
            r"(\d+)\s+(day|days|week|weeks|month|months)\s+(from now|later|ahead)",
            r"(tomorrow|next week|next month|next year)",
            r"(in\s+\d+\s+(day|days|week|weeks|month|months))",
            r"(by\s+(tomorrow|next week|next month|next year))"
        ]
        
        text = doc.text
        for pattern in relative_patterns:
            match = re.search(pattern, text)
            if match:
                parsed_date = dateparser.parse(match.group(0))
                if parsed_date:
                    return parsed_date
        
        # Default: set deadline to tomorrow
        return datetime.now() + timedelta(days=1)
        
    except Exception as e:
        logger.warning(f"Error parsing deadline: {str(e)}")
        return datetime.now() + timedelta(days=1)

def extract_tasks_with_patterns(text: str) -> List[Dict[str, Any]]:
    """Fallback task extraction using regex patterns"""
    tasks = []
    
    # Common task patterns
    task_patterns = [
        r"(?:need to|have to|must|should)\s+([^.!?]+)",
        r"(?:task|todo|action item):\s*([^.!?]+)",
        r"(?:remember to|don't forget to)\s+([^.!?]+)",
        r"(?:plan to|going to)\s+([^.!?]+)"
    ]
    
    # Date patterns
    date_patterns = [
        r"(?:by|on|at|before|after)\s+([^.!?]+)",
        r"(?:tomorrow|next week|next month|next year)",
        r"(?:in\s+\d+\s+(?:day|days|week|weeks|month|months))",
        r"(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
        r"(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)"
    ]
    
    text_lower = text.lower()
    
    for pattern in task_patterns:
        matches = re.finditer(pattern, text_lower)
        for match in matches:
            task_desc = match.group(1).strip()
            
            # Look for deadline in the same sentence
            sentence = extract_sentence_containing(text, match.start())
            deadline = extract_deadline_from_sentence(sentence, date_patterns)
            
            if task_desc and deadline:
                tasks.append({
                    "description": task_desc.capitalize(),
                    "deadline": deadline
                })
    
    return tasks

def extract_sentence_containing(text: str, position: int) -> str:
    """Extract the sentence containing a given position"""
    # Find sentence boundaries
    start = position
    end = position
    
    # Look for sentence start
    while start > 0 and text[start-1] not in ".!?\n":
        start -= 1
    
    # Look for sentence end
    while end < len(text) and text[end] not in ".!?\n":
        end += 1
    
    return text[start:end].strip()

def extract_deadline_from_sentence(sentence: str, date_patterns: List[str]) -> datetime:
    """Extract deadline from a sentence using date patterns"""
    try:
        for pattern in date_patterns:
            match = re.search(pattern, sentence)
            if match:
                parsed_date = dateparser.parse(match.group(0))
                if parsed_date:
                    return parsed_date
        
        # Default: tomorrow
        return datetime.now() + timedelta(days=1)
        
    except Exception as e:
        logger.warning(f"Error parsing deadline from sentence: {str(e)}")
        return datetime.now() + timedelta(days=1)

async def extract_tasks_from_audio(audio_file) -> str:
    """
    Extract text from audio using OpenAI Whisper
    
    Args:
        audio_file: Uploaded audio file
        
    Returns:
        Transcribed text
    """
    try:
        # This is a placeholder - you'll need to implement actual Whisper integration
        # For now, return a sample text
        logger.info("Audio transcription not implemented yet - using placeholder")
        return "Sample transcribed text from audio. Need to implement Whisper integration."
        
        # TODO: Implement actual Whisper integration
        # import openai
        # client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        # 
        # with open(audio_file.filename, "rb") as audio:
        #     transcript = client.audio.transcriptions.create(
        #         model="whisper-1",
        #         file=audio
        #     )
        # 
        # return transcript.text
        
    except Exception as e:
        logger.error(f"Error transcribing audio: {str(e)}")
        raise Exception(f"Failed to transcribe audio: {str(e)}")
