# Using Kaniko To Build And Push Images To ECR AWS From Gitlab Ci

In this guide, we will walk through the steps of using Kaniko to build and push Docker images to AWS Elastic Container Registry (ECR) from GitLab CI. Kaniko is a tool that allows building Docker images without requiring a Docker daemon, which makes it perfect for building images in a CI/CD pipeline. We will also set up an AWS ECR repository and push the built image to it.

### Prerequisites

Before we begin, make sure you have the following:

- A GitLab account with admin access to the repository
- An AWS account with admin access to ECR

### Step 1: Setting up AWS ECR

First, let's create an ECR repository to store our Docker images.

1. Navigate to the AWS Management Console and search for "ECR" in the search bar.
2. Click "Create repository" to create a new repository. Give it a name and leave the other settings as default.
3. Once the repository is created, click on it to view its details. Make a note of the repository URI, as we will need it later.

### Step 2: Configuring GitLab CI

Next, we need to add the necessary configuration to our GitLab CI file to build and push the Docker image to ECR using Kaniko.

1. Create a `.gitlab-ci.yml` file in the root of your repository.
2. Add the following code to the file:

```
image: gcr.io/kaniko-project/executor:latest

variables:
  DOCKER_REGISTRY: <your-aws-account-id>.dkr.ecr.<your-region>.amazonaws.com
  IMAGE_NAME: <your-ecr-repository-name>
  IMAGE_TAG: $CI_COMMIT_SHA

before_script:
  - echo "{\\"auths\\":{\\"$DOCKER_REGISTRY\\":{\\"auth\\":\\"$(echo -n $AWS_ACCESS_KEY_ID:$AWS_SECRET_ACCESS_KEY | base64)\\"}}}" > /kaniko/.docker/config.json
  - echo "{\\"credHelpers\\":{\\"$DOCKER_REGISTRY\\":\\"ecr-login\\"}}" > /kaniko/.docker/config.json
  - export AWS_REGION=<your-region>

build:
  script:
    - /kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile --destination $DOCKER_REGISTRY/$IMAGE_NAME:$IMAGE_TAG --cache=true
  tags:
    - docker

```

Make sure to replace `<your-aws-account-id>`, `<your-region>`, and `<your-ecr-repository-name>` with your own values.

### Step 3: Pushing the Docker Image to ECR

With the GitLab CI configuration in place, we can now push the Docker image to ECR.

1. Add, commit, and push your code changes to the GitLab repository.
2. Wait for the pipeline to run and complete.
3. Navigate to your AWS ECR repository and verify that the Docker image has been pushed successfully.

Congratulations! You have successfully used Kaniko to build and push Docker images to AWS ECR from GitLab CI. This will enable you to automate your build and deployment process, and ensure that your Docker images are always up-to-date and available to your team.