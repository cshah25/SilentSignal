from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from yamnet_predict import predict_audio_class
import tempfile
import base64
import os

app = FastAPI()

# CORS setup (adjust origins if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_methods=["POST"],
    allow_headers=["*"],
)

@app.post("/classify")
async def classify_audio(request: Request):
    try:
        data = await request.json()
        audio_b64 = data.get("audio")

        if not audio_b64:
            return JSONResponse(status_code=400, content={"error": "Missing 'audio' field"})

        # Save base64-decoded .wav to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as f:
            f.write(base64.b64decode(audio_b64))
            temp_path = f.name

        # Run prediction
        result = predict_audio_class(temp_path)
        os.remove(temp_path)

        # Return error or result
        if "error" in result:
            return JSONResponse(status_code=500, content=result)

        return {
            "label": result["label"],
            "confidence": f"{result['confidence'] * 100:.2f}%"  # e.g., "88.19%"
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
