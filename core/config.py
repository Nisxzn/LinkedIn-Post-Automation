import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from utils.logger import logger

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "LinkedIn AI Automation"
    APP_VERSION: str = "3.1.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")
    PORT: int = int(os.getenv("PORT", 8000))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # Auth
    JWT_SECRET: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # LinkedIn
    LINKEDIN_CLIENT_ID: str
    LINKEDIN_CLIENT_SECRET: str
    LINKEDIN_REDIRECT_URI: str
    
    # AI (Ollama)
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"
    
    # AI (OpenAI)
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o-mini"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

def validate_settings():
    """Validates that all required environment variables are present."""
    try:
        settings = Settings()
        logger.info(f"Environment '{settings.ENVIRONMENT}' validated successfully.")
        return settings
    except Exception as e:
        logger.critical(f"Environment validation failed: {e}")
        # In production, we want to fail fast
        raise SystemExit(1)

settings = validate_settings()
