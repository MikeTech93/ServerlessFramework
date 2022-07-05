# WebSocketAPIGateway - Description
A simple WebSocket application

# How to Deploy \ Remove
```sh
# Install all requirements
npm install

# Ensure profile in serverless.yml matches the profile in which you want to deploy too

# Deploy all infrastructure to AWS
serverless deploy

# Remove all infrastructure from AWS
serverless remove
```

# How to test on AWS
```sh

# Deploy to AWS first
serverless deploy

# Take note of the "endpoints:" that is returned - this is the address you will use for testing

# Test Connect, Send and Disconnect works correctly using piesocket
https://www.piesocket.com/websocket-tester#

# Test Broadcast Functionality from AWS Console - (Method #1)
In the AWS Console send a test event to the broadcast function with the following:
    { "body": "This is a test broadcast message" }

# Test Broadcast Functionality from CLI - (Method #2)
npm run broadcast

# Remove all infrastructure once finished testing
serverless remove
```