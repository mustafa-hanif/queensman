'use strict';
var sendNotification = require('../lib/sendNotification');
var fetchExpoToken = require('../lib/graphql').fetchExpoToken;

const sendNotificationAPI = async (event) => {
  console.log(event);
  try {
    const { event: { data: { new: query } } } = JSON.parse(event.body);
    const { worker_email, type, text, client_email } = query;
    let email = type === 'worker' ? worker_email : client_email;
    const tokenData = await fetchExpoToken({ type, email });
    const token = tokenData[type]?.[0]?.expo_token;
    const receipts = await sendNotification({ token, message: text})
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Go Serverless v1.0! Your function executed successfully!',
          details: receipts,
          input: event,
        },
        null,
        2
      ),
    };
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          error: e,
          input: event,
        },
        null,
        2
      ),
    };
  }
};

module.exports = { sendNotificationAPI }