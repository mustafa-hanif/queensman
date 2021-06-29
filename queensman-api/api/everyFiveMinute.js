'use strict';

const everyFiveMinute = async (event) => {
  console.log(event);
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Go Serverless v1.0! Your function executed successfully!',
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

module.exports = { everyFiveMinute }