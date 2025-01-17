# app/config/model_config.py
from pydantic_settings import BaseSettings

class ModelConfig(BaseSettings):
    MODEL_PATH: str = "app/models/clothing_classifier.h5"
    IMAGE_SIZE: tuple = (224, 224)
    CLASSES: list = ['baju_gelap', 'baju_terang', 'celana_gelap','celana_terang', 'rok_gelap', 'rok_terang']
    
    class Config:
        env_prefix = 'MODEL_'

model_config = ModelConfig()