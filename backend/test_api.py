import requests

def test_classify_endpoint():
    # URL of your classify endpoint
    url = "http://localhost:8000/api/v1/classify"
    
    # Open a test image file
    with open("test_image.jpg", "rb") as image_file:
        # Create files parameter for the POST request
        files = {"file": ("test_image.jpg", image_file, "image/jpeg")}
        
        # Send POST request
        response = requests.post(url, files=files)
        
        # Print results
        print("Status Code:", response.status_code)
        print("Response:", response.json())

if __name__ == "__main__":
    test_classify_endpoint()