// ** React Imports
import { useState, Fragment } from 'react'
import Popup from './Popup'
import "./styles.css"

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs7'

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
      <Tabs>
    <TabList>
      <Tab>ALL</Tab>
      <Tab>REQUESTED</Tab>
      <Tab>PLANNED</Tab>
      <Tab>ASSIGNED</Tab>
      <Tab>IN PROGRESS</Tab>
      <Tab>CLOSED</Tab>
      <Tab>CANCELLED</Tab>

    </TabList>

    <TabPanel>
    <table name="client"  class="table">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
      <th scope="col">Password</th>
      <th scope="col">Phone</th>
      <th scope="col">Account Type</th>
      <th scope="col">Active/Inactive</th>
      <th scope="col">Details</th>

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
        <input class="btn"
      type="button"
      value="View Details"
      onClick={togglePopup}
    />
    {isOpen && <Popup
      content={<>
          <Tabs>
            <h4 class="modal-title">Client Dtails</h4>
    <TabList>
    <Tab class="active">Current Owner </Tab>
      <Tab class="active" >Tenant</Tab>
      <Tab class="active">Property Deatils</Tab>

    </TabList>

    <TabPanel>
    <h3 class="dt">Current Owner Details</h3>
    <p id='client_id' class="details">ID :  1</p>
    <p id='client_id' class="details">Name :  Kamran</p>
    <p id='client_id' class="details">Phone : 0141544415</p>
    <p id='client_id' class="details">Email :   kamran@yahoo.com</p>
    <p id='client_id' class="details">IsActive :  Active</p>


        </TabPanel>
    <TabPanel name="client" >
    <h5 class="modal-client">Current Tenant Details
</h5>

<p id='client_id' class="details">ID :  1</p>
    <p id='client_id' class="details">Name :  Kamran</p>
    <p id='client_id' class="details">Phone : 0141544415</p>
    <p id='client_id' class="details">Email :   kamran@yahoo.com</p>
    <p id='client_id' class="details">Lease Start :   Undefined</p>
    <p id='client_id' class="details">Lease End :   Undefined</p>
    <p id='client_id' class="details">IsActive :  Active</p>

    
    </TabPanel>
    <TabPanel style={{height:230}}>
    <h3 class="dt">Property Deatisl</h3>
    <p id='client_id' class="details">No material report(s) found.

.

</p>


        </TabPanel>
  </Tabs>

      </>
      
    }
      handleClose={togglePopup}
    />}        </td>
     
          </tr>

      ))}
         
  </tbody>
</table>
    </TabPanel>
    <TabPanel>
    <Col sm='12'>
          <TableZeroConfig />
        </Col>
    </TabPanel>
  </Tabs>
     
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
