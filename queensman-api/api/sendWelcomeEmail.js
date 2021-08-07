var sendEmail = require('../lib/sendEmail').sendEmail;
var welcomeEmailTemplate = require('../templates/welcome_email').welcomeEmail;

const sendWelcomeEmail = async (event) => {
  const { clientEmail, clientName } = event.body;
  const params = {
    Destination: { /* required */
      CcAddresses: [
        'murtaza.hanif@techinoviq.com',
      /* more items */
      ],
      ToAddresses: [
        'icemelt7@gmail.com',
        clientEmail
      /* more items */
      ]
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
          Charset: 'UTF-8',
          Data: welcomeEmailTemplate(clientName)
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `${clientName.split(' ')[0]}, Welcome to Queensman Spades!`
      }
    },
    Source: 'gnyahuma@queensman.com', /* required */
    ReplyToAddresses: [
      'gnyahuma@queensman.com',
    /* more items */
    ],
  };

  try {
    const email = await sendEmail(params);
    return {
      status: 200,
      body: email,
    }
  } catch (e) {
    return {
      status: 500,
      body: e
    }
  };
}

module.exports = { sendWelcomeEmail };
