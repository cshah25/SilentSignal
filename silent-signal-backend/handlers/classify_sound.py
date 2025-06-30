import base64
import os
import tempfile
import json
import numpy as np
import librosa
import joblib

# Dynamically resolve the path to the model file
model_path = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../models/sound_classifier.joblib")
)

# Load model bundle (contains model + label encoder)
model_bundle = joblib.load(model_path)
model = model_bundle["model"]
label_encoder = model_bundle["label_encoder"]

def extract_features(path):
    y, sr = librosa.load(path, sr=None)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)

    # Convert to list of lists
    mfcc_list = mfcc.T.tolist()  # Transpose so we average each coefficient

    # Compute mean of each column manually
    if not mfcc_list:
        return [0.0] * 13  # fallback if empty

    n = len(mfcc_list)
    num_coeffs = len(mfcc_list[0])
    mean_features = []

    for i in range(num_coeffs):
        col_sum = sum(row[i] for row in mfcc_list)
        mean_features.append(col_sum / n)

    return mean_features

def handler(event, context):

    if event.get('httpMethod') == 'OPTIONS':
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            "body": ""
        }

    try:
        body = json.loads(event['body'])
        audio_b64 = body['audio']
        
        # Decode base64 and save to temp file
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
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({ "label": predicted_label })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
            },
            "body": json.dumps({ "error": str(e) })
        }
