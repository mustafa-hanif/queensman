// https://hasura-cf57bf4d.nhost.app/v1/graphql
// https://backend-cf57bf4d.nhost.app
// secret 9f3c57cbf94b42e7295071d31df3e6e8

// https://hasura-8106d23e.nhost.app/v1/graphql
// https://backend-8106d23e.nhost.app
// secret d71e216c844d298d91fbae2407698b22

// https://meqmfvxx0d.execute-api.us-east-1.amazonaws.com/production

// https://y8sr1kom3g.execute-api.us-east-1.amazonaws.com/dev/


const NHOST_STAGING = 'cf57bf4d'
const NHOST_PROD = '8106d23e'
const SERVERLESS_STAGING = 'y8sr1kom3g'
const SERVERLESS_PROD = 'meqmfvxx0d'

let DOMAIN = `https://${SERVERLESS_STAGING}.execute-api.us-east-1.amazonaws.com/dev`
let HASURA = `https://backend-${NHOST_STAGING}.nhost.app`
let ENDPOINT = `https://hasura-${NHOST_STAGING}.nhost.app/v1/graphql`
if (process.env.VERCEL_ENV === 'production') {
    DOMAIN = `https://${SERVERLESS_PROD}.execute-api.us-east-1.amazonaws.com/production`
    HASURA = `https://backend-${NHOST_PROD}.nhost.app`
    ENDPOINT = `https://hasura-${NHOST_PROD}.nhost.app/v1/graphql`
}
module.exports = {
    DOMAIN,
    HASURA,
    ENDPOINT
    //  DOMAIN: "https://meqmfvxx0d.execute-api.us-east-1.amazonaws.com/production"
    // Change domain to above url for produciton dev
}