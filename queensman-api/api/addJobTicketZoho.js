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
    if (resultJson.code === 'success') {
      return {
        statusCode: 200,
        code: resultJson?.code,
        message: resultJson?.message
      }
    } else {
      return {
        statusCode: 500,
        code: resultJson?.code,
        message: resultJson?.message
      }
    }
  } catch (e) {
    console.log(e)
  }
  // console.log(query);
  // try {
  //   return {
  //     statusCode: 200,
  //     message: 'Go Serverless v1.0! Your function executed successfully!',
  //     result
  //   };
  // } catch (e) {
  //   return {
  //     statusCode: 500,
  //     body: JSON.stringify(
  //       {
  //         error: e,
  //         // input: event,
  //       },
  //       null,
  //       2
  //     ),
  //   };
  // }
};

module.exports = { addJobTicketZoho }
