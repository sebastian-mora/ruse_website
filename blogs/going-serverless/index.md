---
id: going-serverless
previewImageUrl: https://cdn.ruse.tech/assets/ruse-200x200.png
datePosted: 02-13-2021
description: Turns out running and maintaining a full-stack website is a pain and can be expensive. So I deleted many lines of code and moved the site to use a serverless architecture.
tags: dev
title: Going Serverless
---
I ported the website to be cloud-native/serverless in AWS. In the process significantly reducing the codebase, improving security and performance. While all those are great I did it because of cost. I was renting an EC2.small for  $12 /month. On that server, I ran the API for this website and some other small projects.

I built the API so I could manage the content on the site remotely and from an admin area within the site. I started thinking about how to reduce the cost of my simple site. I realized that the whole backend could be stored in a few files in S3 rather than managing a custom API and MySQL instance. 

### The Purge

I hate wasting work but in this instance, I delete a lot of code. Namely, ALL of the nodeJS backend and some of the client react code. It was a good experience to write it all from scratch but a pain in the ass to maintain.

The API was replaced with two lambda functions and an API gateway. More on this later. I was also able to remove large sections of the client such as the admin area, text editor, and all of Redux. 

What I am left with is a super simple API driven by lambda functions that parse content from s3 buckets and a simplified client.

## Moving to S3

Previously a SQL server stored authentication info and metadata about blogs. I was able to remove the need for this using S3.

### Authentication

The website no longer requires authentication. If I wish to manage blogs now push or edit files in an S3 bucket. All changes in that bucket will appear instantly on the site. Authentication is handled through AWS IAM and the bucket is private. This removes the need for any admin area.

### Metadata

The previous website attached metadata to a blog post by creating a row in MySQL. This allowed the blog to have custom slugs, tags, dates, title, and whatever items I wanted. 

The replacement for this was adding a `metadata.json` file to each blog post in S3. Now when the API is called a lambda function can query the S3 bucket for blogs and load their associated metadata files before returning. 

### Bucket Structure

There is a private bucket separate from the bucket hosting the client called "blogs". The blogs bucket has the following structure

```
-blog1
  - index.md
  - metadata.json
-blog2
  - index.md
  - metadata.json
```

To add a new blog to the website, I create a folder with the blog slug and create a file `metadata.json` and `index.md`. Notice that images and other content are not stored in this bucket. While it would be nice to have a /imgs folder in the blogs bucket the URLs required by CloudFront to index the files were not ideal. Cloudfront allows multiple buckets per distribution but they need to be mapped to a specific route such as "/imgs". Here is an example of a URL to access an image if I used the approach mentioned above `http://ruse/tech/imgs/blog1/img/*.jpg`. It works but I was not happy with having /imgs twice in the URL. I might be missing something here so I plan on revisiting it but, for now, I am content with my current solution.

To fix this issue I created a bucket called cdn. Here in the CDN bucket, I put the assets I want to include in the blog. Like this image ...

![devil](https://cdn.ruse.tech/imgs/going-serverless/devil.jpeg)

The cdn bucket structure is as follows. I might change this in the future but it allows accessing content using the URL structure https://cdn.ruse.tech/imgs/blog1/*.png which feels natural.

```
- imgs
  - blog1
    - *.png
```

The bucket is private and content is accessible via a CloudFront distribution. This allows caching of content meaning faster load times.

### Managing the Buckets 

I wrote a quick Bash script to manage by buckets on the fly. Using `./update local` the script syncs both bucket contents to the CWD. Here you can add or modify blogs. Once you are ready you can `./update remote` and local changes will be pushed to the remote buckets. Access keys are required for this.

```bash
#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Illegal number of parameters"
    exit 2
fi

if [ $1 == "local" ]
then
  aws s3 sync s3://blogs ./blogs
  aws s3 sync s3://cdn ./cdn
  echo "Remote --> Local complete."

elif [ $1 == "remote" ]
then
  aws s3 sync ./blogs s3://blogs --delete
  aws s3 sync ./cdn s3://cdn
  echo "local --> remote complete"

else
  echo "Command $1 unknown."
fi

```

## Replacing the API

### API Gateway

I killed the API running on the EC2 and replaced it using API gateway. I was able to reduce the API to two routes 

- /blogs
- /blogs/{slug}

Each API route is attached to a lambda function that processes the incoming request, loads the data, and returns the appropriate response. A plus about using this is that I get sweet logs now I can analyze later.

### Lambda 

Lambda is doing all the lifting for the API gateway. There are two lambda functions "list-blogs" and "get-blog". 

list-blogs loads all blogs and returns their metadata in JSON. In the future, I might add more features to this function like filtering. Here is a snip-it of its core functionality 

```python
result = s3.list_objects(Bucket=bucket,  Delimiter='/')
  for o in result.get('CommonPrefixes'):
    # remove / from blog slug
    blog_path = o.get('Prefix')[:-1]      
    meta = get_blog_metadata(blog_path)
    blogs.append({"path": blog_path, "metadata":meta})
```

get-blogs take a parameter. Again pretty simple here. It finds the requested blog and returns the blog content along with any metadata. Here is a snippet of its core.

```python 
 # Load the blog contents from S3
blog_body = get_blog_content(key)
blog_metadata = get_blog_metadata(key)
    
# Load blog metadata
if blog_body and blog_metadata:
  body  = {
    'blog': blog_body,
    'metadata': blog_metadata
  }
```

## Thoughts

Overall, I am very happy with moving to server-less. It sucks I deleted A LOT of code but it is what it is. My website should perform better in nearly all aspects. Not only will this change save me money but, it should be way more secure and maintainable. I'll update this at the end of next month with how much I saved 

-Ruse