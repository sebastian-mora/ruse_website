import json
import boto3

headers = {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': '*'
}


def get_public_assets():
  
  files_urls = []
  s3_client = boto3.client('s3')

  response = s3_client.list_objects_v2(Bucket='cdn.ruse.tech', Prefix='assets/', Delimiter = '/')

  for k in response['Contents']:
    files_urls.append(f"https://cdn.ruse.tech/{k['Key']}")
  
  return files_urls


def listAssets(event, context):
    # Get the blog title from request

    try:
      urls = get_public_assets()

    except Exception:
        return {
            "statusCode": 403,
            "body": json.dumps({"message":"Failed to get public assets."}),
            "headers":headers,
            'isBase64Encoded': False
        }
    
    # Load blog meta data
    if urls:
        body  = {
            'assets': urls
        }
        return {
            "statusCode": 200,
            "body": json.dumps(body),
            "headers":headers,
            'isBase64Encoded': False
        }

    else:
        return {
            "statusCode": 404,
            "body": json.dumps({"message":"Blog not Found"}),
            "headers": headers,
            'isBase64Encoded': False
        }
