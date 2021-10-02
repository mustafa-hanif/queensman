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
const moment = require('moment')
const format = require('date-fns/format');
const dateFns = require('date-fns');
const { ENDPOINT, SECRET } = require('../_config');
const { zonedTimeToUtc, utcToZonedTime } = require('date-fns-tz')
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

const expoQuery = (type) => `
  query FetchExpoToken($email: String) {
    ${type}(where: {email: {_eq: $email}}) {
      expo_token
    }
  }
`;

function fetchMyQuery({ type, email }) {
  return fetchGraphQL(expoQuery(type), 'FetchExpoToken', { email: email });
}

// Exportable functions
async function fetchExpoToken({ type, email }) {
  const { errors, data } = await fetchMyQuery({ type, email });

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  // console.log(data);
  return data;
}
async function updateScheduleWithEmergencyWoker({
  id,
  worker_id,
  callout_id,
  phone,
  worker_email,
  callout_email,
  client_name,
  time,
  date,
}) {
  const { errors, data } = await fetchGraphQL(
    `mutation UpdateSchedulerWithWorker($worker_id: Int!, 
      $id: Int!, 
      $callout_id: Int!, 
      $worker_email: String!, 
      $time: time!,
      $client_name: String!,
      $date: date!, 
      $data: jsonb!
    ) {
    update_scheduler(where: {
      id: {_eq: $id}
    }, _set: {
      worker_id: $worker_id,
      date_on_calendar: $date,
      time_on_calendar: $time
    }) {
      returning {
        worker_id
      }
    }
    update_job_tickets(where: {callout_id: {_eq: $callout_id}}, _set: {worker_email: $worker_email, worker_id: $worker_id}) {
      returning {
        id
      }
    }
    insert_job_worker_one(object: {
      callout_id: $callout_id, 
      worker_id: $worker_id
    }) {
      worker_id
    }
    insert_job_history_one(object: {
      callout_id: $callout_id, 
      status_update: "Waiting", 
      updater_id: $worker_id
    }) {
      status_update
    }
    insert_notifications_one(object: {
      worker_email: $worker_email, 
      text: $client_name, 
      type: "worker",
      callout_id: $callout_id,
      data: $data
    }) {
      text
    }
  }
  `,
    'UpdateSchedulerWithWorker',
    {
      worker_id,
      id,
      callout_id,
      worker_email,
      callout_email,
      time,
      client_name: `An emergency has just been posted, please call the client with name ${client_name}`,
      date,
      data: { callout_id },
    }
  );
  console.log(errors, data);
}
async function updateScheduleWithWoker({
  id,
  worker_id,
  callout_id,
  worker_email,
}) {
  const { errors, data } = await fetchGraphQL(
    `mutation UpdateSchedulerWithWorker($worker_id: Int!, $id: Int!, $callout_id: Int!, $worker_email: String!) {
    update_scheduler(where: {id: {_eq: $id}}, _set: {worker_id: $worker_id}) {
      returning {
        worker_id
      }
    }
    update_job_tickets(where: {callout_id: {_eq: $callout_id}}, _set: {worker_email: $worker_email, worker_id: $worker_id}) {
      returning {
        id
      }
    }
    insert_notifications_one(object: {worker_email: $worker_email, text: "A new scheduled job has been assigned to you", type: "worker", callout_id: $callout_id}) {
      text
    }
    insert_job_worker_one(object: {callout_id: $callout_id, worker_id: $worker_id}) {
      worker_id
    }
    insert_job_history_one(object: {callout_id: $callout_id, updated_by: "Admin", status_update: "Job Assigned"}) {
      id
    }
  }
  `,
    'UpdateSchedulerWithWorker',
    {
      worker_id,
      id,
      callout_id,
      worker_email,
    }
  );

  if (errors) {
    // handle those errors like a pro
    console.log(errors);
    throw new Error(errors);
  }

  // do something great with this precious data
  // console.log(data.update_scheduler);
  return data;
}

async function getWorker({ worker_id }) {
  const { errors, data } = await fetchGraphQL(
    `query GetWorker($id: Int!) {
    worker_by_pk(id: $id) {
      email
      full_name
      isEmergency
      phone
      teams {
        team_color
      }
      teams_member {
        team_color
      }
    }
  }  
  `,
    'GetWorker',
    { id: worker_id }
  );

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  // console.log(data.worker_by_pk);
  return data.worker_by_pk;
}

async function getCallout({ callout_id }) {
  const { errors, data } = await fetchGraphQL(
    `query GetCallout($callout_id: Int!) {
    callout_by_pk(id: $callout_id) {
      id
      urgency_level
      status
      job_type
      description
      client_callout_email {
        full_name
        phone
        email
        id
      }
      property {
        address
        id
        community
        city
        country
      }
      job_worker {
        worker_id
      }
      request_time
    }
    teams_aggregate(where: {worker: {isEmergency: {_eq: false}}}) {
      aggregate {
        count
      }
    }
  }
    
  `,
    'GetCallout',
    { callout_id }
  );

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  // console.log(data.worker_by_pk);
  return { callout: data.callout_by_pk, teamCount: data?.teams_aggregate?.aggregate?.count };
}

