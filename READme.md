## Objective

Blog storage is going to move from mysql into s3.
mysql will store metadata about blog but blog file (.md) will be stored in s3.


## TODO items 

### API

DONE
* Create s3 folder for .md files
  - have it follow some type of format. Image should be saved with the blogs.

  Folder has been created at /blogs. folder will be uuids from db

DONE
* Update getAllBlogs "blog interface" to return metadata + .md file url
  - This should reudce the size of request by alot

DONE
* Update /blogs
  - Have it return only relevent metadata
DONE 

* Update /create (addBlog method) to add metadata then upload .md file 
  - route needs to take data and convert to file to upload.

DONE 
* Update /delete to remove sql and s3 
  - Chance for desync here

### React 
* Check out blog.js and check if it needs reworked.
* Rework BlogPage.js to rener .md files
  - md file should be request by client from s3
* Rework BlogPage.css for .md files 
* Blog editor change syntax type

