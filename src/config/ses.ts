import AWS from 'aws-sdk';

const config = new AWS.Config({
  region: 'us-east-2',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

export default new AWS.SES(config);
