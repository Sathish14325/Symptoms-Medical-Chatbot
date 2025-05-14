
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import base64
import requests
import io
from PIL import Image
from dotenv import load_dotenv
import os
import logging
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_URL = os.getenv("GROQ_API_URL")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

@app.post("/upload_and_query")
async def upload_and_query(image: UploadFile = File(...), query: str = Form(...)):
    try:
        image_content = await image.read()
        if not image_content:
            raise HTTPException(status_code=400, detail="Empty file")

        # Validate image
        try:
            img = Image.open(io.BytesIO(image_content))
            img.verify()
        except Exception as e:
            logger.error(f"Invalid image: {str(e)}")
            raise HTTPException(status_code=400, detail="Invalid image format")

        # Base64 encode image
        encoded_image = base64.b64encode(image_content).decode("utf-8")

        # Create chat message with image and text
        messages = [{
            "role": "user",
            "content": [
                {"type": "text", "text": query},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"}}
            ]
        }]

        # Use only Maverick model
        maverick_model = "meta-llama/llama-4-maverick-17b-128e-instruct"

        response = requests.post(
            GROQ_API_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={"model": maverick_model, "messages": messages, "max_tokens": 1000},
            timeout=30
        )

        if response.status_code == 200:
            content = response.json()["choices"][0]["message"]["content"]
            return JSONResponse(content={"maverick": content}, status_code=200)
        else:
            error_msg = f"Error {response.status_code}: {response.text}"
            logger.error(error_msg)
            return JSONResponse(content={"error": error_msg}, status_code=response.status_code)

    except Exception as e:
        logger.exception("Unexpected server error")
        raise HTTPException(status_code=500, detail="Server error")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("groq_service:app", host="0.0.0.0", port=8001, reload=True)




# Test api
# i don't know , what is it on my head, i've been facing this issues like this past few weeks