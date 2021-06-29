'use strict';
var updateScheduleWithWoker = require('../lib/graphql').updateScheduleWithWoker;
var getWorker = require('../lib/graphql').getWorker;
var getCallout = require('../lib/graphql').getCallout;
var getRelevantWoker = require('../lib/graphql').getRelevantWoker;

const scheduleCallout = async (event) => {
  const { event: { data: { new: query } } } = JSON.parse(event.body);
  const schedulerId = query.id;
  const calloutId = query.callout_id;
  const workerId = query.worker_id;
  // const nextWorker = workerId ?? 1; // Math.ceil(Math.random() * 100) % 12;
  const worker = await getWorker({ worker_id: nextWorker });
  const callout = await getCallout({ worker_id: calloutId });
  const nextWorker = await getRelevantWoker({ callout });
  const data = await updateScheduleWithWoker({ id: schedulerId, worker_id: nextWorker, callout_id: calloutId, worker_email: worker.email});
  console.log(data);
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