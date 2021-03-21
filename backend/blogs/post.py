from requests_toolbelt.multipart import decoder
import re
import boto3
import os
import io


bucket = os.environ['BUCKET']
dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

def parseFormName(partHeaders):
    name = re.findall(r'name=\"(.*?)\"', str(partHeaders))
    if len(name) > 0:
      return name[0]
    return "None"

def addMetadatatoDB(metadata):
  metadata['id'] = metadata['title'].replace(" ", "-")
  table = dynamodb.Table('BlogMetadata')
  table.put_item(Item=metadata)

def uploadFileToS3(blogData, title):
  key = title + '/index.md'
  fo = io.BytesIO(bytes(blogData, 'utf-8'))
  s3.upload_fileobj(fo, bucket , key)

def post(event, context):

  try:

    content_type_header = event['headers']['content-type']
    body = event["body"].encode()
    metadata = {}
    blogData = ""

    for part in decoder.MultipartDecoder(body, content_type_header).parts:
      if part.headers.get(b'Content-Disposition'):
        name = parseFormName(part.headers[b'Content-Disposition'])
        if name == 'file':
          blogData = part.text
        else:
          metadata[name] = str(part.text)
    
    addMetadatatoDB(metadata)
    uploadFileToS3(blogData, metadata['title'])

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
    
