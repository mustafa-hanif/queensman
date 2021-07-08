'use strict';
const sendNotification = require('./api/sendNotification').sendNotificationAPI;
const scheduleCallout = require('./api/scheduleCallout').scheduleCallout;
const everyFiveMinute = require('./api/everyFiveMinute').everyFiveMinute;
// var zohoCrmTest = require('./api/zohoCrmTest').zohoCrmTest;

module.exports.sendNotification = sendNotification;
module.exports.scheduleCallout = scheduleCallout;
module.exports.everyFiveMinute = everyFiveMinute;
// module.exports.zohoCrmTest = zohoCrmTest;
