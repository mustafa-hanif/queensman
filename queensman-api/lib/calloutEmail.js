var calloutTemplate = require('../templates/callout_details').calloutTemplate;
var sendEmail = require('./sendEmail').sendEmail;

const calloutEmail = async ({ callout, worker, time }) => {
  const params = {
    Destination: { /* required */
      CcAddresses: [
        'ffakhri@queensman.com', 'bvictor@queensman.com',
        'murtaza.hanif@techinoviq.com', 'operations@queensman.com', "salmanhanif133@gmail.com"
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
          Data: calloutTemplate(callout, worker, time)
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `[UAT] New Callout ${callout.id} Created by ${callout.client_callout_email.full_name}`
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

module.exports = { calloutEmail };
