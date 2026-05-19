---
layout: post
title: "Running Application Containers on AWS: ECS, EKS, or App Runner?"
description: "Confused by AWS's container choices? A complete, DevOps-focused guide comparing Amazon ECS, Amazon EKS, and AWS App Runner to help you choose the right container compute service."
date: 2026-05-20
modified: 2026-05-20
tags: [aws, containers, docker, ecs, eks, app-runner, devops, cloud-architecture, fargate]
image: /assets/img/avatar.jpg
author: Dimas Tri Sasongko
---

# Running Application Containers on AWS: ECS, EKS, or App Runner?

Containers solved the "works on my machine" problem years ago. But the moment you decide to run those containers in production on AWS, you're faced with a different, more paralyzing problem: **choice**.

AWS offers multiple ways to run a single container. You can choose AWS App Runner, Amazon Elastic Container Service (ECS), or Amazon Elastic Kubernetes Service (EKS). On top of that, you have to decide whether to manage the underlying servers (EC2) or go serverless (AWS Fargate).

Most engineering teams struggle here. They either over-engineer by deploying a complex Kubernetes cluster (EKS) for a simple REST API, or they hit architectural limits with a basic setup because they didn't anticipate growth.

Let's break down these three primary options, map their architecture, and establish a clear framework for choosing the right container service for your team.

---

## 1. The Compute Options Explained

### AWS App Runner: The Fast Lane

**Best For:** Simple web applications, APIs, and microservices with minimal configuration.

App Runner is a fully managed service that takes you from a source code repository (GitHub) or a container image (ECR) to a running, publicly accessible, auto-scaling web application in minutes. It handles the load balancer, SSL certificates, auto-scaling, and the container runtime under the hood.

* **Pros:** Zero infrastructure management. Very low operational overhead.
* **Cons:** Limited networking flexibility. No support for background workers or complex multi-container topologies.

---

### Amazon ECS: The AWS-Native Workhorse

**Best For:** Most enterprise workloads that require granular control, tight AWS integration, and high performance without Kubernetes overhead.

Amazon ECS is a highly scalable container orchestration service. It is designed to integrate deeply with the rest of the AWS ecosystem (IAM, Route 53, CloudWatch, Application Load Balancers). It is less complex than Kubernetes but powerful enough to handle highly complex, multi-tier microservices architectures.

* **Pros:** Seamless integration with AWS services; low container startup latency; no control plane fee.
* **Cons:** Native to AWS—meaning it does not offer the vendor-agnostic portability of Kubernetes.

---

### Amazon EKS: The Multi-Cloud Standard

**Best For:** Large-scale, complex microservices architectures that require Kubernetes APIs or multi-cloud portability.

Amazon EKS is a managed Kubernetes service. If your organization is already standardized on Kubernetes, needs to run workloads across multiple cloud providers, or relies on a rich ecosystem of CNCF tools (like Helm, ArgoCD, or Istio), EKS is the gold standard.

* **Pros:** Full Kubernetes API compliance; vendor-agnostic; massive open-source ecosystem.
* **Cons:** High operational complexity; steep learning curve; requires dedicated platform engineering resources.

---

## 2. Serverless Containers: Fargate vs. EC2

If you choose ECS or EKS, you must decide where your container processes actually run:

* **AWS Fargate (Serverless):** You define the CPU and memory requirements, and AWS provisions and manages the underlying servers. You only pay for the resources your containers consume. This is the **operational standard** for most modern workloads.
* **Amazon EC2 (Managed Servers):** You manage a cluster of virtual machines. You are responsible for OS patching, daemon updates, and scaling the server cluster. Choose this only if you have custom OS requirements or highly predictable, steady-state workloads where raw EC2 pricing is cheaper.

---

## 3. Architecture Blueprint: ECS on Fargate

Here is a standard, highly resilient architecture for a web application deployed via Amazon ECS on AWS Fargate:

```
          [ HTTPS Traffic (Internet) ]
                       |
                       v
            +--------------------+
            |   Route 53 / DNS   |
            +--------------------+
                       |
                       v
            +--------------------+
            | AWS WAF (Security) |
            +--------------------+
                       |
                       v
            +--------------------+
            |  Application Load  | (ALB)
            |      Balancer      |
            +--------------------+
             /                  \
            /                    \  (Private Subnets)
           v                      v
  +------------------+  +------------------+
  |  ECS Service     |  |  ECS Service     |
  |  (Task - AZ A)   |  |  (Task - AZ B)   |
  |  [Fargate Task]  |  |  [Fargate Task]  |
  +------------------+  +------------------+
           \                      /
            \                    /
             v                  v
            +--------------------+
            |   Amazon Aurora    | (Database)
            +--------------------+
```

### Flow Explanation:
1. Traffic hits the **Application Load Balancer** which handles SSL termination and routing.
2. The ALB distributes requests across multiple **Fargate Tasks** residing in private subnets across different Availability Zones (for Reliability).
3. **AWS WAF** inspects the incoming requests to block common web application attacks.
4. **ECS** manages the health of the tasks, automatically destroying and replacing any container that fails its health check.

---

## 4. The Decision Matrix

| Dimension | AWS App Runner | Amazon ECS (Fargate) | Amazon EKS (Kubernetes) |
| :--- | :--- | :--- | :--- |
| **Operational Overhead** | Extremely Low | Low to Moderate | High |
| **Setup Speed** | Minutes | Hours | Days to Weeks |
| **Networking & Control**| Basic | Highly Custom | Complete Control |
| **Multi-Container Support**| No (Single container only) | Yes (Task definitions) | Yes (Pods & Services) |
| **Pricing Model** | VCPU / Memory Active | VCPU / Memory Active | Control plane fee ($0.10/hr) + Compute |
| **Portability** | Low (AWS Lock-in) | Moderate (AWS Native) | High (Standard Kubernetes) |

---

## 5. Architectural Checklist: Choosing Your Path

To align with the **AWS Well-Architected Framework**, run this decision checklist before provisioning infrastructure:

* `[ ]` **Do you have a dedicated DevOps/Platform team?**
  * *No:* Start with **App Runner** or **ECS on Fargate**. Avoid EKS; the operational tax of managing Kubernetes without a dedicated team will slow your feature delivery.
* `[ ]` **Are you building a standard REST API or background worker?**
  * *Yes:* **ECS on Fargate** offers the absolute best balance of speed, security, and tight AWS integration.
* `[ ]` **Does your application require hybrid-cloud or multi-cloud deployment?**
  * *Yes:* **EKS** is your only choice. It guarantees that your deployment manifests can run on GCP (GKE), Azure (AKS), or on-prem.
* `[ ]` **Are you trying to optimize costs for irregular/spiky traffic?**
  * *Yes:* Choose **Fargate Serverless** with ECS or App Runner. It scales down to zero (for App Runner) or utilizes ECS auto-scaling to ensure you don't pay for idle CPU capacity.

## Conclusion

Choosing a container host on AWS is not about picking the most "popular" technology. It's about matching the system's needs with your team's operational capacity. 

For 80% of teams building application backends on AWS, **Amazon ECS with AWS Fargate** represents the sweet spot of high capability, tight security, and low operational friction. Start there, define your architecture as code, and only migrate upstream to EKS if your service topology specifically demands it.

*What is your team currently running? Let me know in the comments, or check out my other guides on AWS Cloud Security and S3 Hosting!*
