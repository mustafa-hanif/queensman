const fetchGraphQL = require('./graphql');
// Get emergency ticket open
// See job history of this ticket
// If there is an acknowledged - ignore

// Else check ignored by - if empty and 10 mins passed, add worker, add notification //./// targeted to ops
// if contains worker and 10 mins passed, add ops and add notification to ??
// if contains ?? and 10 mins passed - add notification to client to call someone

async function everyFiveMinute() {
  const { errors, data } = await fetchGraphQL(`query GetOpen {
    job_history(where: {
        job_history_callout: {
          urgency_level: {_eq: "High"},
        }, 
        status_update: {_eq: "Waiting"}
    }) {
      status_update
      callout_id
    }
  }
  `, 'GetOpen');
  console.log(data, errors);
}

module.exports = { everyFiveMinute };
