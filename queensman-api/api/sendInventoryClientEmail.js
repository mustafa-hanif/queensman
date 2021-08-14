/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
'use strict';
const inventoryClientEmail = require('../lib/inventoryClientEmail').inventoryClientEmail;

const sendInventoryClientEmail = async (event) => {
  const query = JSON.parse(event.body)
  console.log(event.body)
  const inventory_report_pdf = query.inventory_report_pdf;
  const property = query.property
  // const client = query.client
  const client = [{
    id: 6,
    email: 'salmanhanif133@gmail.com',
    full_name: 'Salman Hanif',
    account_type: 'Investor',
    __typename: 'client'
  },
  {
    id: 7,
    email: 'murtaza.hanif@techinoviq.com',
    full_name: 'Murtaza Hanif',
    account_type: 'Investor',
    __typename: 'client'
  },
  {
    id: 8,
    email: 'murtaza.hanif@gmail.com',
    full_name: 'Murtaza Hanif',
    account_type: 'Investor',
    __typename: 'client'
  }]

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
