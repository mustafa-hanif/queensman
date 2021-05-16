var Expo = require('expo-server-sdk').Expo;

let expo = new Expo();

const sendNotification = async ({ token, message }) => {
  if (!Expo.isExpoPushToken(token)) {
    console.error(`Push token ${token} is not a valid Expo push token`);
    return;
  }

  const push = [{
    to: token,
    sound: 'default',
    body: message,
    data: { withSome: 'data' },
  }]

  let chunks = expo.chunkPushNotifications(push);
  let tickets = [];

  const send = async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }
  };
  await send();

  let receiptIds = [];
  for (let ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  let _receipts = [];
  const recieve = async () => {
    // Like sending notifications, there are different strategies you could use
    // to retrieve batches of receipts from the Expo service.

    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);
        _receipts.push(receipts)
        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        for (let receiptId in receipts) {
          let { status, message, details } = receipts[receiptId];
          if (status === 'ok') {
            continue;
          } else if (status === 'error') {
            console.error(
              `There was an error sending a notification: ${message}`
            );
            _receipts.push(`There was an error sending a notification: ${message}`)
            if (details && details.error) {
              // The error codes are listed in the Expo documentation:
              // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
              // You must handle the errors appropriately.
              console.error(`The error code is ${details.error}`);
              _receipts.push(`The error code is ${details.error}`)
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  await recieve();
  return _receipts;
}
module.exports = sendNotification;
