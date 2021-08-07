'use strict';
const sendNotification = require('./api/sendNotification').sendNotificationAPI;
const scheduleCallout = require('./api/scheduleCallout').scheduleCallout;
const everyFiveMinute = require('./api/everyFiveMinute').everyFiveMinute;
const addJobTicketZoho = require('./api/addJobTicketZoho').addJobTicketZoho;
const quarterlyTasks = require('./api/quarterlyTasks').quarterlyTasks;
const uploadDocument = require('./api/uploadDocument').uploadDocument;
const downloadDocument = require('./api/downloadDocument').downloadDocument;
const sendWelcomeEmail = require('./api/sendWelcomeEmail').sendWelcomeEmail;


module.exports.sendNotification = sendNotification;
module.exports.scheduleCallout = scheduleCallout;
module.exports.everyFiveMinute = everyFiveMinute;
module.exports.addJobTicketZoho = addJobTicketZoho;
module.exports.quarterlyTasks = quarterlyTasks;
module.exports.uploadDocument = uploadDocument;
module.exports.downloadDocument = downloadDocument;
module.exports.sendWelcomeEmail = sendWelcomeEmail;
