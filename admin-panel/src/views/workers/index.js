// ** React Imports
import { useState, Fragment } from 'react'
import Popup from './Popup'
import "./styles.css"

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs6'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

// ** Tables
// import TableExpandable from './TableExpandable'
import TableZeroConfig from './TableZeroConfig'
// import TableWithButtons from './TableWithButtons'
// import TableMultilingual from './TableMultilingual'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { gql, useLazyQuery, useQuery } from "@apollo/client"

const GET_CLIENT = gql`
query MyQuery {
  client {
    email
    full_name
    password
  phone
  account_type
  active
    
  }
}
`

function Clients() {
  const [isOpen, setIsOpen] = useState(false)
 
  const togglePopup = () => {
    setIsOpen(!isOpen)
  }
 
  const { loading, error, data } = useQuery(GET_CLIENT)

  if (loading) return 'Loading...'
  if (error) return `Error!-+ ${error.message}`
  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle='Clients' breadCrumbParent='Home' breadCrumbActive='Clients List' />
      <Row>
      <table name="client"  class="table">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
      <th scope="col">Pasword</th>
      <th scope="col">Phone</th>
      <th scope="col">Description</th>
      <th scope="col">Active/Inactive</th>


    </tr>
  </thead>
  <tbody>
  {data.client.map(client => (
      <tr>
  
        <td key={client.id} value={client.full_name}>
          {client.full_name}
        </td>
        <td key={client.id} value={client.email}>
          {client.email}
        </td>
        <td key={client.id} value={client.password}>
          {client.password}
        </td>
        <td key={client.id} value={client.phone}>
          {client.phone}
        </td>
        <td key={client.id} value={client.account_type}>
          {client.account_type}
        </td>
        <td key={client.id} value={client.active}>
          {client.active}
        </td>
        <td>

        </td>
        <td>
          
        </td>
          </tr>

      ))}
         
  </tbody>
</table>
        {/* <Col sm='12'>
          <TableWithButtons />
        </Col>
        <Col sm='12'>
          <TableExpandable />
        </Col>
        <Col sm='12'>
          <TableMultilingual />
        </Col> */}
      </Row>
    </Fragment>
  )
}

export default Clients
