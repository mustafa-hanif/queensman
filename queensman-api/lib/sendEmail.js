const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const sendEmail = (params) => {
  return new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
}

module.exports = { sendEmail };
