# Serverless Framework

This is a repository to contain templates for using the Serverless Framework to build infrastructure. 

The initial scripts will be solely tested on AWS infrastructure however at a later point they may be converted to be multi cloud and this README will be updated to reflect that.

At the time of writing this the templates were designed to be ran in Serverless 2.0 - The release of 3.0 is just around the corner so please bare in mind there may be some slight changes if you want to run this on 3.0

## Authenticating to AWS
Credentials to authenticate to an AWS account will be stored in an AWS CLI profile called "playground".

You can find information about how to configure these profiles here: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html

The templates have been configured this way to prevent them being accidently run on the default profile. Feel free to change the authentication method so that it works with your CI/CD system of choice.

Please ensure that if using these templates for a live system that credentials are never stored directly in the serverless.yml config file.

You can find out more information about using AWS credentials within your serverless.yml here: https://www.serverless.com/framework/docs/providers/aws/guide/credentials

## Example #1 - How to deploy a simple API Gateway and Lambda Function in AWS

1. Clone the repository
    
    git clone https://github.com/MikeTech93/ServerlessFramework

2. Test you have serverless installed and the playground profile configured

    serverless --version
    aws sts get-caller-identity --profile playground

3. CD into the Simple API Gateway and Lambda Function template folder

    cd .\AWS\SimpleLambdaAndAPIGateway\

4. install node modules

    npm install

5. Deploy the infrastructure in AWS

    serverless deploy

6. The CLI output should show an endpoint which you can copy and paste into your browser to return the following message:

    "message": "Go Serverless v1.0! Your function executed successfully!"

7. You can also check in Cloud Formation, API Gateway & Lambda Function to check its been deployed successfully 

8. Once you're happy its working then you can remove the infrastructure

    serverless remove