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

module.exports = fetchExpoToken;