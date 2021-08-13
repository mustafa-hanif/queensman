var plan_email = require('../templates/plan_email').plan_email;
var sendEmail = require('./sendEmail').sendEmail;

const planEmail = async (planArray) => {
    console.log(planArray)
  const params = {
    Destination: { /* required */
      CcAddresses: [],
      ToAddresses: [
        'salmanhanif133@gmail.com',
      /* more items */
      ]
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
          Charset: 'UTF-8',
          Data: plan_email(planArray)
        // Data: `Hello view this please <a href="${fileLink}" target="_blank">Inventory Report</a>`
        },
      },
      Subject: {
        Charset: 'UTF-8',
        // Data: `[UAT] New Callout ${callout.id} Created by ${callout.client_callout_email.full_name}`
        Data: "Hello from queensman"
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

module.exports = { planEmail };
