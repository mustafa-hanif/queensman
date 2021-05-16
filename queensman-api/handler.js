'use strict';
var sendNotification = require('./lib/sendNotification');
var fetchExpoToken = require('./lib/graphql');

module.exports.sendNotification = async (event) => {
  console.log(event);
  try {
    const { type, email } = JSON.parse(event.body);
    const tokenData = await fetchExpoToken({ type, email });
    const token = tokenData[type]?.[0]?.expo_token;
    const receipts = await sendNotification({ token, message: "Hello world"})
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
  
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
