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
  query MyQuery {
    client {
      email
      account_type
      id
      password
    }
  }
`;

function fetchMyQuery() {
  return fetchGraphQL(
    operationsDoc,
    "MyQuery",
    {}
  );
}

async function startFetchMyQuery() {
  const { errors, data } = await fetchMyQuery();

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  // data.client.forEach(client => {
  //   const { email, password, full_name } = client;
  //   auth.register({
  //     email,
  //     password,
  //     options: { userData: { display_name: full_name } },
  //   });
  // });
  return data;
}
// startFetchMyQuery();
module.exports = async (req, res) => {
  try {
    const data = await startFetchMyQuery();
    res.status(200).send(data);  
  }catch(e){
    res.status(500).send(JSON.stringify(e));
  }
};
