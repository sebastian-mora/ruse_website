---
id: minecraft-bot
previewImageUrl: https://cdn.ruse.tech/imgs/aws-minecraft-bot/post-logo.png
datePosted: 09-05-2022
description: Minecraft Bot in AWS that is controlled by Discord using highly scalable architecture.
tags: dev
      aws
title: High Availability Discord Minecraft Bot
---
# Minecraft Bot

My friends and I like to play Minecraft and we go through waves of playing it frequently. So when people are playing at different times we get pings on Discord asking to turn the server on and it’s not convenient. So I wanted to build a way for discord users to type a command to turn on a Minecraft server and start playing and I wanted to do this as cheaply as possible. 

## Diagram

Here is the design I settled on. At the core of this is a rest API which manages ec2 instances and a few other tasks. In concept pretty basic, but I’ve added a few more features such as billing and status alerts for players

![diagram.jpg](https://cdn.ruse.tech/imgs/aws-minecraft-bot/diagram.jpg)


## Servers

The first step was setting up the EC2s to be controlled by the API. Ideally, this would be done with Terraform or a tool to codify this process. I chose a M4.Large which is about $0.10 per hour. The EC2s do not have elastic IPs and are dynamically assigned IPs (elastic IPs cost $$ when not in use).

So as a solution when a server starts it posts its IP to the discord chat via SNS. I manually installed the Minecraft server and set up systemd to start the process on boot. Mcrcon is also enabled on all servers to allow scripts to interact with them. I tagged the EC2 with "Minecraft:True, Name:Vanilla". This will be used later to assign permissions and allow the lambdas to search for instances managed by the bot.

The server can send alerts such as when it is turning on/off and its public IP via SNS.

Two tasks run alongside the Minecraft process. This is the auto-shutdown functionality and billing. The auto shutdown functionally uses a bash script to query the player count. If the player count is == 0 then the script starts the mc shutdown sequence, posts a message to the SNS queue, and finally shuts down the server. This script is executed every 15 minutes by a cron job.

The second script manages the billing. I started writing this in bash but then moved to Python because I know how to use it better lol. This script is triggered every 1 minute by cron. It gets all usernames on the server then it calculates the cost of the instance per player and updates their bill in a dynamodb table. This table can be viewed through the mc bot to allow users to see how long they have played and what cost they have incurred. The price scaling is nice because it gets cheaper per number of players on the server. It is satisfying to see the mins count up in DynamoDB letting me know the whole system is alive and working. 

I decided to delegate these scripts to the server rather than use lambda functions to check via a VPC using mcrcon because I am already paying to have the ec2 on so might as well save some coin. This does make the server setup slightly more complicated. 

### Custom EC2 terraform module

I wanna take a second to highlight my EC2 modules because I think it is pretty damn cool. To add a server to the system I just need to append a new block of the following. Take note of  `ansible_host_name     = "vanilla"` this creates a mapping for the ansible-pull to its ansible role. This variable is used to template a user-data script that configures the cronjob for the ansible task. Using this repeatable module it is easy to set up a new server and attach a custom configuration using Ansible. 

```python
module "vanilla" {
  source                = "./modules/ec2"
  name                  = "vanilla"
  ansible_host_name     = "vanilla"
  instance_type         = "m5.large"
  aws_key_pair_name     = aws_key_pair.deployer.key_name
  instance_profile_name = aws_iam_role.minecraft_server_role.name
  subnet_id             = module.vpc.public_subnets[0]
  security_group_ids    = [aws_security_group.mc_sg.id, aws_security_group.allow_ssh_public.id]
}
```

### Server Configuration using Ansible-Pull

By using Ansible in a pull configuration we can launch instances with associated Ansible roles. Each role can be configured for a specific Minecraft server instance for example I am running the following servers

* Vanilla (paper)
* RLCraft
* Skyblock

There is a shared "common" role that configures the baseline scripts explained above for backup and alerting. Then a server-specific role is called via a tag mapping on the instance, this role then will configure the correct server jar and mod files. 

https://github.com/sebastian-mora/mcdiscordbot/tree/main/ansible

### Logging and Alerting 

Logs are delivered to Cloudwatch using the Cloudwatch agent. The agent pushes the Minecraft latest logs as well as detailed server metrics. Having these logs in log groups allows the creation of a Cloudwatch dashboard and alerts to be created for events. Here is an example 

![dashboard.png](https://cdn.ruse.tech/imgs/aws-minecraft-bot/dashboard.png)

Here we can aggregate all the metrics. I can see lambda events, log delivery, live logs of the instances, and below (not shown) instance stats. Instance stats can be tracked via tags so when instances are added or removed the dashboard updates dynamically. 


## Creating the API

Why an API? Well now I’m thinking about this it could have been done easily client side in the discord bot but it’s more fun to have an expandable system. Plus I can hook this into other bots or a website in the future if I wish.

Lately, I’ve been a big fan of the serverless framework. It allows me to write small lambda functions and connect them with a YAML file and automates deployment to the account. I guess I’m on the infrastructure as code hype. Anyway, I created a few small lambda functions that handle the following tasks.

* Starting/Stopping servers.
* Getting a server status, description, and player count.
* Listing available server and their status.
* Get player billing cost and time.
* Post message to discord (SNS triggered).
* Run mcrcon command on a server.

API keys are used for authentication for the discord bot.


## Discord client

As I mentioned before I am a big serverless fan boy. There’s a great service called pylon which allows you to build server discord bots. Write the code and it’s hosted by pylon they manage all the incoming notifications and messages from Discord and execute your code for you. Using the service I created a simple interface that allows users to interact with the API. This is connected to specific channel permissions enforced with roles it works well.

Here are some screenshots of how it is used.

![bill.PNG](https://cdn.ruse.tech/imgs/aws-minecraft-bot/bill.png)

![list.png](https://cdn.ruse.tech/imgs/aws-minecraft-bot/list.png)

![cmd.PNG](https://cdn.ruse.tech/imgs/aws-minecraft-bot/cmd.PNG)

![stop.PNG](https://cdn.ruse.tech/imgs/aws-minecraft-bot/stop.PNG)



## Improvements

I put this together pretty quickly and some areas can be improved. The first is the code quality of the lambda functions they work OK but they could be better and probably more generalized. The second is the server itself using ec2 to work well but I feel like this could work better using a container service although this would be a lot more expensive so I decided not to go that route.

## Thoughts

Overall I had fun building this and it is rewarding to have some code that other people are using and enjoying. The cost is pretty low but the benefit is that it is pay per hour. So if none plays Minecraft that month the charges should be near zero. Costs are also tracked per player so everyone can pitch in their share at the end of the I enjoy this bot because it costs nearly nothing to have yet I can expand it as much as I want. This framework could also be expanded to manage several discord servers. It is an interesting idea but I don't plan on going into Minecraft hosting.
