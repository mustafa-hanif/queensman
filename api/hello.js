import sendNotification from './lib/sendNotification';

module.exports = async (req, res) => {
  sendNotification({ token: 'ExponentPushToken[ND9cDRCLOD4_IQZGeDwsyR]', message: "Hello world"})
};

// sendNotification({ token: 'ExponentPushToken[ND9cDRCLOD4_IQZGeDwsyR]', message: "Hello world"})