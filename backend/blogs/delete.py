from requests_toolbelt.multipart import decoder
import re
import boto3
import os
import io
import json


BUCKET = os.environ['BUCKET']
dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

def deleteMetadata(blogID):
  table = dynamodb.Table('BlogMetadata')
  table.delete_item(Key={'id':blogID})

def deleteS3Blog(blogID):
  response = s3.list_objects_v2(Bucket=BUCKET, Prefix=blogID + '/')

  if(response.get('Contents')):
    for object in response['Contents']:
        s3.delete_object(Bucket=BUCKET, Key=object['Key'])


def delete(event, context):

  try:
    event_body = json.loads(event['body'])
    blogID = event_body['id']
    deleteS3Blog(blogID)
    deleteMetadata(blogID)

    return {
        'statusCode': 200,
        "headers": {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
        'body': "Deleted "  + str(blogID)
    }
  except Exception as e:
        return {
        'statusCode': 500,
        "headers": {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
        'body': str(e)
    }
    
