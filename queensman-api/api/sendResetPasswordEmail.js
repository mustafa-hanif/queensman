var sendEmail = require('../lib/sendEmail').sendEmail;
var reset_password_email = require('../templates/reset_password_email').reset_password_email;

const sendResetPasswordEmail = async (event) => {
  console.log(event.body)
  try {
    const u = new URLSearchParams(event.body);
    // const clientEmail = u.get('clientEmail');
    // const clientName = u.get('clientName');
    // const clientPassword = u.get('clientPassword')
    const params = {
      Destination: { /* required */
        CcAddresses: [
          'murtaza.hanif@techinoviq.com',
          /* more items */
        ],
        ToAddresses: [
          'icemelt7@gmail.com',
          "salmanhanif133@gmail.com"
          /* more items */
        ]
      },
      Message: { /* required */
        Body: { /* required */
          Html: {
            Charset: 'UTF-8',
            Data: reset_password_email("salmanhanif133@gmail.com", "0000")
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
