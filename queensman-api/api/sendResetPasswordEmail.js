var sendEmail = require('../lib/sendEmail').sendEmail;
var reset_password_email = require('../templates/reset_password_email').reset_password_email;

const sendResetPasswordEmail = async (event) => {
  console.log(event)
  try {
    const data = JSON.parse(event.body)
    const clientEmail = data.clientEmail   
    console.log(clientEmail) 
    const params = {
      Destination: { /* required */
        CcAddresses: [
          // 'murtaza.hanif@techinoviq.com',
          /* more items */
        ],
        ToAddresses: [
          clientEmail
          /* more items */
        ]
      },
      Message: { /* required */
        Body: { /* required */
          Html: {
            Charset: 'UTF-8',
            Data: reset_password_email(clientEmail, "0000")
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: "Your password has been reset"
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
      body: JSON.stringify({
        message: 'Email sent succesfuly'
      }),
    }
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    }
  };
}

module.exports = { sendResetPasswordEmail };
