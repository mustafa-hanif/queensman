// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Tables
// import TableExpandable from './TableExpandable'
import TableZeroConfig from './TableZeroConfig'
// import TableWithButtons from './TableWithButtons'
// import TableMultilingual from './TableMultilingual'
import Avatar from '@components/avatar'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { gql, useLazyQuery, useQuery } from "@apollo/client"

const GET_CLIENT = gql`
query MyQuery {
  client {
    email
    full_name
    gender
    occupation
    organization
    phone
  }
}
`

function Clients({ onClientSelected }) {
  const { loading, error, data } = useQuery(GET_CLIENT)

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`

  return (
    <>
    <table name="client" onChange={onClientSelected} id="customers">
  <tr>
    <th>Company</th>
    <th>Contact</th>
    <th>Country</th>
  </tr>
  {data.client.map(client => (
      <tr>
        <td key={client.id} value={client.email}>
          {client.email}
        </td>
        <td key={client.id} value={client.full_name}>
          {client.full_name}
        </td>
          </tr>

      ))}
          
 
</table>

   
   </>
  )
}

export default Clients
