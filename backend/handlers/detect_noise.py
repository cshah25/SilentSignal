import json
import boto3
import os
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def handler(event, context):
    try:
        data = json.loads(event['body'])
        user_id = data.get("userId")
        decibel = float(data.get("decibel", 0))
        timestamp = datetime.utcnow().isoformat()

        result = {
            "userId": user_id,
            "timestamp": timestamp,
            "decibel": decibel,
            "triggered": False
        }

        if decibel > 70:
            result["triggered"] = True
            message = "Noise threshold exceeded."
        else:
            message = "Noise level acceptable."

        table.put_item(Item=result)

        return {
            "statusCode": 200,
            "body": json.dumps({"message": message})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
