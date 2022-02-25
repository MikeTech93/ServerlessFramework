// MANUAL STEPS

// lambda needs IAM access to the ssm.sendmessage on the ec2 instance in question
// ensure aws CLI is installed on the destination and added to the PATH e.g. you can run aws --version from powershell

const AWS = require('aws-sdk');
const S3 = new AWS.S3({apiVersion: '2006-03-01'});
const SSM = new AWS.SSM({region:'eu-west-1'});
const instanceIds = ['i-xxx'];
const localDir = "c:\\temp";

// Create function to send script to EC2 Instance
function sendCommands(instanceIdList, Command) {
    return new Promise(function(resolve, reject) {
      const params = {
        InstanceIds: instanceIdList,
        DocumentName: 'AWS-RunPowerShellScript',
        Parameters: {
          commands: [Command],
        },
      };
      SSM.sendCommand(params, function(err, data) {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(data);
      });
    });
  };

// Start Lambda Function Here
exports.handler = async (event, context) => {
    
    // Display received event details
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    }; 

    // Test can access the S3 object if not quit out with error
    try {
        const { ContentType } = await S3.getObject(params).promise();
        console.log('CONTENT TYPE:', ContentType);
        //return ContentType;
    } catch (err) {
        console.log(err);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    };

    // Generate the command to be sent to the EC2 Instance
    const COMMAND = `aws s3 cp s3://${bucket}/${key} ${localDir}`;
    
    // Send the command to the EC2 Instance
    try {
        sendCommands(instanceIds, COMMAND);
        const message = `Command sent to ${instanceIds}`;
        console.log(message);
    } catch (err) {
        console.log(err);
        const message = `Issue sending command to ${instanceIds}`;
        console.log(message);
    }

};