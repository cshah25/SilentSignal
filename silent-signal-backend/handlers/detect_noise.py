import json
import os
from datetime import datetime
from decimal import Decimal

import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def handler(event, context):
    try:
        body = json.loads(event.get('body', '{}'))
        user_id = body.get('userId')
        if not user_id:
            return {
                'statusCode': 400,
                'headers': {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Headers': 'Content-Type'
                },
                'body': json.dumps({'error': 'Missing userId'})
            }

        raw = body.get('decibel', 0)
        decibel = Decimal(str(raw))
        timestamp = datetime.utcnow().isoformat()

        new_entry = {
            'timestamp': timestamp,
            'decibel': decibel
        }

        table.update_item(
            Key={'userId': user_id},
            UpdateExpression="""
              SET readings = list_append(
                if_not_exists(readings, :empty_list),
                :new_entries
              )
            """,
            ExpressionAttributeValues={
                ':empty_list': [],
                ':new_entries': [new_entry]
            }
        )

        return {
            'statusCode': 200,
            'headers': {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({'message': 'Reading logged.'})
        }

    except Exception as e:
        print("Error in detect_noise:", e, flush=True)
        return {
            'statusCode': 500,
            'headers': {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({'error': str(e)})
        }
