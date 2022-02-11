# Software/Computer Engineering Club Website

Back at college with permission from the club, I decided to hack the SCE website. Once I had some notes on my findings I presented them to the club and helped them to find and fix the bugs. From the experience, they gave me an officer position during my last semester where I helped student developers with better coding practices and gave presentations on cybersecurity and AWS. Here are some of the notes I took along the way.


## Enumeration 

This was not a complete "Black-box" test as the source code is available on Github. I was able to view all the API features of the app before creating an account. From this, I discovered several unauthenticated endpoints that could be used maliciously. I will cover these later. Burpsuite was used as an HTTP proxy to help explore and exploit available endpoints. Overall, the site had alot of cool features but, lack of standardized auth middleware that left routes unprotected.

### Core Issues
  - No access control on API routes
  - Lack of authentication


# Vulns


## **User Enumeration**

  **Description**:
   An unauthenticated user can enumerated accounts using /checkIfUserExists. This can be done by making a POST request to the endpoint passing the following JSON body. The response will contain a boolean value alerting if the email is registered or not.

  **Remediation**: Remove route if not in use by the app. If the function is required implement rate-limiting to slow down attacker enumeration.

  **Risk**: Low

   ```json
   {"email":"fizz@test.com"}
   ```
  


## **Email Registration**

  **Description**:

   A user is allowed to login when the email is not verified. 
   
   Additionally, an unverified user could manually verify their email by making a POST  
   /setEmailToVerified. This function does not properly verify the hash in the POST body. This allows any user to register and verify emails that they do not control.
  
  **Risk**: Medium

  **Remediation**: Create a random value to be sent to the user's email. /setEmailToVerified should check this random value and confirm the email.


## **Email takeover**

**Description**: The club email was able to be controlled via /API/Mailer/sendBlastEmail due to a lack of authentication. 

**Risk**: Critical 

**Remediation**: Add authentication and proper role access for this route.

**Testing Process**

1. Make a POST request to /api/Mailer/sendBlastEmail with the following body
```json
{"emailList":["recciver_email@gmail.com"],"subject":"Email Account Take Over","content":"<p>Takeover test!</p>"}
```

![alt text](https://cdn.ruse.tech/imgs/hacking-the-software-engineering-club/emailrequest.png)

![alt text](https://cdn.ruse.tech/imgs/hacking-the-software-engineering-club/email_take_over.png)


## **Creating Events**

**Description**: The affected routes allows any registered user to manage club events via the API. The API does not properly check the role associated with the session token. Making a POST request to /API/event/createEvent with the correct JSON body allows any user to append a new event. Note, the JWT token is passed via the JSON body which is a bit odd. Standard implementations sent the JWT via headers.

**Risk**: Critical

**Effected routes**
- /api/event/deleteEvent
- /api/event/createEvent
- /api/event/editEvent

**Remediation**: Check account privileges. 

**Testing Process**
1. Make a POST request to /API/event/createEvent with the following body

![alt text](https://cdn.ruse.tech/imgs/hacking-the-software-engineering-club/create_event.png)
![alt text](https://cdn.ruse.tech/imgs/hacking-the-software-engineering-club/hack-a-thon.png)



## **Insecure Direct Object Reference**

**Description**: Modify other users' account attributes such as passwords and email. The endpoint uses the user email in the body request to "look-up" the account to modifiy rather than checking the session token. As a result, an authenticated user can modify any other user's account including password.

**Risk**: Critical

**Effected routes**
- /api/user/edit

**Testing Process**:
1. Log in to the user account and click change password.
2. Intercept the request and modify the email specified.
3. Changes will occur to the specified email.

![alt text](https://cdn.ruse.tech/imgs/hacking-the-software-engineering-club/edit_user.png)

## User Enumeration

**Description**: Any authenticated user can use the endpoint to retrieve all users in the database. The API returns various data including the password hash for each user which should never be exposed by the API. These hashes can be downloaded and cracked offline.

**Risk**: Critical

**Remedaiton**: If possible restrict the route to admin users only. If the application allows a listing of all users remove sensitive information from API response such as the password hash.

**Effected routes**
- /api/User/users

**Testing process** 
1. Make a POST to /api/User/users

![alt text](https://cdn.ruse.tech/imgs/hacking-the-software-engineering-club/all_users.png)

## Exposed Password Hashes


**Description**: All user's password hashes are exposed. Hash can be taken offline and cracked. See the image above.  

**Remedaiton**: Remove all password hashes from the response. 

## Privilege Escalation

**Description**: Users can use the /api/User/edit route to modify their access level parameter giving themselves Admin privileges. 

**Testing Process**:
1. Log in to a user account and click change password.
2. Intercept the request and change "accessLevel:3".
3. Submitting the request will change the user account to an admin.

Here I am modifying my accessLevel to Admin.
![alt text](https://cdn.ruse.tech/imgs/hacking-the-software-engineering-club/edit_user.png)

I am now an admin.
![alt text](https://cdn.ruse.tech/imgs/hacking-the-software-engineering-club/admin_area.png)


## Secrets in GitHub


**Description**:
Using truflhog I was able to find some secrets in previous commits. They included MongoDB creds, GCP key, and SSL certs. GCP keys have been changed, the MongoDB still works.

**Risk**: Med

**Testing Process**: 

1. Run TrufffleHog using docker 
```bash
docker run  dxa4481/trufflehog --entropy=false --regex https://github.com/SCE-Development/Core-v4
```
![alt text](https://cdn.ruse.tech/imgs/hacking-the-software-engineering-club/truffle_hog.png)


