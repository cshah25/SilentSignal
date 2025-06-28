import base64
import os
import tempfile
import json
import numpy as np
import librosa
import joblib

model_bundle = joblib.load("/opt/models/sound_classifier.joblib")
model = model_bundle["model"]
label_encoder = model_bundle["label_encoder"]

def extract_features(path):
    y, sr = librosa.load(path, sr=None)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    return np.mean(mfcc.T, axis=0)

def handler(event, context):
    try:
        body = json.loads(event['body'])
        audio_b64 = body['audio']
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as f:
            f.write(base64.b64decode(audio_b64))
            temp_path = f.name

        features = extract_features(temp_path)
        prediction = model.predict([features])[0]
        predicted_label = label_encoder.inverse_transform([prediction])[0]

        os.remove(temp_path)

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            "body": json.dumps({ "label": predicted_label })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            "body": json.dumps({ "error": str(e) })
        }
