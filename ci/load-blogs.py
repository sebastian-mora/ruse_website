import logging
import boto3
from pathlib import Path
import markdown

import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

path = "../blogs"
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ruse-tech-blogs')
md = markdown.Markdown(extensions=['meta'])

def validate_metadata(p, meta_data: dict):
    # print(meta_data)
    required_atts = [ "previewImageUrl", "datePosted", "description", "tags", "title", "id"]
    if not meta_data:
        logger.error(f"{p} does not contain metadata")
        return False
   
    for att in required_atts:
        if att.lower() not in meta_data:
            logger.error(f"{p} is missing attribute {att}")
            return False

    return True

def format_object_for_db(obj):
    """
        Takes an meta data object and converts all single line attributes to strings. 
        For tags it keeps it as a list as expected in the db.
    """
    new_obj = {}

    for k in obj:
        if len(obj[k]) == 1 and k != "tags":
            new_obj[k] = obj[k][0]
        else:
            new_obj[k] = obj[k]

    return new_obj

for p in Path(path).glob('**/*.md'):
    text = p.read_text()
    md.convert(text)
    clean = format_object_for_db(md.Meta)

    if validate_metadata(p, clean):
        res = table.put_item(Item = clean)
        logger.info(f"Saved {p}")
    else:
        logger.info(f"Skipping {p}")