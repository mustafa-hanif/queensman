/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
'use strict';
const updateScheduleWithWoker = require('../lib/graphql').updateScheduleWithWoker;
const getWorker = require('../lib/graphql').getWorker;
const getCallout = require('../lib/graphql').getCallout;
const getRelevantWoker = require('../lib/graphql').getRelevantWoker;
const updateScheduleWithEmergencyWoker = require('../lib/graphql').updateScheduleWithEmergencyWoker;

const scheduleCallout = async (event) => {
  const { event: { data: { new: query } } } = JSON.parse(event.body);
  console.log(query)
  const schedulerId = query.id;
  const calloutId = query.callout_id;
  const workerId = query.worker_id;
  const callout = await getCallout({ callout_id: calloutId });
  const { id: releventWorker, time } = await getRelevantWoker({ callout, date: query.date_on_calendar, time: query.time_on_calendar });
  console.log({ releventWorker, time });
  const nextWorker = workerId ?? releventWorker;
  const worker = await getWorker({ worker_id: nextWorker });

  if (time) {
    // Run emergency query
    const data = await updateScheduleWithEmergencyWoker({
      id: schedulerId,
      worker_id: nextWorker,
      callout_id: calloutId,
      callout_email: callout.callout_by_email,
      phone: callout.client_callout_email?.phone,
      worker_email: worker.email,
      time,
      date: new Date(),
    });
  } else {
    const data = await updateScheduleWithWoker({
      id: schedulerId,
      worker_id: nextWorker,
      callout_id: calloutId,
      worker_email: worker.email,
      time,
    });
  }
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
