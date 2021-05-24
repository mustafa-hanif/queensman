'use strict';
var sendNotification = require('./api/sendNotification').sendNotification;
var zohoCrmTest = require('./api/zohoCrmTest').zohoCrmTest;

module.exports.sendNotification = sendNotification;
module.exports.zohoCrmTest = zohoCrmTest;
