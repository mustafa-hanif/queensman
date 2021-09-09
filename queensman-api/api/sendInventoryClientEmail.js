/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
'use strict';
const inventoryClientEmail = require('../lib/inventoryClientEmail').inventoryClientEmail;

const sendInventoryClientEmail = async (event) => {
  const query = JSON.parse(event.body)
  console.log(event.body)
  const inventory_report_pdf = query.inventory_report_pdf;
  const property = query.property
  const client = query.client

  for (let i = 0; i < client.length; i++) {
    await inventoryClientEmail(inventory_report_pdf, property, client[i])    
  }

  
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

module.exports = { sendInventoryClientEmail }
