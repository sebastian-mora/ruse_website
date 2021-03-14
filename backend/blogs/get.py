import json
import boto3
import os


client = boto3.client('s3')
bucket = os.environ['BUCKET']
blog_metadata_file = os.environ['BLOGMETADATA']
blog_index_file = os.environ['BLOGINDEX']


def get_blog_content(key):
    key = key + '/' +  blog_index_file
    try:
        obj = client.get_object(Bucket=bucket, Key=key)
        file_data = obj['Body'].read().decode('utf-8')
        
        return file_data
    except Exception as e:
        return False

def get_blog_metadata(key):
    key = key + '/' + blog_metadata_file
    try:
        obj = client.get_object(Bucket=bucket, Key=key)
        file_data = obj['Body'].read().decode('utf-8')
        
        return json.loads(file_data)
    except Exception as e:
        return False


def get(event, context):
    # Get the blog title from request
    try:
        key = event['pathParameters']['title']
        
    except Exception:
        return {
            "statusCode": 403,
            "body": json.dumps({"message":"Blog path not specified."}),
            "headers": {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False
        }

    
    # Load the blog contents from S3
    blog_body = get_blog_content(key)
    blog_metadata = get_blog_metadata(key)
    
    # Load blog meta data
    if blog_body and blog_metadata:
        body  = {
            'blog': blog_body,
            'metadata': blog_metadata
        }
        return {
            "statusCode": 200,
            "body": json.dumps(body),
            "headers": {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False
        }

    else:
        return {
            "statusCode": 404,
            "body": json.dumps({"message":"Blog not Found"}),
            "headers": {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False
        }
