# handlers/join_room.py
import os, json
import boto3

rooms = boto3.resource('dynamodb').Table(os.environ['ROOMS_TABLE'])
chime = boto3.client('chime-sdk-meetings', region_name='us-east-1')

CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" }

def handler(event, context):
    room_id = event['pathParameters']['roomId']
    body    = json.loads(event.get('body','{}'))
    pw      = body.get('password','')
    user_id = body.get('userId') or context.aws_request_id

    resp = rooms.get_item(Key={'roomId': room_id})
    item = resp.get('Item', {})
    if not item or item.get('password') != pw:
        return { 'statusCode':403, 'headers':CORS, 'body': json.dumps({'error':'Invalid room or password'}) }

    meeting = item.get('meeting')
    if not meeting or 'MeetingId' not in meeting:
        return { 'statusCode':500, 'headers':CORS, 'body': json.dumps({'error':'Meeting data missing'}) }

    attendee = chime.create_attendee(
      MeetingId      = meeting['MeetingId'],
      ExternalUserId = user_id
    )['Attendee']

    return {
      'statusCode': 200,
      'headers': CORS,
      'body':    json.dumps({ 'meeting': meeting, 'attendee': attendee })
    }
