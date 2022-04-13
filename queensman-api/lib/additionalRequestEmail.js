var additional_request_email = require('../templates/additional_request_email').additional_request_email;
var sendEmail = require('./sendEmail').sendEmail;

const additionalRequestEmail = async ({ callout, worker }) => {
  const params = {
    Destination: { /* required */
      CcAddresses: [
        'ffakhri@queensman.com', 'info@queensman.com', 'operations@queensman.com'
        /* more items */
      ],
      ToAddresses: [
        'services@queensman.com',
        /* more items */
      ]
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
          Charset: 'UTF-8',
          Data: additional_request_email(callout, worker)
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `New Additional Request ${callout.id} Created by ${callout.client_callout_email.full_name}`
      }
    },
    Source: 'services@queensman.com', /* required */
    ReplyToAddresses: [
      'services@queensman.com',
      /* more items */
    ],
  };

  // Create the promise and SES service object
  const sendPromise = sendEmail(params);

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

module.exports = { additionalRequestEmail };
