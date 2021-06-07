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
var fetch = require("node-fetch");

async function fetchGraphQL(operationsDoc, operationName, variables) {
  console.log(JSON.stringify({
    query: operationsDoc,
    variables: variables,
    operationName: operationName
  }))
  const result = await fetch(
    "https://hasura-8106d23e.nhost.app/v1/graphql",
    {
      method: "POST",
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

function fetchMyQuery({ type, email }) {
  return fetchGraphQL(
    expoQuery(type),
    "FetchExpoToken",
    {"email": email}
  );
}

// Exportable functions
async function fetchExpoToken({ type, email }) {
  const { errors, data } = await fetchMyQuery({ type, email });

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  console.log(data);
  return data;
}

async function updateScheduleWithWoker({ id, worker_id, callout_id, worker_email }) {
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

async function getWorker({ worker_id }) {
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

module.exports = { fetchExpoToken, updateScheduleWithWoker, getWorker };