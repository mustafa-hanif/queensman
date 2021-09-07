var inventory_client_email = require('../templates/inventory_client_email').inventory_client_email;
var sendEmail = require('./sendEmail').sendEmail;

const inventoryClientEmail = async (inventory_report_pdf, property, client) => {
  const params = {
    Destination: { /* required */
      CcAddresses: [],
      ToAddresses: [
        client.email,
        "salmanhanif133@gmail.com"
      /* more items */
      ]
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
          Charset: 'UTF-8',
          Data: inventory_client_email(inventory_report_pdf, property, client)
        },
      },
      Subject: {
        Charset: 'UTF-8',
        // Data: `[UAT] New Callout ${callout.id} Created by ${callout.client_callout_email.full_name}`
        Data: "[UAT] Queensman Inventory Report Client"
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

module.exports = { inventoryClientEmail };
