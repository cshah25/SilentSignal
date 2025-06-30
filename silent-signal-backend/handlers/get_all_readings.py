import json
import boto3
import os

dynamodb = boto3.client("dynamodb")
TABLE_NAME = os.environ["TABLE_NAME"]

def handler(event, context):
    try:
        # 1) full scan
        items = []
        last_key = None
        while True:
            args = {"TableName": TABLE_NAME}
            if last_key:
                args["ExclusiveStartKey"] = last_key
            resp = dynamodb.scan(**args)
            items.extend(resp.get("Items", []))
            last_key = resp.get("LastEvaluatedKey")
            if not last_key:
                break

        # 2) flatten every reading in the `readings` list
        readings = []
        for item in items:
            user_id = item.get("userId", {}).get("S", "")
            # first, handle the list-of-readings case
            for entry in item.get("readings", {}).get("L", []):
                m = entry.get("M", {})
                dec = m.get("decibel", {}).get("N")
                if dec is not None:
                    try:
                        readings.append({
                            "userId": user_id,
                            "decibel": float(dec)
                        })
                    except ValueError:
                        pass

            # fallback: if you ever have a root-level decibel
            root_dec = item.get("decibel", {}).get("N")
            if root_dec is not None:
                try:
                    readings.append({
                        "userId": user_id,
                        "decibel": float(root_dec)
                    })
                except ValueError:
                    pass

        # 3) return them all
        return {
            "statusCode": 200,
            "headers": { "Access-Control-Allow-Origin": "*" },
            "body": json.dumps({ "readings": readings })
        }

    except Exception as e:
        print("Error in /readings/all:", e)
        return {
            "statusCode": 500,
            "body": json.dumps({ "error": str(e) })
        }
