/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
'use strict';
const additionalRequestEmail = require('../lib/additionalRequestEmail').additionalRequestEmail;
const getWorker = require('../lib/graphql').getWorker;
const getCallout = require('../lib/graphql').getCallout;

const sendAdditionalRequestEmail = async (event) => {
  const { event: { data: { new: query } } } = JSON.parse(event.body);
  const callout_id = query.id;
  const job_type = query.job_type;
  let message = "Email not sent"
  if(job_type === "Request for quotation" || job_type === "Other") {
    const {callout} = await getCallout({ callout_id });
    console.log(callout)
    const worker_id = callout?.job_worker[0]?.worker_id
    const worker = await getWorker({ worker_id });
    await additionalRequestEmail({callout, worker});
    message = "Email sent"
  } 

  
  // console.log(data);
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: `Go Serverless v1.0! Your function executed successfully!, ${message}`,
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

module.exports = { sendAdditionalRequestEmail }
