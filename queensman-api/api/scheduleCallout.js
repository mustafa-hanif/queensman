/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
'use strict';
const updateScheduleWithWoker = require('../lib/graphql').updateScheduleWithWoker;
const getWorker = require('../lib/graphql').getWorker;
const getCallout = require('../lib/graphql').getCallout;
const getRelevantWoker = require('../lib/graphql').getRelevantWoker;

const scheduleCallout = async (event) => {
  const { event: { data: { new: query } } } = JSON.parse(event.body);
  console.log(query)
  const schedulerId = query.id;
  const calloutId = query.callout_id;
  const workerId = query.worker_id;
  const callout = await getCallout({ callout_id: calloutId });
  const { id: releventWorker, time } = await getRelevantWoker({ callout });
  console.log(releventWorker, time);
  // const nextWorker = workerId ?? releventWorker;
  // const worker = await getWorker({ worker_id: nextWorker });

  // const data = await updateScheduleWithWoker({
  //   id: schedulerId,
  //   worker_id: nextWorker,
  //   callout_id: calloutId,
  //   worker_email: worker.email
  // });
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

module.exports = { scheduleCallout }
