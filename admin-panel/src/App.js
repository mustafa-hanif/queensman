// ** Router Import
import Router from './router/Router'
import { NhostApolloProvider } from "@nhost/react-apollo"
import { NhostAuthProvider } from "@nhost/react-auth"
import { auth } from "./utility/nhost"
import { ENDPOINT } from './_config'

const App = props => <NhostAuthProvider auth={auth}>
  <NhostApolloProvider auth={auth} gqlEndpoint={ENDPOINT} >
    <Router />
  </NhostApolloProvider>
</NhostAuthProvider>


export default App
