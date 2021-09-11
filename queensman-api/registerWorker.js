/*
This is an example snippet - you should consider tailoring it
to your service.
*/
/*
Add these to your `package.json`:
  "node-fetch": "^2.5.0"
*/

// Node doesn't implement fetch so we have to import it
const fetch = require('node-fetch');

const createClient = require('nhost-js-sdk').createClient;

const config = {
  baseURL: 'https://backend-cf57bf4d.nhost.app',
  ssr: true,
};

const { auth } = createClient(config);

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    'https://hasura-cf57bf4d.nhost.app/v1/graphql',
    {
      method: 'POST',
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );
  return await result.json();
}

const operationsDoc = `
  query FetchWorkers {
    client(order_by: {id: desc}) {
      id
      email
      password
    }
  }
`;

function fetchFetchWorkers() {
  return fetchGraphQL(
    operationsDoc,
    'FetchWorkers',
    {}
  );
}

async function startFetchFetchWorkers() {
  const { errors, data } = await fetchFetchWorkers();

  if (errors) {
    // handle those errors like a pro
    // console.error(errors.data);
  }

  // do something great with this precious data
  // console.log(data);
  data.client.forEach(worker => {
    const { id, email, password } = worker;
    const password_ = password ?? '0000';
    console.log(id, email, password_);
    auth.register({ email, password: password_ }).catch(e => {
      console.log(`[x] ${e.response.data.message} - for ${email}`);
    });
  })
}

startFetchFetchWorkers();
