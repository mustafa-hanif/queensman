'use strict';
const sendNotification = require('./api/sendNotification').sendNotificationAPI;
const sendInventoryClientEmail = require('./api/sendInventoryClientEmail').sendInventoryClientEmail;
const sendInventoryTeamEmail = require('./api/sendInventoryTeamEmail').sendInventoryTeamEmail;
const scheduleCallout = require('./api/scheduleCallout').scheduleCallout;
const everyFiveMinute = require('./api/everyFiveMinute').everyFiveMinute;
const addJobTicketZoho = require('./api/addJobTicketZoho').addJobTicketZoho;
const quarterlyTasks = require('./api/quarterlyTasks').quarterlyTasks;
const uploadDocument = require('./api/uploadDocument').uploadDocument;
const downloadDocument = require('./api/downloadDocument').downloadDocument;
const sendWelcomeEmail = require('./api/sendWelcomeEmail').sendWelcomeEmail;
const sendPlanEmail = require('./api/sendPlanEmail').sendPlanEmail;
const sendAdditionalRequestEmail = require('./api/sendAdditionalRequestEmail').sendAdditionalRequestEmail;
const sendResetPasswordEmail = require('./api/sendResetPasswordEmail').sendResetPasswordEmail;
const expresstest = require('./api/expresstest').expresstest;

module.exports.sendNotification = sendNotification;
module.exports.scheduleCallout = scheduleCallout;
module.exports.sendInventoryClientEmail = sendInventoryClientEmail;
module.exports.sendInventoryTeamEmail = sendInventoryTeamEmail;
module.exports.sendPlanEmail = sendPlanEmail;
module.exports.everyFiveMinute = everyFiveMinute;
module.exports.addJobTicketZoho = addJobTicketZoho;
module.exports.quarterlyTasks = quarterlyTasks;
module.exports.uploadDocument = uploadDocument;
module.exports.downloadDocument = downloadDocument;
module.exports.sendWelcomeEmail = sendWelcomeEmail;
module.exports.sendAdditionalRequestEmail = sendAdditionalRequestEmail;
module.exports.sendResetPasswordEmail = sendResetPasswordEmail;
module.exports.expresstest = expresstest;
