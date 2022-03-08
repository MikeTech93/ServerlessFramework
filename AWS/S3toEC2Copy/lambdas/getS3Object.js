const AWS = require('aws-sdk');
const S3 = new AWS.S3({apiVersion: '2006-03-01'});
const SSM = new AWS.SSM({region:'eu-west-1'});

// Ensure to set the instanceIDs to a fake value before checking the code back into the repo as the repo is public
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

// Create function to clean the key to ensure that malicous code injection can not occur on the EC2 instance
function cleanKey(key){
  const a = key.replace(/[&\\#,+()$~%'":*?<>{}]/g, '');
	// Add in further logic here dependant on what files you are expecting to be uplaoded
  console.log(a);
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
    newKey = cleanKey(key)
    const COMMAND = `aws s3 cp s3://${bucket}/${newKey} ${localDir}`;
    
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

    // Need to add in code to check the command completed without failures - but this is just a template to get you started!

};