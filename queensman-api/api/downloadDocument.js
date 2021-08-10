/* eslint-disable new-cap */
const FormData = require('form-data');
const fetch = require('node-fetch');

const downloadDocument = async (event) => {
  // console.log(event);
  // const params = new URLSearchParams(event.body);
  const documentId = event.queryStringParameters.document_id;

  const formdata = new FormData();
  formdata.append('document_id', documentId);

  const requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };

  const response = await fetch('https://www.zohoapis.com/crm/v2/functions/uploaddocument/actions/execute?auth_type=apikey&zapikey=1003.db2c6e3274aace3b787c802bb296d0e8.3bef5ae5ee6b1553f7d3ed7f0116d8cf', requestOptions);
  const text = await response.json();
  const file = text.details.output;
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="contract.pdf"'
    },
    body: file,
    isBase64Encoded: true
  };
}

module.exports = { downloadDocument }
