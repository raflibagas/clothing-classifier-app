from tensorflow.keras.models import load_model
import os

class ClothingModel:
    def __init__(self, model_path: str):
        if not model_path.endswith('.h5'):
            raise ValueError("Model file must be in .h5 format")
            
        self.model = self._load_model(model_path)
    
    def _load_model(self, model_path: str):
        try:
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found at {model_path}")
            return load_model(model_path)
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            return None