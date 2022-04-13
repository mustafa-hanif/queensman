var inventory_team_email = require('../templates/inventory_team_email').inventory_team_email;
var sendEmail = require('./sendEmail').sendEmail;

const inventoryTeamEmail = async (inventory_report_pdf, property) => {
  const params = {
    Destination: { /* required */
      CcAddresses: [],
      ToAddresses: [
        'ffakhri@queensman.com', 'info@queensman.com', 'operations@queensman.com'
        /* more items */
      ]
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
          Charset: 'UTF-8',
          Data: inventory_team_email(inventory_report_pdf, property)
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: "Queensman Inventory Report"
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

module.exports = { inventoryTeamEmail };
