import boto3
from pathlib import Path
import markdown
from os import getenv
import re

import logging
logging.basicConfig(level=logging.INFO)

path = "../blogs"
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(getenv('DB_TABLE'))

md = markdown.Markdown(extensions=['meta'])


def validate_metadata(p, meta_data: dict):
    # print(meta_data)
    required_atts = ["previewImageUrl", "datePosted",
                     "description", "tags", "title", "id"]
    if not meta_data:
        logging.error(f"{p} does not contain metadata")
        return False

    for att in required_atts:
        if att.lower() not in meta_data:
            logging.error(f"{p} is missing attribute {att}")
            return False

    return True


def format_object_for_db(obj):
    """
        Takes an meta data object and converts all single line attributes to strings. 
        For tags it keeps it as a list as expected in the db.
    """
    new_obj = {}

    for k in obj:

        if (k == "id"):  # No need to write id to metadata block
            pass
        if len(obj[k]) == 1 and k != "tags":
            new_obj[k] = obj[k][0]
        else:
            new_obj[k] = obj[k]

    return obj["id"][0], new_obj


def removed_metadata_from_body(text):
    return re.sub("---(.*?)---", "", text, flags=re.S)



for p in Path(path).glob('**/*.md'):
    text = p.read_text()
    md.convert(text)

    body = removed_metadata_from_body(text)

    id, clean_metadata = format_object_for_db(md.Meta)

    if validate_metadata(p, clean_metadata):
        data = {"id": id, "blog": body, "metadata": clean_metadata}
        res = table.put_item(Item=data)
        logging.info(f"Saved {p}")
    else:
        logging.error(f"Invalid metadata {p}")

delete_orphaned_blogs(blog_ids)