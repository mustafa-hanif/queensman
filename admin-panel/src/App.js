// ** Router Import
import Router from './router/Router'
import { NhostApolloProvider } from "@nhost/react-apollo"
import { NhostAuthProvider } from "@nhost/react-auth"
import { auth } from "./utility/nhost"

const App = props => <NhostAuthProvider auth={auth}>
  <NhostApolloProvider auth={auth} gqlEndpoint="https://hasura-cf57bf4d.nhost.app/v1/graphql">
    <Router />
  </NhostApolloProvider>
</NhostAuthProvider>


export default App
