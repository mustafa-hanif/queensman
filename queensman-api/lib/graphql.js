/* eslint-disable brace-style */
/* eslint-disable no-unused-vars */
/*
This is an example snippet - you should consider tailoring it
to your service.
*/
/*
Add these to your `package.json`:
  "node-fetch": "^2.5.0"
*/
// serverless invoke local --function sendNotification --data '{"type":"client", "email":"azamkhan"}'
// Node doesn't implement fetch so we have to import it
const fetch = require('node-fetch');

async function fetchGraphQL (operationsDoc, operationName, variables) {
  console.log(JSON.stringify({
    query: operationsDoc,
    variables: variables,
    operationName: operationName
  }))
  const result = await fetch(
    'https://hasura-8106d23e.nhost.app/v1/graphql',
    {
      method: 'POST',
      headers: {
        'x-hasura-admin-secret': 'd71e216c844d298d91fbae2407698b22'
      },
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );

  return await result.json();
}

const expoQuery = type => `
  query FetchExpoToken($email: String) {
    ${type}(where: {email: {_eq: $email}}) {
      expo_token
    }
  }
`;

function fetchMyQuery ({ type, email }) {
  return fetchGraphQL(
    expoQuery(type),
    'FetchExpoToken',
    { email: email }
  );
}

// Exportable functions
async function fetchExpoToken ({ type, email }) {
  const { errors, data } = await fetchMyQuery({ type, email });

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  console.log(data);
  return data;
}

async function updateScheduleWithWoker ({ id, worker_id, callout_id, worker_email }) {
  const { errors, data } = await fetchGraphQL(`mutation UpdateSchedulerWithWorker($worker_id: Int!, $id: Int!, $callout_id: Int!, $worker_email: String!) {
    update_scheduler(where: {id: {_eq: $id}}, _set: {worker_id: $worker_id}) {
      returning {
        worker_id
      }
    }
    insert_job_worker_one(object: {callout_id: $callout_id, worker_id: $worker_id}) {
      worker_id
    }
    insert_notifications_one(object: {worker_email: $worker_email, text: "A new scheduled job has been assigned to you", type: "worker"}) {
      text
    }
  }
  `, 'UpdateSchedulerWithWorker', {
    worker_id,
    id,
    callout_id,
    worker_email
  });

  if (errors) {
    // handle those errors like a pro
    console.log(errors);
    throw new Error(errors)
  }

  // do something great with this precious data
  // console.log(data.update_scheduler);
  return data;
}

async function getWorker ({ worker_id }) {
  const { errors, data } = await fetchGraphQL(`query GetWorker($id: Int!) {
    worker_by_pk(id: $id) {
      email
    }
  }  
  `, 'GetWorker', { id: worker_id });

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  // console.log(data.worker_by_pk);
  return data.worker_by_pk;
}

async function getCallout ({ callout_id }) {
  const { errors, data } = await fetchGraphQL(`query GetCallout($callout_id: Int!) {
    callout_by_pk(id: $callout_id) {
      urgency_level
      status
      job_type
    }
  }
    
  `, 'GetCallout', { id: callout_id });

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  // console.log(data.worker_by_pk);
  return data.callout_by_pk;
}

const jobMatrix = {
  AC: ['AC'],
  Plumbing: ['Plumbing']
}

async function getRelevantWoker ({ callout }) {
  // get callout type - Emergency or schedule
  const { urgency_level, job_type } = callout;
  // if emergency - get the emergency team worker
  if (urgency_level === 'High') {
    const { errors, data: emergencyWokers } = await fetchGraphQL(`query GetEmergency {
      worker(where: {isEmergency: {_eq: true}}) {
        email
        id
      }
    }
    `, 'GetEmergency');

    const { email, id } = emergencyWokers[0];
    // Find their next available slot
    //  - Get all schedule by this worker sorted by date
    const { errors: errors2, data: lastWorkers } = await fetchGraphQL(`query LastTimeofWorker($workerId: Int!, $today: date!) {
      scheduler(where: {worker_id: {_eq: $workerId}, date_on_calendar: {_eq: $today}}, order_by: {time_on_calendar: desc}, limit: 1) {
        time_on_calendar
      }
    }
    `, 'LastTimeofWorker', {
      workerId: id,
      today: new Date().toISOString().substring(0, 10)
    });
    const lastWorker = lastWorkers[0];
    //  - find the last slot today filled by him
    //  - if plus 3 hours from now is inside working hour
    if (lastWorker.time_on_calendar + 3 >= '18:00:00') {
      //  - else first slot tomorow morning
      // return { '09:00', id}
      return { id };
    } else {
      //  - return last slot + 1 hour
      // return { lastWorker.time_on_calendar + 1, id }
      return { id };
    }
  } // If schedule
  else {
    // Get category of callout
    const key = Object.keys(jobMatrix).find(jobItem => jobItem.includes(job_type));
    // Get all workers that fit the category
    const { errors: errors3, data: scheduleWorkers } = await fetchGraphQL(`query GetWorkerWithJobType($jobType: String!) {
      worker(where: {expertise: {_eq: $jobType}}) {
        id
      }
    }
    `);
    const scheduleWorker = scheduleWorkers[0];
    return { scheduleWorker };
  }
}

module.exports = { fetchGraphQL, fetchExpoToken, updateScheduleWithWoker, getWorker, getCallout, getRelevantWoker };
