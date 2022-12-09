import json
import os
import boto3 

dynamodb = boto3.resource('dynamodb')

headers = {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': '*'
}

def get_blogs():
    table = dynamodb.Table('ruse-tech-blogs')
    response = table.scan()
    data = response['Items']
    # Drop the blog data in the response
    del data['blog']
    
    return data


def list(event, context):
   
    try:
        data = get_blogs()
        return {
            "statusCode": 200,
            "body": json.dumps(data),
            "headers":headers,
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"message":"Failed to load blogs."}),
            "headers": {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False
        }