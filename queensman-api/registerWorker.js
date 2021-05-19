/*
This is an example snippet - you should consider tailoring it
to your service.
*/
/*
Add these to your `package.json`:
  "node-fetch": "^2.5.0"
*/

// Node doesn't implement fetch so we have to import it
var fetch = require("node-fetch");

var createClient = require("nhost-js-sdk").createClient;

const config = {
  baseURL: "https://backend-8106d23e.nhost.app",
  ssr: true, 
};

const { auth } = createClient(config);


async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    "https://hasura-8106d23e.nhost.app/v1/graphql",
    {
      method: "POST",
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
    worker {
      email
      password
    }
  }
`;

function fetchFetchWorkers() {
  return fetchGraphQL(
    operationsDoc,
    "FetchWorkers",
    {}
  );
}

async function startFetchFetchWorkers() {
  const { errors, data } = await fetchFetchWorkers();

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  console.log(data);
  data.worker.slice(2, data.worker.length - 1).forEach(worker => {
    const { email, password } = worker;
    auth.register({ email: `${email}@queensman.com`, password });
  })
}

startFetchFetchWorkers();