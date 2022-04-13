/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
'use strict';

const fetch = require('node-fetch')
const FormData = require('form-data');
const { SECRET } = require('../_config');

const addJobTicketZoho = async (event) => {
  const { event: { data: { new: query } } } = JSON.parse(event.body);
  const Description = query.description;
  const Status = query.type;
  const email = query.client_email;
  const Subject = query.name
  const form = new FormData()
  form.append('arguments', JSON.stringify({
    Subject: `${Subject}`,
    Description: `${Description}`,
    Status: `${Status}`,
    email: `${email}`
  }))

  try {
    const result = await fetch(
      'https://www.zohoapis.com/crm/v2/functions/createtask/actions/execute?auth_type=apikey&zapikey=1003.db2c6e3274aace3b787c802bb296d0e8.3bef5ae5ee6b1553f7d3ed7f0116d8cf',
      {
        method: 'POST',
        headers: {
          'x-hasura-admin-secret': SECRET
        },
        body: form
      }
    );
    const resultJson = await result.json()
    console.log(resultJson)
    if (resultJson?.details.output === 'No email found') {
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: resultJson?.details?.output || "No email found",
            // input: event,
          },
          null,
          2
        ),
      }
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: 'Email Found! Go Serverless v1.0! Your function executed successfully!',
            // input: event,
          },
          null,
          2
        ),
      }
    }
  } catch (e) {
    console.log(e, "Error")
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

module.exports = { addJobTicketZoho }
