/* eslint-disable no-unused-vars */
const fetchGraphQL = require('./graphql').fetchGraphQL;
const differenceInMinutes = require('date-fns/differenceInMinutes');
const parseJSON = require('date-fns/parseJSON');

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
      time
    }
  }
  `, 'GetOpen');

  // Get emergency ticket open
  data.job_history.forEach(job_history => {
    const minutes = differenceInMinutes(new Date(), parseJSON(job_history.time));
    if (minutes >= 10) {
      // Add notification
    }
    if (minutes >= 20) {
      // Add notification
    }
    if (minutes >= 30) {
      // Add notification for call
    }
  });
}

module.exports = { everyFiveMinute };
