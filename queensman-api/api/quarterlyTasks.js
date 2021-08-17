/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
'use strict';

const fetch = require('node-fetch')
const FormData = require('form-data');
// const updateScheduleWithWoker = require('../lib/graphql').updateScheduleWithWoker;
// const getWorker = require('../lib/graphql').getWorker;
// const getCallout = require('../lib/graphql').getCallout;
// const getRelevantWoker = require('../lib/graphql').getRelevantWoker;

const quarterlyTasks = async (event) => {
  const query = JSON.parse(event.body)
  const Subject = query.Subject
  const Description = query.Description
  const Status = query.Status
  const Due_Date = query.Due_Date
  const email = query.email
  // const { event: { data: { new: query } } } = JSON.parse(event.body);
  // const description = query.description;
  // const type = query.type;
  // console.log(query)
  //   const calloutId = query.callout_id;
  //   const workerId = query.worker_id;
  //   const callout = await getCallout({ callout_id: calloutId });
  //   const { id: releventWorker, time } = await getRelevantWoker({ callout });
  //   const nextWorker = workerId ?? releventWorker;
  //   const worker = await getWorker({ worker_id: nextWorker });

  //   const data = await updateScheduleWithWoker({
  //     id: schedulerId,
  //     worker_id: nextWorker,
  //     callout_id: calloutId,
  //     worker_email: worker.email
  //   });
  const form = new FormData()
  form.append('arguments', JSON.stringify({
    Subject: Subject,
    Description: Description,
    Status: Status,
    Due_Date: Due_Date,
    email: email
  }))

  try {
    const result = await fetch(
      'https://www.zohoapis.com/crm/v2/functions/quarterlytasks/actions/execute?auth_type=apikey&zapikey=1003.db2c6e3274aace3b787c802bb296d0e8.3bef5ae5ee6b1553f7d3ed7f0116d8cf',
      {
        method: 'POST',
        headers: {
          'x-hasura-admin-secret': 'd71e216c844d298d91fbae2407698b22'
        },
        body: form
      }
    );
    const resultJson = await result.json()
    if(resultJson?.details.output === "No email found") {
      return {
        statusCode: 500,
        message: resultJson?.details.output,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: "hi",
      }
    } else {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        message: resultJson?.details.output,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: "hi",
      }
    }
  } catch (e) {
    console.log(e)
    console.log(resultJson, "ERROR")
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: "bye",
    // isBase64Encoded: true
  };
};

module.exports = { quarterlyTasks }
