const AWS = require('aws-sdk');

const S3Client = new AWS.S3;

const S3 = {
    async get (fileName, bucket) {
        const params = {
            Bucket: bucket,
            Key: fileName
        };

    let data = await S3Client.getObject(params).promise();

    if (!data){
        throw error(`Failed to get the file ${fileName}, from ${bucket}`)
    }

    if (fileName.slice(fileName.length - 4, fileName.length) == 'json') {
        data = data.Body.toString()
    };
    
    return data;

    },
    async write(data, fileName, bucket) {
        const params = {
            Bucket: bucket,
            Body: JSON.stringify(data),
            Key: fileName,
        };

        const newData = await S3Client.putObject(params).promise();

        if (!newData){
            throw error('there was an error writing the file')
        }

        return newData;
    },
};

module.exports = S3;