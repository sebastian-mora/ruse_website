# Minecraft Bot

My friends and I like to play Minecraft and we go through waves of playing it frequently and typically self host. So when people are playing at different times we get pings on discord asking to turn the server on and it’s not convenient. So I wanted to build a way for discord users to type a command to turn on a Minecraft server and start playing and I wanted to do this as cheap as possible. 

## Diagram

Here is the design I settled on. At the core of this is a rest API which manages ec2 instances and a few other tasks. In concept pretty basic, but I’ve added a few more features such as billing and status alerts for players

![diagram.jpg](https://cdn.ruse.tech/imgs/aws-minecraft-bot/diagram.jpg)


## Servers

The first step was setting up the EC2s to be controlled by the API. Ideally this would be done with terraform or a tool to codify this process. I chose a M4.Large which is about $0.10 per hour. The EC2s do not have an elastic IPs and are dynamically assigned IPs (elastic ips cost $$ when not in use).

So as a solution when a server starts it posts it IP to the discord chat via SNS. I manually installed the Minecraft sever and setup systemd to start the process on boot. Mcrcon was is also enabled on all servers to allow scripts to interact with them. I tagged the EC2 with "Minecraft:True, Name:Vanilla". This will be used later to assign permissions and allow the lambdas to search for instances managed by the bot.

The server can send alerts such as when it is turning on/off and it's public IP via SNS.

There are two task that run along side with the minecraft process. This is the auto-shutdown functionality and billing. The auto shutdown functionally uses a bash script to query the player count. If the player count is == 0 then the script start the mc shutdown sequence, posts a message to the SNS queue, and finally shuts down the server. This script is executed every 15 mins by a cron job.

The second script manages the billing. I started writing this in bash but then moved to Python because I know how to use it better lol. This script is triggered every 1 min by cron. It gets all usernames on the server then it calculates the cost of the instance per player and updates their bill in a dynamodb table. This table can be view through the mc bot to allow users to see how long they have played for and what cost they have occurred. The price scaling is nice because it gets cheaper per number of players on the server. It is really satisfying to see the mins count up in DynamoDB letting me know the whole system is alive and working. 

I decided to delegate these scripts to the server rather than use lambda functions to check via a VPC using mcrcon because I am already paying to have the ec2 on so might as well save some coin. This does make the server setup slightly more complicated. 

### Server Configuration using Ansible-Pull

By using ansible in a pull configuration we can launch instances with associated ansible roles. Each role can be configured for a specific minecraft server instances for example I am running the following servers

* Vanilla (paper)
* RLCraft
* Skyblock

There is a shared "common" role which configures as the baseline scripts explained above for backup and alerting. Then a server specific role is called via a tag mapping on the instance, this role then will configure the correct server jar and mod files. 

https://github.com/sebastian-mora/mcdiscordbot/tree/main/ansible

### Logging and Alerting 

Logs are delivered to cloudwatch using the cloudwatch agent. The agent pushes the minecraft latest logs as well as detailed server metrics. Having these logs in log groups allows the creation of a cloudwatch dashboard and alerts to be created for events. Here is an example 

![dashboard.jpg](https://cdn.ruse.tech/imgs/aws-minecraft-bot/dashboard.jpg)


## Creating the API

Why an API? Well now I’m thinking about this it could have been done easily client side in the discord bot but it’s more fun to have an expandable system. Plus I can hook this into other bots or a website in the future if I wish.

Lately I’ve been a big fan of the serverless framework. It allows me to write small lambda functions and connect them with a YAML file and automates deployment to the account. I guess I’m on the infrastructure as code hype. Anyways I created a few small lambda functions that handel the following tasks.

* Starting/Stoping servers.
* Getting a server status, description, player count.
* Listing available server and their status.
* Get player billing cost and time.
* Post message to discord (SNS triggered).
* Run mcrcon command on a server.

API keys are used for authentication for the discord bot.

There is not much to write home about functions are fairly simple and use lambda proxy with boto3 to interact with Ec2 and Dynamodb. I might put the code on my github but for now it has internal info about my AWS account that I need to abstract away. 

A note about the last function. I wanted a way for people on the discord assuming they had the correct role run a command as OP on the server. This function uses mcrcon to execute a command over a the network. I originally used lambda in a VPC with a SG connected to limit the connection to the port but this kills boto3 api calls as it restricts internet connection. To get around this you need to pay for a NAT to allow a route out to the internet... I am cheap so no. Rather I opened that port up to the internet and now my lambda goes external to access the rcon port. This is not the best security practice but hey at least it has a strong password.


## Discord client

As I mentioned before I am a big serverless fan boy. There’s a really great service call pylon which allows you to build server discord bots. Basically write the code and it’s hosted by pylon and they manage all the incoming notifications and messages from discord and eexecute your code for you. Using the service I created a simple interface which allows users to interact with the api. This is connected to a specific channel permissions enforced with roles it works really well.

Here are some screenshot of how it is used.

![bill.PNG](https://cdn.ruse.tech/imgs/aws-minecraft-bot/bill.png)

![list.png](https://cdn.ruse.tech/imgs/aws-minecraft-bot/list.png)

![cmd.PNG](https://cdn.ruse.tech/imgs/aws-minecraft-bot/cmd.PNG)

![stop.PNG](https://cdn.ruse.tech/imgs/aws-minecraft-bot/stop.PNG)



## Improvements

I put this together pretty quickly and there’s definitely some areas that can be improved. The first is the code quality of the lambda functions they work OK but they could be better and probably more generalize. The second is the server itself using ec2 to works good but I feel like this could work better using a container service although this would be a lot more expensive so I decided not to go that route.

## Thoughts

Overall I had fun building this and it is rewarding to have some code that other people are using and enjoying. The cost is pretty low but the benefit is that it is pay per hour. So if none plays Minecraft that month the charges should be near zero. Costs are also tracked per player so everyone can pitch in there share at the end of the I really enjoy this bot because it cost near nothing to have yet I can expand it as much as I want. This framework could also be expanded to manage several discord servers. It is an interesting idea but I don't plan on going into minecraft hosting.
