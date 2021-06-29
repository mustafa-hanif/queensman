'use strict';
var sendNotification = require('./api/sendNotification').sendNotificationAPI;
var scheduleCallout = require('./api/scheduleCallout').scheduleCallout;
var everyFiveMinute = require('./api/everyFiveMinute').everyFiveMinute;
// var zohoCrmTest = require('./api/zohoCrmTest').zohoCrmTest;

module.exports.sendNotification = sendNotification;
module.exports.scheduleCallout = scheduleCallout;
module.exports.everyFiveMinute = everyFiveMinute;
// module.exports.zohoCrmTest = zohoCrmTest;
