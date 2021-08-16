
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'icemelt7',
  applicationName: 'queensman-api-app',
  appUid: 'undefined',
  orgUid: '6fa74649-1093-466e-ab02-9fb5c77e87c6',
  deploymentUid: 'd3f4d013-1fb7-47d5-b355-cf46ec4da72a',
  serviceName: 'queensman-api',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'dev',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '4.2.0',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'queensman-api-dev-addJobTicketZoho', timeout: 6 };

try {
  const userHandler = require('./handler.js');
  module.exports.handler = serverlessSDK.handler(userHandler.addJobTicketZoho, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}