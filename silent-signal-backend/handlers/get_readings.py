import os
import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])

def handler(event, context):
    # 1) Pull userId from query string
    params = event.get("queryStringParameters") or {}
    user_id = params.get("userId")
    if not user_id:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing userId"})
        }

    # 2) Fetch the item
    resp = table.get_item(Key={"userId": user_id})
    item = resp.get("Item")
    if not item:
        return {
            "statusCode": 404,
            "body": json.dumps({"error": "User not found"})
        }

    raw_readings = item.get("readings", [])

    # 3) Convert Decimals to ints (or floats) for JSON serialization
    clean_readings = []
    for entry in raw_readings:
        clean_readings.append({
            "timestamp": entry["timestamp"],
            # entry["decibel"] is a Decimal
            "decibel": int(entry["decibel"])
        })

    # 4) Return the cleaned list
    return {
        "statusCode": 200,
        "body": json.dumps({"readings": clean_readings})
    }
