var inventory_team_email = require('../templates/inventory_team_email').inventory_team_email;
var sendEmail = require('./sendEmail').sendEmail;

const inventoryTeamEmail = async (inventory_report_pdf, property) => {
  const params = {
    Destination: { /* required */
      CcAddresses: [],
      ToAddresses: [
        // 'gnyahuma@queensman.com', 'aalvi@queensman.com',
        // 'ffakhri@queensman.com', 'bvictor@queensman.com',
        // 'murtaza.hanif@techinoviq.com', 'icemelt7@gmail.com'
        'salmanhanif133@gmail.com', 'murtaza.hanif@techinoviq.com', 'operations@queensman.com'
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
        Data: " [UAT] Queensman Inventory Report"
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
