import json
import boto3
import os

dynamodb = boto3.resource("dynamodb")

headers = {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}

db_table = os.getenv("db_table")


def list_blog_metadata():
    table = dynamodb.Table(db_table)

    projection_expression = "#id, #metadata"
    expression_attribute_names = {
        "#id": "id",
        "#metadata": "metadata"
    }

    response = table.scan(
        ProjectionExpression=projection_expression,
        ExpressionAttributeNames=expression_attribute_names
    )

    items = response.get('Items', [])
    return items


def list(event, context):
    try:
        data = list_blog_metadata()
        return {
            "statusCode": 200,
            "body": json.dumps(data),
            "headers": headers,
            "isBase64Encoded": False,
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "failed to fetch blogs"}),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            "isBase64Encoded": False,
        }
