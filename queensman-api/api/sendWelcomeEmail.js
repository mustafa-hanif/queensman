var sendEmail = require('../lib/sendEmail').sendEmail;
var welcomeEmailTemplate = require('../templates/welcome_email').welcomeEmail;

const sendWelcomeEmail = async (event) => {
  console.log(event.body)
  try {
    const u = new URLSearchParams(event.body);
    const clientEmail = u.get('clientEmail');
    const clientName = u.get('clientName');
    const clientPassword = u.get('clientPassword')
    const params = {
      Destination: { /* required */
        CcAddresses: [
          // 'murtaza.hanif@techinoviq.com',
          /* more items */
        ],
        ToAddresses: [
          // 'icemelt7@gmail.com',
          clientEmail
          /* more items */
        ]
      },
      Message: { /* required */
        Body: { /* required */
          Html: {
            Charset: 'UTF-8',
            Data: welcomeEmailTemplate(clientName, clientEmail, clientPassword)
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `${clientName.split(' ')[0]}, Welcome to Queensman Spades!`
        }
      },
      Source: 'Queensman info <services@queensman.com>', /* required */
      ReplyToAddresses: [
        'services@queensman.com',
        /* more items */
      ],
    };
    await sendEmail(params);
    return {
      statusCode: 200,
      headers : {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "Access-Control-Allow-Headers" : "Content-Type"
      },
      body: JSON.stringify({
        message: 'Email sent succesfuly'
      }),
    }
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      headers : {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "Access-Control-Allow-Headers" : "Content-Type"
      },
      body: JSON.stringify(e)
    }
  };
}

module.exports = { sendWelcomeEmail };
