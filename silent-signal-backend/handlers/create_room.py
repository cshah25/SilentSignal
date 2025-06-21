# handlers/create_room.py
import os, json, uuid, secrets
import boto3

rooms = boto3.resource('dynamodb').Table(os.environ['ROOMS_TABLE'])
chime = boto3.client('chime-sdk-meetings', region_name='us-east-1')

CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
}

def handler(event, context):
    try:
        room_id  = str(uuid.uuid4())[:8]
        password = secrets.token_urlsafe(6)

        # create_meeting must come from the chime-sdk-meetings client
        meeting = chime.create_meeting(
            ClientRequestToken = context.aws_request_id,
            MediaRegion        = 'us-east-1',
            ExternalMeetingId  = room_id
        )['Meeting']

        # store the *entire* Meeting object
        rooms.put_item(Item={
            'roomId':   room_id,
            'password': password,
            'meeting':  meeting
        })

        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({
                'roomId':   room_id,
                'password': password,
                'meeting':  meeting
            })
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers':   CORS,
            'body':      json.dumps({'error': str(e)})
        }
