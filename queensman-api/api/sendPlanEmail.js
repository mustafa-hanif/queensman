/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
'use strict';
const planEmail = require('../lib/planEmail').planEmail;
const moment = require('moment');

const sendPlanEmail = async (event) => {
  const query = JSON.parse(event.body)
  const planArray = query.planArray;
  console.log(event)
  // const fileLink = "abc.html"
  // Send Email
  await planEmail(planArray, moment);
  // console.log(data);
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Go Serverless v1.0! Your function executed successfully!',
          // input: event,
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
          // input: event,
        },
        null,
        2
      ),
    };
  }
};

module.exports = { sendPlanEmail }
