/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
'use strict';
const inventoryTeamEmail = require('../lib/inventoryTeamEmail').inventoryTeamEmail;

const sendInventoryTeamEmail = async (event) => {
  const query = JSON.parse(event.body)
  const inventory_report_pdf = query.inventory_report_pdf;
  const property = query.property
  // const client = query.client

  // Send Email
  await inventoryTeamEmail(inventory_report_pdf, property)
  
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

module.exports = { sendInventoryTeamEmail }
