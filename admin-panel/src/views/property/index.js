// ** React Imports
import { useState, Fragment } from 'react'
import Popup from './Popup'
import "./styles.css"


// ** Third Party Components

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

// ** Tables
// import TableExpandable from './TableExpandable'
import TableZeroConfig from './TableZeroConfig'
// import TableWithButtons from './TableWithButtons'
// import TableMultilingual from './TableMultilingual'
import { Card, CardHeader, CardTitle, CardBody, Input, Row, Col, Label, CustomInput, Button } from 'reactstrap'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { gql, useLazyQuery, useQuery } from "@apollo/client"

const GET_CLIENT = gql`
query GetClient {
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
          <Card>
        <CardHeader>
          <CardTitle tag='h4'>View Properties</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md='4'>
            
            <Input
            placeholder="Search Property Here"
              className='ml-10 w-100'
              type='text'
            />
            </Col>
           

            <Col md='2'>
            
            <Button.Ripple className="col-md-10" color='primary'>
            Add New Property
          </Button.Ripple>
            </Col>
           

            <Col md='2'>
            
            <Button.Ripple className="col-md-10" color='primary'>
            Modify
          </Button.Ripple>
            </Col>

            <Col md='2'>
            
            <Button.Ripple className="col-md-10" color='primary'>
            Delete
          </Button.Ripple>
            </Col>

            <Col md='2'>
            
            <Button.Ripple className="col-md-10" color='primary'>
            Assign New Property
          </Button.Ripple>
            </Col>
           
          </Row>
        </CardBody>
      </Card>
      <Row>
      <Tabs>
    <TabList>
      <Tab>Owned</Tab>
      <Tab>Leased</Tab>
    </TabList>

    <TabPanel>
    <table name="client"  class="table">
  <thead>
    <tr>
      <th scope="col">Clinet Nmae</th>
      <th scope="col">Address</th>
      <th scope="col">Property Type</th>
      <th scope="col">Leased/Owned</th>
      <th scope="col">Community</th>
      <th scope="col">City</th>
      <th scope="col">Country</th>
      <th scope="col">Comments</th>
      <th scope="col">Active/Inactive</th>
      <th scope="col"> Details</th>

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
        <td>

        </td>
        <td>

        </td>
        <td>
          
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
