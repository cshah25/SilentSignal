import json, os
from datetime import datetime
from decimal import Decimal
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def handler(event, context):
    body = json.loads(event.get('body', '{}'))
    user_id = body.get('userId')
    decibel = Decimal(str(body.get('decibel', 0)))
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
            :new_entry_list
          )
        """,
        ExpressionAttributeValues={
            ':empty_list': [],
            ':new_entry_list': [new_entry]
        }
    )

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        },
        'body': json.dumps({'message': 'Reading logged.'})
    }
