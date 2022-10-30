---
id: a-quick-look-at-pritunl-vpn
previewImageUrl: https://cdn.ruse.tech/assets/ruse-200x200.png
datePosted: 01-31-2021
description: Looking at Pritunl internals in hopes of finding new bugs.
tags: pentesting
title: A Quick Look At Pritunl VPN
---
# Pritunl

A few weeks ago I set up my Pritunl. Overall, I have had a great experience. Very easy to configure and manage compared to other VPN's I have used in the past. 

Pritunl is open-source so I decided to spend a few hours of my Sunday checking out the source code and web instance for vulns. 

## Setup 

The source code can be found on [Github](https://github.com/pritunl/pritunl/tree/master). The build instructions are a bit old and I was unable to get it working from source. I would like to revisit this when I get some more time. There is likely an easy way to create a patch to get all the features but, please buy a license and support the devlopers.  Anyways, here was a start of a Dockerfile to get an instance created. It only kinda works but, it will get the dependencies and the pritunl package installed. No promises from there. 

```docker
FROM ubuntu

RUN apt update -y 

RUN apt -y install gnupg curl systemctl


RUN echo "deb http://repo.pritunl.com/stable/apt focal main" |  tee /etc/apt/sources.list.d/pritunl.list
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" |  tee /etc/apt/sources.list.d/mongodb-org-4.4.list

RUN curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc |  apt-key add - 
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com --recv 9DA31620334BD75D9DCB49F368818C72E52529D4

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com --recv 7AE645C0CF8E292A

RUN apt update 
RUN  apt --assume-yes install pritunl mongodb-server
```

## Source Code

I started first by checking out the source code to see if there was any low hanging fruit I could grab. The app is written using Python using the Django framework. I cloned the source from Github and used the tool bandit to scan the repo. 
```bash
git clone https://github.com/pritunl/pritunl/tree/master
cd pritunl
pip install bandit
python3 bandit -r.
```
Bandit spits out some interesting outputs but, I did not see anything that immediately stood out as "hackable".  You can see the breakdown of the stats here.
 
![alt text](https://cdn.ruse.tech/imgs/a-quick-look-at-pritunl-vpn/bandit.png)

The low alerts mostly point at files in ./pritunl/setup/*. These scripts make calls to subprocess.Popen() during the build phase of Pritunl to run shell commands. There might be ways to perform a command injection on the host but I was not interested in this case. What I am looking for is vulns in that can be exploited remotely. That being said there was an interesting vuln reported by Bandit. 

In the file ./pritunl/pritunl/sso/onelogin.py line 55, response.content is passed directly into the method xml.etree.ElementTree.fromstring. This method is known to be vuln to XML attacks. 

The response object is created from a POST request (line 17-28) to 

`'https://api.%s.onelogin.com' % settings.app.sso_onelogin_region`. 

So maybe the parsing is dangerous but, the response is not coming from a user-controlled area... I do not have the paid version to verify this.

From the code, we can pull out the authentication for each route. Each route is tagged with either 

- @auth.session_light_auth
- @auth.session
- @auth.open_auth

You can check out the implementation of @auth.session_light_auth and @auth.session in `./auth.app.py` but the main difference is that "light_auth" does not require and CSRF token while "session" does. open_auth is as it sounds is an unauthenticated route.

Here is a list of unauthenticated routes I found in the code.

- @app.route('/.well-known/acme-challenge/<token>', methods=['GET'])
- @app.app.route('/auth/session', methods=['POST'])
- @app.app.route('/auth/session', methods=['DELETE'])
- @app.app.route(\'/key/<key_id>.tar', methods=['GET'])
- @app.app.route('/key/<key_id>.zip', methods=['GET'])
- @app.app.route('/key_onc/<key_id>.onc', methods=['GET'])
- @app.app.route('/key_pin/<key_id>', methods=['PUT'])
- @app.app.route('/k/<short_code>', methods=['GET'])
- @app.app.route('/k/<short_code>', methods=['DELETE'])
- @app.app.route('/ku/<short_code>', methods=['GET'])
- @app.app.route('/key/<key_id>/<server_id>.key', methods=['GET'])
- @app.app.route('/key/sync/<org_id>/<user_id>/<server_id>/<key_hash>'),
- @app.app.route('/key/wg/<org_id>/<user_id>/<server_id>', methods=['POST'])
- @app.app.route('/key/wg/<org_id>/<user_id>/<server_id>',
    methods=['PUT'])
- @app.app.route('/link/state', methods=['PUT'])
- @app.app.route('/link/state', methods=['DELETE'])
- @app.app.route('/ping', methods=['GET'])
- @app.app.route('/check', methods=['GET'])
- @app.app.route('/sso/authenticate', methods=['POST'])
- @app.app.route('/sso/request', methods=['GET'])
- @app.app.route('/sso/callback', methods=['GET'])
- @app.app.route('/sso/duo', methods=['POST'])
- @app.app.route('/sso/yubico', methods=['POST'])
- @app.app.route('/key/sync/<org_id>/<user_id>/<server_id>/<key_hash>',

The first thing that jumps out at me is the URLs in /key, /k, /ku that allow the retrieval of VPN profiles. To find how these are used I created a new user and click get download links. In this area, it will show you all the routes above and the associated keys 

![alt text](https://cdn.ruse.tech/imgs/a-quick-look-at-pritunl-vpn/keys-redacted.png)

In the image above the two top links show the keyid and the bottom two show the short_key_id. The link is only good for 24 hrs from creation so good luck brute-forcing them.

So maybe if I can't brute-force them they are not being generated correctly. I also found that in some of these methods that interface with the API random sleep times are inserted to prevent timing attacks. Not really how sure how effective some of these are but, it at least shows the devs were writing these functions with security in mind.

The method for key id generation can be found in `./utils/misc.py`

```python
def rand_str(length):
    s = re.sub(r'[\W_]+', '', base64.b64encode(
        os.urandom(int(length * 1.5))))[:length]
    if len(s) != length:
        return rand_str(length)
    return s
```
It calls os.urandom rather than pythons sudo-random method. To me, this looks like a good implementation so I stopped here and was satisfied.  

The sync route is used by the Pritunl custom client and would be interesting to look into but, again I think it would be protected by the length of random ids. This would be something to revisit, for now, I am moving on.

## Web Client 

Now looking at the web app from an unauthenticated and authenticated perspective.  

I ran dirb just to see what it would pick up, nothing too interesting or anything I did not expect from the previous enumeration. 

I opened up Burp and started to check out some of the requests that were sent while using the app and there was some interesting data returned in responses. To add some context I am using the free version so the only account available for me to log in with the web app is the "admin" account. The rest of this assumes you are logged into the account.

While loading users in the interface the API returns nearly all the information about the user even to the OPT secrets. To me, this is a big NO. I do not see any reason even for the admin to be able to access this information from the interface. Sure resetting the 2fa tokens etc from the app is fine but never expose secrets if you do not have to.  Here is a user object from the response from GET /users

```json
{
  "auth_type": "local",
  "dns_servers": null,
  "pin": false,
  "dns_suffix": null,
  "servers": [
    {
      "status": false,
      "platform": null,
      "server_id": "5ff2b52e7da3a33eb36832a6",
      "virt_address6": "fd00:aaaa:aaaa:0:192:aaaa:221:aaa",
      "virt_address": "192.168.221.5",
      "name": "VPN",
      "real_address": null,
      "connected_since": null,
      "id": "5ff2b52e7dXXXXXXb36832a6",
      "device_name": null
    }
  ],
  "disabled": false,
  "network_links": [],
  "port_forwarding": [],
  "id": "5ff2b4bXXXXXX00475f35",
  "organization_name": "XXXXX",
  "type": "client",
  "email": "",
  "status": false,
  "dns_mapping": null,
  "otp_secret": "JILVJXXXXXRM34JN",
  "client_to_client": false,
  "mac_addresses": null,
  "yubico_id": null,
  "sso": null,
  "bypass_secondary": false,
  "groups": [],
  "audit": false,
  "name": "asd",
  "gravatar": true,
  "otp_auth": false,
  "organization": "5ff2b4bXXXXXX00475f35"
}
```

The next one I was kinda shocked to see. If you click "settings" make any change and observe the response. The API will return every secret in the config. In my version I can not see alot of these settings so I went over to https://demo.pritunl.com/ and the settings area allows configuration of pretty much every secret from the UI. This sense but I am not a fan of the implementation. To me, it seems there should be configured on the server hosting the app. This would prevent a set of stolen credentials completely comprising the underlying AWS accounts, SSO/MFA implementation, even the SSL certificated for the Web UI. Again, I understand this is from an Admin perspective but this seems very dangerous to me. 

I've shorted it by quite a bit for brevity but you can see how much is returned. 

```json

{
  "sso_onelogin_secret": null,
  "oracle_public_key": "-----BEGIN PUBLIC KEY-----\nXXXXXX\n-----END PUBLIC KEY-----",
  "routed_subnet6": null,
  "secret": "XXXXXXXXXXXXX",
  "us_west_1_access_key": null,
  "sso_onelogin_mode": "",
  "pin_mode": "optional",
  "sso_org": null,
  "sso_radius_host": null,
  "sso_onelogin_id": null,
  "username": "pritunl",
  "server_cert": "-----BEGIN CERTIFICATE-----\nXXXXXXXXXX==\n-----END CERTIFICATE-----",
  "otp_secret": null,
  "server_port": 8443,
  "sso_yubico_client": null,
  "us_east_1_access_key": null,
  "us_east_1_secret_key": null,
  "client_reconnect": true,
  "sso": null,
  "server_key": "-----BEGIN EC PRIVATE KEY-----\nXXXXXXXXXX=\n-----END EC PRIVATE KEY-----",
  "sso_client_cache": false,
  "oracle_user_ocid": null,
  "sso_duo_token": null,
  "sso_yubico_secret": null,
  "sso_saml_url": null,
  "token": "wXXXXXXXXXXXXXXXXXXXXXXXXXQ",
  "sso_cache": false,
  "acme_domain": null,
  "otp_auth": null,
  "ca_central_1_access_key": null,
  "us_east_1_access_key": null,
  "reverse_proxy": false,
  "sso_onelogin_app_id": null,
  "ap_south_1_access_key": null,
  "email_password": null,
  "sso_google_key": null,
  "eu_west_3_access_key": null,
  "restrict_import": false,
  "ap_northeast_2_access_key": null,
  "influxdb_uri": null,
  "us_east_1_secret_key": null,
  "sso_saml_cert": null,
  "super_user": true,
  "sso_authzero_domain": null,
  "eu_central_1_secret_key": null,
  "sso_okta_token": null,
  "public_address6": "1.1.1.1",
  "email_from": null,
  "sso_duo_mode": null,
  "sso_azure_directory_id": null,
  "sso_radius_secret": null
}
 
```


## Conclusion

I did not have any findings in this, did I waste your time maybe, did I waste my time also maybe. Anyhow it good exercise to dig into the tools you use often and give them a look over. 

I do not have any major issues with Pritunl other than how they handle the configuration of sensitive secrets via the Web UI as I think it unnecessary increases risk.  You just better hope you have a secure admin password and that there is never an auth bypass otherwise you are screwed. 

I will continue to use Pritunl and I think it is a great service. It's 1 PM now and plan on going to continuing my day. Maybe sometime in the future, I can dig deeper into the implementation of some of the sync function and some other bits of the code. For now I am satisfied.

-Ruse
