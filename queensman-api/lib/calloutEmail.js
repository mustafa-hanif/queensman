const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
var calloutTemplate = require('../templates/callout_details').calloutTemplate;

const calloutEmail = async ({ callout, worker }) => {
  const params = {
    Destination: { /* required */
      CcAddresses: [
        'murtaza.hanif@techinoviq.com',
      /* more items */
      ],
      ToAddresses: [
        'icemelt7@gmail.com',
      /* more items */
      ]
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
          Charset: 'UTF-8',
          Data: calloutTemplate(callout, worker)
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'New Callout #23 Created by Murtaza Hanif'
      }
    },
    Source: 'services@queensman.com', /* required */
    ReplyToAddresses: [
      'services@queensman.com',
    /* more items */
    ],
  };

  // Create the promise and SES service object
  const sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

  // Handle promise's fulfilled/rejected states
  try {
    const message = await sendPromise;
    return {
      status: 200,
      body: message,
    }
  } catch (e) {
    console.error(e, e.stack);
    return {
      status: 500,
      body: e
    }
  }
}

module.exports = { calloutEmail };
