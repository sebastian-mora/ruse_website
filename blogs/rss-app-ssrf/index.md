I wanted to build an RSS feed for my website so I went looking for a pre-built solution before building my own. I came across https://rss.app which seemed like a very popular choice. 

I navigated to their RSS builder at https://rss.app/rss-feed/rss-builder and put in my website ruse.tech. Of course, because I built ruse.tech in React nothing renders correctly for these types of apps or search engines. Rip SEO.


Then I took a second look at the feature and was just thinking this is just SSRF, It would be funny if I could access AWS metadata through this parsing feature. So I typed in http://169.254.169.254/latest almost as a joke and sure enough, it worked. 

![meta.png](https://cdn.ruse.tech/imgs/rss-app-ssrf/meta.png)

I was pretty shocked it worked. The next thought was can I get some $$$ from a bug bounty program. The answer was no lol. I could not find a program or for a matter of fact any decently way to contact them on the site. So I sent an email to the info@ to see if I could disclose this to someone. I tried DM and even tweeting at this company and after about two weeks they got back to me. Once they did get back they had the issue fixed withing a few hours so props to them.


![info.png](https://cdn.ruse.tech/imgs/rss-app-ssrf/info.png)

Poking around a bit more in the endpoint we can find the account ID, instance type, internal IP, and role name. This was a pretty small instance and it was deployed using LightSail. 


For the real impact, getting the credentials from the instance. I stopped here because I did not have permission to go any farther. 

![cred.png](https://cdn.ruse.tech/imgs/rss-app-ssrf/creds.png)

Long story short SSRF on webapps hosted in AWS can be dangerous. Here are some of my reccomendations in order to prevent compromise of AWS creds. 

1. If the metadata services are not required disable them on the instance.
2. If metadata services are required consider enabling IMDSv2 because it requires a PUT request first to obtain a session token before querying the metadata endpoint.
3. Add blacklist for external users or disable route. 


-Ruse









