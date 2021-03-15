from requests_toolbelt.multipart import decoder
import re
import boto3
import os
import io


bucket = os.environ['BUCKET']
dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

def deleteMetadata(blogID):
  table = dynamodb.Table('BlogMetadata')
  table.delete_item(Key={'id':blogID})

def deleteS3Blog(id):
  for key in bucket.list(prefix=id + '/'):
    key.delete()

def delete(event, context):

  try:
    body = JSON.parse(event.body)

    deleteS3Blog(body.id)
    deleteMetadata(body.id)

    return {
        'statusCode': 200,
        "headers": {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
        'body': str(metadata)
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
    