async function getRelevantWoker({ callout, date, time, schedulerId, teamCount, endTime }) {
  const now = new Date();
  const timeZone = 'Asia/Dubai'
  const zonedDate = utcToZonedTime(now, timeZone)

  // get callout type - Emergency or schedule
  const { urgency_level, job_type } = callout;
  // if emergency - get the emergency team worker
  if (urgency_level === 'High') {
    const { errors, data: emergencyWokers } = await fetchGraphQL(
      `query GetEmergency {
        worker(where: {isEmergency: {_eq: true}}) {
          email
          id
        }
      }`,
      'GetEmergency'
    );
    console.log(errors, emergencyWokers);
    const { email, id } = emergencyWokers.worker[0];
    // Find their next available slot
    //  - Get all schedule by this worker sorted by date
    const { errors: errors2, data: lastWorkers } = await fetchGraphQL(
      `query LastTimeofWorker($workerId: Int!, $today: date!) {
      scheduler(where: {worker_id: {_eq: $workerId}, date_on_calendar: {_eq: $today}}, order_by: {time_on_calendar: desc}, limit: 1) {
        time_on_calendar
      }
    }`,
      'LastTimeofWorker',
      {
        workerId: id,
        today: format(zonedDate, 'yyyy-MM-dd'),
      }
    );
    const lastWorker = lastWorkers.scheduler?.[0];
    const now = new Date();
    const timeZone = 'Asia/Dubai'
    const zonedDate = utcToZonedTime(now, timeZone)
    const workerTime = lastWorker
      ? dateFns.parse(
        lastWorker.time_on_calendar,
        'HH:mm:ss',
        new Date()
      )
      : zonedDate;
    //  - return last slot + 1 hour
    // return { lastWorker.time_on_calendar + 1, id }
    return {
      id,
      time: dateFns.format(dateFns.addHours(workerTime, 3), 'HH:mm:ss'),
    };
  } // If schedule
  else {
    // Get category of callout
    // Get all workers that fit the category
    // Get Emergency Teams
    const { errors, data: emergencyWokers } = await fetchGraphQL(
      `query GetEmergency {
        worker(where: {isEmergency: {_eq: true}}) {
          email
          id
        }
      }`,
      'GetEmergency'
    );
    const offset = 0;
    let workerId = null;
    const nin = [emergencyWokers?.worker?.[0]?.id] // array for exclude workers
    const workerIdArray = []
    console.log(emergencyWokers)

    const { errors: schedulerError, data: schedulerData } = await fetchGraphQL( // get workers
      `query LastTimeofWorker($today: date!) {
        scheduler(where: {
          date_on_calendar: {_eq: $today},
          worker_id : {_is_null: false}
        }, order_by: {time_on_calendar: desc}) {
          time_on_calendar
          end_time_on_calendar
          worker_id
        }
      }`,
      'LastTimeofWorker',
      {
        today: new Date(date).toISOString().substring(0, 10)
      }
    );

    schedulerData?.scheduler.forEach((element, i) => { // Map over all the workers on that date
      const startTimeOnCalender = element.time_on_calendar;
      const endTimeOnCalender = element.end_time_on_calendar;
      const endTimeOnSlot = moment(dateFns.parse(endTime, 'HH:mm:ss', new Date())).subtract(1, 'minute').format('HH:mm:ss');
      const startTimeOnSlot = moment(dateFns.parse(time, 'HH:mm:ss', new Date())).format('HH:mm:ss')
      if ((startTimeOnCalender <= endTimeOnSlot) && (endTimeOnCalender >= endTimeOnSlot || endTimeOnCalender > startTimeOnSlot)) { // Check range
        console.log(element.worker_id);
        nin.push(element.worker_id); // push into exclude array
        workerIdArray.push(element.worker_id); // push into  worker array
      }
    });
    console.log(workerIdArray.length, 'length');
    if (workerIdArray.length === 1) { // If there was a worker already in that slot, find another worker and assign and block
      // change 1 to any number.
      // 1 -> 2 workers can be assigned max
      console.log('HEEEEEEEEEEEERE')
      const { errors: errorsTeams, data: teams } = await fetchGraphQL(
        `query GetTeams($_contains: jsonb!, $_nin: [Int!]) {
          teams(where: {team_expertise: {_contains: $_contains}, team_leader: {_nin: $_nin}}) {
            worker {
              id
            }
          }
        }
      `,
        'GetTeams',
        { _contains: job_type, _nin: nin }
      );
      workerId = teams.teams?.[0]?.worker?.id;
      // const selectedTime = dateFns.parse(time, 'HH:mm:ss', new Date());
      const { errors: errors2, data: lastWorkers } = await fetchGraphQL(
        `mutation UpdateToBlock($id: Int!, $today: date!, $_gte: time!, $_lte: time!) {
          update_scheduler(where: {id: {_eq: $id}, date_on_calendar: {_eq: $today}, time_on_calendar: {_gte: $_gte, _lte: $_lte}}, _set: {blocked: true}) {
            affected_rows
          }
        }          
      `,
        'UpdateToBlock',
        {
          id: schedulerId,
          today: new Date(date).toISOString().substring(0, 10),
          _gte: time,
          _lte: endTime,
        }
      );
      return { id: workerId, time: null }
    } else {
      const { errors: errorsTeams, data: teams } = await fetchGraphQL(
        `query GetTeams($_contains: jsonb!, $_nin: [Int!]) {
          teams(where: {team_expertise: {_contains: $_contains}, team_leader: {_nin: $_nin}}) {
            worker {
              id
            }
          }
        }
      `,
        'GetTeams',
        { _contains: job_type, _nin: nin }
      );
      workerId = teams.teams?.[0]?.worker?.id;
      return { id: workerId, time: null }
    }
  }
}

module.exports = {
  fetchGraphQL,
  fetchExpoToken,
  updateScheduleWithWoker,
  getWorker,
  getCallout,
  getRelevantWoker,
  updateScheduleWithEmergencyWoker,
};
