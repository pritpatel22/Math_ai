import cv2
import re
import logging
from django.conf import settings
from google.cloud import vision
from google.cloud.vision_v1 import types
import requests

logger = logging.getLogger(__name__)




def preprocess_image(image_path):
    # Load the image
    image = cv2.imread(image_path)

    # Convert to grayscale and resize
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    resized_image = cv2.resize(gray_image, (640, 480))

    # Apply adaptive thresholding
    adaptive_thresh = cv2.adaptiveThreshold(resized_image, 255,
                                           cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                           cv2.THRESH_BINARY, 11, 2)

    # Denoise
    denoised_image = cv2.fastNlMeansDenoising(adaptive_thresh, None, 30, 7, 21)

    # Save processed image
    processed_image_path = 'processed_image.png'
    cv2.imwrite(processed_image_path, denoised_image)
    return processed_image_path

def postprocess_extracted_text(extracted_text):
    # Further validation: Check for missing operators between numbers and variables
    corrected_text = infer_missing_operators(extracted_text)
    return corrected_text.strip()

def infer_missing_operators(equation):
    # Insert '*' where a number is followed by a variable
    corrected_equation = re.sub(r'(\d)([a-zA-Z])', r'\1 * \2', equation)
    return corrected_equation



def extract_text_from_image_with_google_vision(image_path):
    try:
        client = vision.ImageAnnotatorClient()

        with open(image_path, 'rb') as image_file:
            content = image_file.read()
            image = types.Image(content=content)

        response = client.text_detection(image=image)

        if response.error.message:
            raise Exception(f"Error from Google Vision API: {response.error.message}")

        texts = response.text_annotations
        return texts[0].description if texts else ""

    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}", exc_info=True)
        return ""    
    
    
def get_youtube_links(query_text):
    api_key = settings.YOUTUBE_API_KEY
    api_url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        'part': 'snippet',
        'q': query_text,
        'type': 'video',
        'key': api_key,
        'maxResults': 5
    }

    try:
        response = requests.get(api_url, params=params)
        response.raise_for_status()
        results = response.json()
        video_links = [
            {
                'title': item['snippet']['title'],
                'url': f"https://www.youtube.com/watch?v={item['id']['videoId']}"
            }
            for item in results.get('items', [])
        ]
        return video_links

    except requests.exceptions.RequestException as e:
        logger.error(f"YouTube API request error: {e}", exc_info=True)
        return []
    except ValueError as e:
        logger.error(f"Error decoding JSON response: {e}", exc_info=True)
        return [] 