/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
'use strict';
const getCallout = require('../lib/graphql').getCallout;
const { ENDPOINT, SECRET } = require('../_config');
const fetch = require('node-fetch');
const moment = require('moment')
const dateFns = require('date-fns');

const jobTicketTimeSet = async (event) => {
  async function fetchGraphQL(operationsDoc, operationName, variables) {
    console.log(
      JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      })
    );
    const result = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'x-hasura-admin-secret': SECRET,
      },
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      }),
    });
    return await result.json();
  }

  console.log(event)
  const { event: { data: { new: newQuery } } } = JSON.parse(event.body);
  const { event: { data: { old: oldQuery } } } = JSON.parse(event.body);
  // console.log(query)
  const newStatus = newQuery.status;
  const oldStatus = oldQuery.status;
  const id = newQuery.id
  if (oldStatus === 'Open' && newStatus === 'In Progress') {
    console.log('From Open to In Progress')
    const { errors, data: updateTicket } = await fetchGraphQL(
      `mutation updateJobTicket($id: Int!, $start_time: timestamptz!) {
        update_job_tickets(where: {id: {_eq: $id}}, _set: {start_time: $start_time}) {
          affected_rows
        }
      }               
    `,
      'updateJobTicket',
      {
        id,
        start_time: new Date().toISOString()
      }
    );
  }

  if (oldStatus === 'In Progress' && newStatus === 'Closed') {
    console.log('From In Progress to Closed')
    const { errors, data: updateTicket } = await fetchGraphQL(
      `mutation updateJobTicket($id: Int!, $end_time: timestamptz!) {
        update_job_tickets(where: {id: {_eq: $id}}, _set: {end_time: $end_time}) {
          affected_rows
        }
      }               
    `,
      'updateJobTicket',
      {
        id,
        end_time: new Date().toISOString()
      }
    );
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

module.exports = { jobTicketTimeSet }
