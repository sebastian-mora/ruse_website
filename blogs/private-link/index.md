---
id: private-link
previewImageUrl: https://cdn.ruse.tech/assets/ruse-200x200.png
datePosted: 12-27-2023
description: Sharing internal AWS applications using AWS Private Link
tags: aws
title: Securely Sharing AWS Internal Services with Private Link
---

As cloud infrastructures expand, so does the complexity to interconnect services across different accounts securely. This challenge is particularly pronounced when dealing with sensitive or proprietary internal services. The conventional approach of exposing services to the public internet can unnecessarily introduce a larger attack surface for an organization.

Private Link Service Endpoints are a solution provided by AWS that allows for the creation of secure, private connections between Virtual Private Clouds (VPCs) without traversing the public internet. When combined with the flexibility and functionality of an Application Load Balancer (ALB), the result is a powerful and secure means of sharing internal services.

This blog will cover the implementation details and architecture primarily using Terraform, as well as demonstrate the setup. This will be less of a step-by-step tutorial on configuration. For exact configuration steps, refer to the AWS Documentation [LINK].

## Why Private Link

As organizations navigate the intricate web of AWS networking, the choice of a secure communication pattern between accounts becomes pivotal. While Virtual Private Network (VPN) connections, Virtual Private Cloud (VPC), and Transit Gateways for interconnecting AWS environments are common, the Private Link Service Endpoint pattern offers unique advantages. Unlike VPNs, which often come with the overhead of managing encryption keys and potential latency concerns, Private Link establishes direct, private connections, bypassing the public internet altogether.

Similarly, while VPC peering provides a straightforward means of connecting VPCs, it lacks granular control over access and traffic that Private Link affords. In scenarios where security, reduced latency, and precise control over communication are paramount, the Private Link and ALB pattern emerges as an elegant and powerful solution.

It's essential to consider the role of Transit Gateways in this context. While Transit Gateways are beneficial for certain use cases, they may not be the optimal choice for low complexity and external client scenarios. Transit Gateways introduce centralized routing, which may not align with the simplicity required for specific deployments. For external clients, the enhanced security, fine-tuned access controls, and reduced dependency on a centralized gateway offered by the Private Link and ALB pattern make it a more suitable and efficient solution.

This blog will unravel the intricacies of implementing the Private Link and ALB pattern, providing insights into its efficiency and explaining why it stands out in the realm of secure cross-account communication, especially when compared to Transit Gateways in scenarios with low complexity and external clients.

## Implementation

In this code, I have abstracted the NLB and Service Endpoint configuration into a module that takes a traditional ALB architecture service as input. This demonstrates the simplicity to set up this configuration. However, in practice, I do not recommend this level of abstraction as it makes the module highly opinionated when it comes to configuration.

![arch.png](https://cdn.ruse.tech/imgs/private-link/arch.png)

````terraform
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
  alb_arn    = module.service.alb_arn
  subnet_ids = module.vpc.private_subnets

  security_groups = [
    module.vpc.default_security_group_id
  ]

  allowed_principals = [
    "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
  ]
}


Inside the module:

The primary lift comes from only two resources

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

````

The aws_vpc_endpoint_service resource configures our VPC service endpoint. Note that I have set acceptance_requests=true. The second block configures the ARNs that allow requesting access to the service endpoint.

Once the resources are built, a service name is outputted for the Service Endpoint. This service name will be shared with clients or internal accounts to identify the internal services and request access from a client perspective.

## Access Controls Via Resource Policy

Controlling access to the Private Link service endpoint is essential for ensuring secure and authorized communication. This is achieved through the use of a Resource Policy, providing a powerful means to define and manage access at a granular level. With Resource Policies, you can specify access scopes, whether to AWS accounts or roles. This centralized approach not only enhances security but also offers an auditable management interface for the specific service you intend to share.

**WARNING**:

Inputting "\*" will grant everyone permission to access the endpoint service and configure the endpoint service to accept all requests, your load balancer will be public even if it has no public IP address.

Furthermore, the default behavior of requiring approval for connection requests adds an extra layer of control. This additional mechanism ensures that every connection is scrutinized and approved, contributing to a robust access governance model. By incorporating Resource Policies and connection request approvals, you establish a strong foundation for secure, controlled, and auditable access to your shared services.

## Network Security

When it comes to network security, Private Link service endpoints are intricately tied to specific Network Load Balancers. Leveraging this association, security groups can be configured to allow connections exclusively to the designated service. This level of configuration enables very fine-grained control over network shares, especially when onboarding new accounts. By aligning security groups with service endpoints, you create a secure networking environment where access is meticulously controlled, promoting a defense-in-depth strategy for your AWS architecture.

## Access an Private Serbice Endpoint

In a client account, we can navigate to `Dashboard > Services > Request Service` and input the unique service identifier generated for our application. This action triggers a request to the author's authentication account, and we patiently wait for approval. Once approved, the connection will be established, and the Service Endpoint will become accessible within our Virtual Private Cloud (VPC).

The service endpoints, in this case, utilize the XX protocol, allocating private IPs in Availability Zones (AZ). I've configured internal DNS to align with these settings. As a result, from a test service, I can seamlessly query the application hosted in account XYZ from my client account ZYV!

```
   +---------------------+             +---------------------+
   |    Client Account   |             |  Author Authentication|
   |                     |             |         Account       |
   |    +------------+   |             |    +------------+     |
   |    | Dashboard |   | Request     |    |   Approval |     |
   |    |            |-------------------------->|           |
   |    |  Services  |   |   Service   |    |           |     |
   |    |            |<--------------->|    |           |     |
   |    | Request    |   |   Approval  |    |           |     |
   |    +------------+   |             |    +------------+     |
   |                     |             |                       |
   +---------------------+             +-----------------------+
                |                                   |
                v                                   v
         +------------------+          +-----------------------+
         |    Your VPC     |          |   Author's VPC        |
         |                  |          |                       |
         |   +------------+ |          |   +------------+      |
         |   | Internal   | |          |   | Internal   |      |
         |   | DNS Server | |          |   |  Auth App  |      |
         |   +------------+ |          |   +------------+      |
         |                  |          |                       |
         +------------------+          +-----------------------+

```
