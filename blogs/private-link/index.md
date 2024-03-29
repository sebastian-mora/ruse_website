---
id: private-link-sharing-internal-services
previewImageUrl: https://cdn.ruse.tech/imgs/private-link/icon.png
datePosted: 1-07-2024
description: Sharing internal AWS applications using AWS Private Link
tags: aws
title: Sharing AWS Internal Services with Private Link
---

As cloud infrastructures expand, so does the complexity to interconnect services across different accounts securely. This challenge is particularly pronounced when dealing with sensitive or proprietary internal services. A conventional approach of exposing services to the public internet can unnecessarily introduce a larger attack surface for an organization.

Private Link Service Endpoints are a solution provided by AWS that allows for the creation of secure, private connections between Virtual Private Clouds (VPCs) without traversing the public internet. When combined with the flexibility and functionality of an Application Load Balancer (ALB), the result is a powerful and secure means of sharing internal services.

This blog will cover the implementation details and architecture primarily using Terraform. This will be less of a step-by-step tutorial on configuration. For exact configuration steps, refer to the AWS [Documentation](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html)

## Why Private Link

As organizations navigate the intricate web of AWS networking, the choice of a secure communication pattern between accounts becomes pivotal. While Virtual Private Network (VPN) connections, Virtual Private Cloud (VPC) Peering, and Transit Gateways for interconnecting AWS environments are common, the Private Link Service Endpoint pattern offers unique advantages.

Unlike VPNs, which often come with the overhead of managing encryption keys and potential latency concerns, Private Link establishes direct, private connections, bypassing the public internet altogether.

Similarly, VPC peering provides a straightforward means of connecting VPCs, but lacks granular control over access and traffic that Private Link afford. Additionally, Transit Gateways may not be the optimal choice for low complexity and external client scenarios.

For external clients, the enhanced security, fine-tuned access controls, and reduced dependency on a centralized gateway offered by the Private Link Service Endpoints make it a suitable and efficient solution.

## Implementation

Service endpoints require either a Network Load Balancer or Gateway Load Balancer to receive service requests from consumers. Taking a look at the diagram we have added a Network Load Balancer in front of our service.

Now that the internal NLB is appended to our existing service we can being configuring the service endpoint to accept connections to our service. The this case our service is a simple Nginx default page accessible over port 80. The accounts on the right side of the diagram represent consumer accounts with established Service endpoint connections. In this configuration no traffic traverses the public internet, the shared traffic is limited to only port 80 of the provider NLB.

![arch.png](https://cdn.ruse.tech/imgs/private-link/Private-Link.png)

In this code, I have created a module that creates the simple Nginx server. The service is provisioned on EC2 with an internal ALB to route the local vpc traffic on port 80. I also abstracted the NLB and Service Endpoint configuration into another module that takes a traditional ALB architecture service as input. However, in practice, I do not recommend this level of abstraction as it makes the module highly opinionated when it comes to configuration. This is to demonstrate the simplicity to set up this configuration without significant re-architecture for existing services.

```terraform
// create a mock service fronted by an internal ALB
module "service" {
  source     = "./service"
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
}

//
module "private-link" {
  source     = "./private-link"
  depends_on = [module.service]

  vpc_id     = module.vpc.vpc_id
  alb_arn    = module.service.alb_arn // alb of the internal service
  subnet_ids = module.vpc.private_subnets

  security_groups = [
    aws_security_group.allow_http_traffic.id
  ]

  allowed_principals = [
    "arn:aws:iam::112233445566:root"
  ]
}
```

Taking a look inside the module for the Private Link Service Endpoint there are two resources created that handle the primary lift of sharing the service.

```terraform

resource "aws_vpc_endpoint_service" "hello_world_service" {
  acceptance_required = true
  network_load_balancer_arns = [
    aws_alb.network.arn
  ]
  tags = {
    Name = "hello-world-service"
  }
}

// loop over allowed principles and created allowed principals
resource "aws_vpc_endpoint_service_allowed_principal" "allow_principals" {
  count                   = length(var.allowed_principals)
  vpc_endpoint_service_id = aws_vpc_endpoint_service.hello_world_service.id
  principal_arn           = var.allowed_principals[count.index]
}

```

The `aws_vpc_endpoint_service` resource configures our VPC service endpoint. Note that I have set acceptance_requests=true. The second block configures the ARNs that allow requesting access to the service endpoint.

Once the resources are built, a service name is outputted for the Service Endpoint. This service name will be shared with clients or internal accounts to identify the internal services and request access from a client perspective.

All the code can be found on [Github](https://github.com/sebastian-mora/private-link-example)

## Access Controls Via Resource Policy

Controlling access to the Private Link service endpoint is essential for ensuring secure and authorized communication. This is achieved through the use of a Resource Policy, providing a powerful means to define and manage access at a granular level. With Resource Policies, you can specify access scopes to AWS accounts or roles. This centralized approach not only enhances security but also offers an auditable management interface for the specific service you intend to share.

Some examples of valid arns are

```text
arn:aws:iam::account_id:root
arn:aws:iam::account_id:role/role_name
arn:aws:iam::account_id:user/user_name
*
```

**WARNING**:

Inputting "\*" will grant everyone permission to access the endpoint service and configure the endpoint service to accept all requests, your load balancer will be public even if it has no public IP address.

Furthermore, the default behavior of the service endpoint requires manual approval for connection requests. This additional mechanism ensures that every connection is scrutinized and approved, contributing to a robust access governance model. By incorporating Resource Policies and connection request approvals, you establish a strong foundation for secure, controlled, and auditable access to your shared services.

## Network Security

When it comes to network security, Private Link service endpoints are intricately tied to specific Network Load Balancers. Leveraging this association, security groups can be configured to allow connections exclusively to the designated service. This level of configuration enables very fine-grained control.

In this case only port 80 is allowed between the Private Link, NLB, and ALB. Consuming clients will only be able to reach the NLB on port 80.

```text
Private Link <--80--> NLB <--80--> ALB <--80--> Target Group
```

## Accessing a Private Service Endpoint

In a consumer account, we can navigate to `Dashboard > Services > Request Service` and input the unique service identifier generated for our application. This action triggers a request to the author's authentication account, and we patiently wait for approval. Once approved, the connection will be established, and the Service Endpoint will become accessible within our Virtual Private Cloud (VPC).

- [Github](https://github.com/sebastian-mora/private-link-example)
