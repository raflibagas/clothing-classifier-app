from fastapi import APIRouter, UploadFile, File
from PIL import Image
import io
from ..models.classifier import ClothingClassifier

router = APIRouter()
classifier = ClothingClassifier("app/models/clothing_classifier.h5")

@router.post("/classify")
async def classify_image(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(400, 'File must be an image')

        # Read image file
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))

        prediction = classifier.predict(image)

        return {
            "success": True,
            "prediction": prediction
        }
        
        # For now, return dummy response (we'll add ML model later)
        # return {
        #     "success": True,
        #     "prediction": {
        #         "type": "shirt",  # This will come from ML model later
        #         "color": "dark",
        #         "confidence": 90
        #     }
        # }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }