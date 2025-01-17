from PIL import Image
import io
import numpy as np

def preprocess_image(image_data: bytes) -> np.ndarray:
    """
    Preprocess image for model input
    """
    # Open image from bytes
    image = Image.open(io.BytesIO(image_data))
    
    # Resize to standard size
    image = image.resize((224, 224))  # Standard size for many ML models
    
    # Convert to RGB if not already
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Convert to numpy array and normalize
    img_array = np.array(image)
    img_array = img_array / 255.0  # Normalize to [0,1]
    
    return img_array

def is_valid_image(file_content: bytes) -> bool:
    """
    Check if the uploaded file is a valid image
    """
    try:
        Image.open(io.BytesIO(file_content))
        return True
    except:
        return False