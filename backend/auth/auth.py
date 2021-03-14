from jose import jwt
import urllib.request
import json


AUTH0_DOMAIN = 'ruse.us.auth0.com'
API_AUDIENCE = 'https://api.ruse.tech'
ALGORITHMS=  'RS256'

def generatePolicy(principalId, effect, methodArn):
    authResponse = {}
    authResponse['principalId'] = principalId
 
    if effect and methodArn:
        policyDocument = {
            'Version': '2012-10-17',
            'Statement': [
                {
                    'Sid': 'FirstStatement',
                    'Action': 'execute-api:Invoke',
                    'Effect': effect,
                    'Resource': methodArn
                }
            ]
        }
 
        authResponse['policyDocument'] = policyDocument
 
    return authResponse


# Disabled loading from url for speed

# jsonurl = urllib.request.urlopen(
#     "https://"+AUTH0_DOMAIN+"/.well-known/jwks.json")
# jwks = json.loads(jsonurl.read())

def handler(event, context):

    # with open('jwks.json') as f:
    #     jwks = json.load(f)

    jsonurl = urllib.request.urlopen(
    "https://"+AUTH0_DOMAIN+"/.well-known/jwks.json")

    jwks = json.loads(jsonurl.read())

    try:
        token = event['authorizationToken']
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}

        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }

        if rsa_key:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                audience=API_AUDIENCE,
                issuer="https://"+AUTH0_DOMAIN+"/"
            )
            return generatePolicy("606202301209",'Allow', event['methodArn'])

    except Exception as e:
        return generatePolicy("606202301209", 'Deny', event['methodArn'])