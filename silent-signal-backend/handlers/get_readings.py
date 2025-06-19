import os
import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])

def handler(event, context):
    params = event.get("queryStringParameters") or {}
    user_id = params.get("userId")
    if not user_id:
        return {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Missing userId"})
        }


    resp = table.get_item(Key={"userId": user_id})
    item = resp.get("Item")
    if not item:
        return {
            "statusCode": 200,
            "headers": {
             "Access-Control-Allow-Origin": "*",
             "Access-Control-Allow-Headers": "Content-Type"
           },
           "body": json.dumps({"readings": []})
       }

    raw_readings = item.get("readings", [])

    clean_readings = []
    for entry in raw_readings:
        clean_readings.append({
            "timestamp": entry["timestamp"],
            # entry["decibel"] is a Decimal
            "decibel": int(entry["decibel"])
        })

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        "body": json.dumps({"readings": clean_readings})
    }
