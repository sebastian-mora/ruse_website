import json
import boto3
import os

headers = {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': '*'
}


client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

bucket = os.environ['BUCKET']
blog_index_file = os.environ['BLOGINDEX']


def get_blog_content(blog_id):
    key =  blog_id + '/' +  blog_index_file
    try:
        obj = client.get_object(Bucket=bucket, Key=key)
        file_data = obj['Body'].read().decode('utf-8')
        
        return file_data
    except Exception as e:
        return e

def get_blog_metadata(blog_id):
    table = dynamodb.Table('BlogMetadata')
    response = table.get_item(Key={
        "id": blog_id
    })
    return response['Item']


def get(event, context):
    # Get the blog title from request
    try:
        blog_id = event['pathParameters']['title']
        
    except Exception:
        return {
            "statusCode": 403,
            "body": json.dumps({"message":"Blog path not specified."}),
            "headers":headers,
            'isBase64Encoded': False
        }

    
    # Load the blog contents from S3
    blog_body = get_blog_content(blog_id)
    blog_metadata = get_blog_metadata(blog_id)
    
    # Load blog meta data
    if blog_body and blog_metadata:
        body  = {
            'blog': blog_body,
            'metadata': blog_metadata
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
