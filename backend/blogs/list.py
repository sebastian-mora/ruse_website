import json
import os
import boto3 

bucket = os.environ['BUCKET']
blog_metadata_file = os.environ['BLOGMETADATA']

s3 = boto3.client('s3')

def get_blog_metadata(blog_path):
    key = blog_path + '/' + blog_metadata_file
    try:
        obj = s3.get_object(Bucket=bucket, Key=key)
        file_data = obj['Body'].read().decode('utf-8')
        
        return json.loads(file_data)
    except Exception as e:
        return e

def list(event, context):
    blogs = []
    
    try:
        result = s3.list_objects(Bucket=bucket,  Delimiter='/')
        for o in result.get('CommonPrefixes'):
            # remove / from blog slug
            blog_path = o.get('Prefix')[:-1]
            meta = get_blog_metadata(blog_path)
            blogs.append({"path": blog_path, "metadata":meta})
        
        return {
            "statusCode": 200,
            "body": json.dumps(blogs),
            "headers": {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"message":"Failed to load blogs.", "error": str(e)}),
            "headers": {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False
        }
