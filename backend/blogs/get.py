import json
import boto3
import os

headers = {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': '*'
}

bucket = os.environ['BUCKET']
blog_index_file = os.environ['BLOGINDEX']


def get_blog(blog_id):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('ruse-tech-blogs')
    response = table.get_item(Key={
        "id": blog_id
    })
    return response.get('Item')


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

    blog_data = get_blog(blog_id)
    
    if blog_data:
        return {
            "statusCode": 200,
            "body": json.dumps(blog_data),
            "headers":headers,
            'isBase64Encoded': False
        }
    
    else:
         return {
            "statusCode": 404,
            "body": json.dumps({"message":"Blog not found."}),
            "headers":headers,
            'isBase64Encoded': False
        }

