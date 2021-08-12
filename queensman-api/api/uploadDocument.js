const fetchGraphQL = require('../lib/graphql').fetchGraphQL;
const uploadDocument = async (event) => {
  const params = new URLSearchParams(event.body);
  const { errors, data } = await fetchGraphQL(
    `mutation MyMutation($client_email: String = "", $document_name: String = "", $document_zoho_id: String = "") {
      insert_documents_one(object: {client_email: $client_email, document_name: $document_name, document_zoho_id: $document_zoho_id}) {
        document_name
      }
    }`,
    'MyMutation',
    {
      client_email: '' + params.get('client'),
      document_zoho_id: '' + params.get('documents_id'),
      document_name: '' + params.get('document_event_id') + ', ' + params.get('document_id')
    }
  );
  if (!errors) {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Succesfully added',
        },
        null,
        2
      )
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'failed added',
      },
      null,
      2
    )
  };
}

module.exports = { uploadDocument }
