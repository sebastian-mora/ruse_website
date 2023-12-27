---
id: private-link
previewImageUrl: https://cdn.ruse.tech/assets/ruse-200x200.png
datePosted: 12-27-2023
description: Sharing internal AWS applications using AWS Private Link
tags: aws
title: Securely Sharing Internal Services Across AWS Accounts with Private Link
---

As cloud infrastructures expand, so does the complexity to interconnect services across different accounts securely. This challenge is particularly pronounced when dealing with sensitive or proprietary internal services. The conventional approach of exposing services to the public internet can unnecessarily introduce a larger attack surface for an organization.

Private Link Service Endpoints are a solution provided by AWS that allows for the creation of secure, private connections between Virtual Private Clouds (VPCs) without traversing the public internet. When combined with the flexibility and functionality of an Application Load Balancer (ALB), the result is a powerful and secure means of sharing internal services.

This blog will cover the implementation details and architecture primarily using Terraform, as well as demonstrate the setup. This will be less of a step-by-step tutorial on configuration. For exact configuration steps, refer to the AWS Documentation [LINK].

## Why Private Link

As organizations navigate the intricate web of AWS networking, the choice of a secure communication pattern between accounts becomes pivotal. While Virtual Private Network (VPN) connections, Virtual Private Cloud (VPC), and Transit Gateways for interconnecting AWS environments, the Private Link Service Endpoint pattern offers some unique advantages. Unlike VPNs, which often come with the overhead of managing encryption keys and potential latency concerns, Private Link establishes direct, private connections, bypassing the public internet altogether.

Similarly, while VPC peering provides a straightforward means of connecting VPCs, it lacks the granular control over access and traffic that Private Link affords. In scenarios where security, reduced latency, and precise control over communication are paramount, the Private Link and ALB pattern emerges as an elegant and powerful solution.

This blog will unravel the intricacies of implementing this pattern, providing insights into its efficiency and why it stands out in the realm of secure cross-account communication.

## Implementation

In this code, I have abstracted the NLB and Service Endpoint configuration into a module that takes a traditional ALB architecture service as input. This demonstrates the simplicity to set up this configuration. However, in practice, I do not recommend this level of abstraction as it makes the module highly opinionated when it comes to configuration.

![image](https://docs.aws.amazon.com/images/vpc/latest/privatelink/images/endpoint-services.png)

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
  alb_arn    = module.service.alb_arn
  subnet_ids = module.vpc.private_subnets

  security_groups = [
    module.vpc.default_security_group_id
  ]

  allowed_principals = [
    "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
  ]
}
```

Insid ethe mduile

The primary lift comes from only two resouces

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

`aws_vpc_endpoint_service` configures our VPC service endpoint. Note that I have set `acceptance_requests=true`. The second block configures the ARNs that allow requesting access to the service endpoint. Inputting "\*" can expose this service publicly, so be careful.

Once the resources are built, a service name is outputted for the Service Endpoint. This service name will be shared with clients or internal accounts to identify the internal services and request access from a client perspective.

## Access Controls Via Resource Policy

Controlling access to the Private Link service endpoint is essential for ensuring secure and authorized communication. This is achieved through the use of a Resource Policy, providing a powerful means to define and manage access at a granular level. With Resource Policies, you can specify access scopes, whether to AWS accounts or roles. This centralized approach not only enhances security but also offers an auditable management interface for the specific service you intend to share.

Furthermore, the default behavior of requiring approval for connection requests adds an extra layer of control. This additional mechanism ensures that every connection is scrutinized and approved, contributing to a robust access governance model. By incorporating Resource Policies and connection request approvals, you establish a strong foundation for secure, controlled, and auditable access to your shared services.

## Network Security

When it comes to network security, Private Link service endpoints are intricately tied to specific Network Load Balancers. Leveraging this association, security groups can be configured to allow connections exclusively to the designated service. This level of configuration enables very fine-grained control over network shares, especially when onboarding new accounts. By aligning security groups with service endpoints, you create a secure networking environment where access is meticulously controlled, promoting a defense-in-depth strategy for your AWS architecture.

## Access an Private Serbice Endpoint

In a client account we can naviatto to D > s> and input the sercie name thatw as generated for our service. This will send a request to the author autohro account and we will wait for approvaal. ONce aprpove dthe conenciton will eb esatbaled athe the Serivce endpoint will become avaible in our VPC.

The service edpoitns in thatsc ase are using XX so privatge IP are allocoated in AZ zone. I setup some intenrla dns to refeecs thens e and from a test services I can quert the sertvie shosting in account XYZ from by client account ZYV!
