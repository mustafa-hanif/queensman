/* eslint-disable no-unused-vars */
const fetchGraphQL = require('./graphql').fetchGraphQL;
const differenceInMinutes = require('date-fns/differenceInMinutes');
const subMonths = require('date-fns/subMonths');
const format = require('date-fns/format');
const addHours = require('date-fns/addHours');
const subWeeks = require('date-fns/subWeeks');
const parseJSON = require('date-fns/parseJSON');

// Else check ignored by - if empty and 10 mins passed, add worker, add notification //.
/// targeted to ops
// if contains worker and 10 mins passed, add ops and add notification to ??
// if contains ?? and 10 mins passed - add notification to client to call someone

async function everyFiveMinute() {
  await respondToEmergencies();
  await notifyScheduledTasks();

  await notifyTeamisComing();
}

async function notifyTeamisComing() {
  const { errors, data } = await fetchGraphQL(`
  query GetJobDue($today: date!) {
    scheduler(where: {
      date_on_calendar: {_eq: $today}, 
      confirmed: {_eq: true}, 
    }) {
        date_on_calendar
        time_on_calendar
        worker_id
        callout {
          client_callout_email {
            email
          }
        }
      }
    }`, 'GetJobDue', {
    today: new Date(),
  });

  data.scheduler.forEach(async item => {
    const clientEmail = item?.callout?.client_callout_email?.email;
    const jobTime = new Date(`${item.date_on_calendar}T${item.time_on_calendar}`);
    const diffWithNow = differenceInMinutes(jobTime, new Date());

    if (diffWithNow >= 55 && diffWithNow <= 60) {
      await addNotification(clientEmail, 'The team is on the way', 'client', {});
    }
    // If team is running late
    const { errors, data } = await fetchGraphQL(`query GetJobDue($updater_id: Int!) {
      job_history(where: {updater_id: {_eq: $updater_id}}, order_by: {time: desc}, limit: 1) {
        status_update
        time
      }
    }`, 'GetJobDue', {
      updater_id: item.worker_id
    });

    if (data?.job_history[0]?.status_update === 'In Progress') {
      const lastJobWorkerTime = new Date(data?.job_history[0]?.time);
      const diff = differenceInMinutes(jobTime, lastJobWorkerTime);
      if (diff >= 40 && diff <= 45) {
        await addNotification(clientEmail, 'Sorry the team is running late on the previous job. The coordinator will be in contact shortly', 'client', {});
      }
    }

    if (data?.job_history[0]?.status_update === 'Closed') {
      const lastJobWorkerTime = new Date(data?.job_history[0]?.time);
      const diff = differenceInMinutes(jobTime, lastJobWorkerTime);
      if (diff >= 65 && diff <= 70) {
        await addNotification(clientEmail, 'Hi. We’re running to plan – our team will be with you as scheduled', 'client', {});
      } else if (diff >= 80 && diff <= 70) {
        await addNotification(clientEmail, 'Our team is a little ahead of time, expect them within an hour.', 'client', {});
      }
    }
  })
}

async function notifyScheduledTasks() {
  const { errors, data } = await fetchGraphQL(
    `query GetPendingSchedule($_eq: date!) {
      scheduler(where: {date_on_calendar: {_eq: $_eq}, confirmed: {_eq: false}}) {
        notes
        id
        date_on_calendar
        job_worker {
          worker {
            full_name
          }
        }
        callout {
          id
          client_callout_email {
            email
          }
        }
      }
    }`,
    'GetPendingSchedule', {
      _eq: subWeeks(new Date(), 2),
    }
  );
  console.log(errors, data);
  data.scheduler.forEach(item => {
    const email = item?.callout?.client_callout_email?.email;
    const name = item?.callout?.job_worker?.worker?.full_name;
    const scheduler_id = item?.id;
    const callout_id = item?.callout?.id;
    addNotification(email, `You have scheduled service "${item.notes}" is due in 2 weeks, ${name} will come to you`, 'client', { callout_id, scheduler_id, type: 'client_confirm' });
  })
}

async function respondToEmergencies() {
  const { errors: errors2, data: emergencyWokers } = await fetchGraphQL(
    `query GetEmergency {
      worker(where: {isEmergency: {_eq: true}}) {
        email
        id
        phone
        schedulers(limit: 1, order_by: {date_on_calendar: desc}) {
          callout_id
        }
      }
    }`,
    'GetEmergency'
  );
  // console.log(errors, emergencyWokers);
  const { phone: emergencyPhone, schedulers } = emergencyWokers.worker[0];
  const calloutId = schedulers[0].callout_id;
  const { errors, data } = await fetchGraphQL(`query GetOpen($calloutId: Int!) {
    job_history(order_by: {time: desc}, where: {callout_id: {_eq: $calloutId}}, limit: 1) {
      id
      status_update
      callout_id
      time
      job_history_callout {
        client_callout_email {
          email
          phone
        }
      }
    }
  }
  `, 'GetOpen', {
    calloutId
  });
  // Get emergency ticket open
  data.job_history.forEach(async job_history => {
    if (job_history.status_update !== 'Waiting') {
      return;
    }
    const minutes = differenceInMinutes(new Date(), parseJSON(job_history.time));
    console.log(minutes);
    if (minutes >= 20) {
      const clientEmail = job_history?.job_history_callout?.client_callout_email?.email;
      if (!clientEmail) {
        return;
      }
      // Add notification for call to client
      await addNotification(clientEmail, 'Our team have not been able to respond to you, please call our team directly', 'client', { phone: emergencyPhone, type: 'call' });
      await fetchGraphQL(`mutation WaitForClient($callout_id: Int!) {
        insert_job_history_one(object: {callout_id: $callout_id, status_update: "Waiting for Client"}) {
          status_update
        }
      }
      `, 'WaitForClient', {
        callout_id: job_history.callout_id
      });
      return;
    }
    if (minutes >= 15) {
      // Add notification to Operations Coordinator
      await addNotification('opsmanager@queensman.com', `The emergency team assigned to Callout ${job_history.callout_id} is not responding, Please take action`, 'worker');
      return;
    }
    if (minutes >= 10) {
      // Add notification to Operations Coordinator
      await addNotification('opscord@queensman.com', `The emergency team assigned to Callout ${job_history.callout_id} is not responding, Please take action`, 'worker');
    }
  });
}

async function addNotification(email, text, type, data) {
  const { errors, data: queryData } = await fetchGraphQL(
    `mutation SendNotification($email: String!, $text: String!, $type: String!, $data: json = {}) {
      insert_notifications_one(object: {
        worker_email: $email,
        client_email: $email,
        text: $text, 
        type: $type,
        data: $data
      }) {
        text
      }
    }`,
    'SendNotification',
    {
      email,
      text,
      type,
      data
    }
  );
  console.log(errors, queryData);
}
module.exports = { everyFiveMinute };
