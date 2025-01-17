from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Clothing Classifier API"
    MODEL_PATH: str = "app/models/model.h5"  # We'll add the model later
    
    class Config:
        case_sensitive = True

settings = Settings()