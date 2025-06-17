import json, os
from datetime import datetime
from decimal import Decimal
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def handler(event, context):
    body = json.loads(event.get('body','{}'))
    user_id = body.get('userId')
    decibel = Decimal(str(body.get('decibel', 0)))
    timestamp = datetime.utcnow().isoformat()

    # Build a “reading” map if you want to store both time & value:
    new_entry = {
        'timestamp': timestamp,
        'decibel': decibel
    }

    # Append to the 'readings' list (or create it if it doesn't exist yet)
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

    # Optionally, you can still return a message or count
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Reading logged.'})
    }
