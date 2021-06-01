'use strict';
var sendNotification = require('./api/sendNotification').sendNotificationAPI;
var scheduleCallout = require('./api/scheduleCallout').scheduleCallout;
// var zohoCrmTest = require('./api/zohoCrmTest').zohoCrmTest;

module.exports.sendNotification = sendNotification;
module.exports.scheduleCallout = scheduleCallout;
// module.exports.zohoCrmTest = zohoCrmTest;
