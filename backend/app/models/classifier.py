from PIL import Image
import numpy as np
import tensorflow as tf
from .model import ClothingModel

class ClothingClassifier:
    def __init__(self, model_path: str = "app/models/clothing_classifier.h5"):
        self.model = ClothingModel(model_path)
        self.classes = ['baju_gelap', 'baju_terang', 'celana_gelap','celana_terang', 'rok_gelap', 'rok_terang']
    
    def preprocess_image(self, image: Image.Image) -> np.ndarray:
        """Preprocess image for model input"""
        image = image.resize((224, 224))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        img_array = np.array(image)
        img_array = img_array / 255.0
        return np.expand_dims(img_array, axis=0)
    
    def predict(self, image: Image.Image):
        """Make prediction on image"""
        processed_img = self.preprocess_image(image)
        
        try:
            predictions = self.model.model.predict(processed_img)
            class_idx = tf.argmax(predictions[0])
            confidence = float(predictions[0][class_idx] * 100)
            
            predicted_class = self.classes[class_idx]
            color, type = predicted_class.split('_')
            
            return {
                "type": type,
                "color": color,
                "confidence": confidence
            }
        except Exception as e:
            print(f"Prediction error: {str(e)}")
            return None