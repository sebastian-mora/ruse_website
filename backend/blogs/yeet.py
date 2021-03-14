def yeet(event, context):

    return {
        "statusCode": 200,
        "body": "WELCOME TO THE ADMIN ZONE",
        "headers": {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False
    }
