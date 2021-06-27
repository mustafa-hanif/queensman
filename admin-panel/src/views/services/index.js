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
      <th scope="col">ID</th>
      <th scope="col">Callout By</th>
      <th scope="col">Property Address</th>
      <th scope="col">Job Type</th>
      <th scope="col">Status</th>
      <th scope="col">Urgency</th>
      <th scope="col">Category</th>
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

        </td>
        <td>

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
            <h4 class="modal-title">Job Dtails</h4>
    <TabList>
    <Tab class="active">CallOut Details </Tab>
      <Tab class="active" >Client Details</Tab>
      <Tab class="active">Ops Team Details</Tab>
      <Tab class="active">Property Details</Tab>
      <Tab class="active">Callout Images</Tab>
      <Tab class="active">Pre Images</Tab>
      <Tab class="active">Post Images</Tab>
      <Tab class="active">Service Notes</Tab>
      <Tab class="active">Job History</Tab>


    </TabList>

    <TabPanel>
    <h3 class="dt">CallOut Details</h3>
    <p id='client_id' class="details">Callout ID :  3949</p>
    <p id='client_id' class="details">Job Type :  Plumbing</p>
    <p id='client_id' class="details">Request Time : June 12</p>
    <p id='client_id' class="details">Urgency Level :  Medium</p>
    <p id='client_id' class="details">Status :  Requested</p>
    <p id='client_id' class="details">Category :  Uncategory</p>
    <p id='client_id' class="details">Discription :  null</p>
    <p id='client_id' class="details">Instruction :  null</p>
    <p id='client_id' class="details">Action :  null</p>
    <p id='client_id' class="details">Solution :  null</p>


        </TabPanel>
    <TabPanel name="client" >
    <h5 class="modal-client">Client Details
</h5>

<p id='client_id' class="details">ID :  1</p>
    <p id='client_id' class="details">Name :  Kamran</p>
    <p id='client_id' class="details">Email :   kamran@yahoo.com</p>
  
    </TabPanel>
    <TabPanel style={{height:230}}>
    <h3 class="dt">OPS TEAM DETAILS</h3>
    <p id='client_id' class="details">No ops team details found

.

</p>


        </TabPanel>

        <TabPanel style={{height:230}}>
    <h3 class="dt">Property Details</h3>
    <p id='client_id' class="details">Property ID  :  1</p>
    <p id='client_id' class="details">Address  :  Villa 2 street 6</p>
    <p id='client_id' class="details">Commuity  :   Damac Hills</p>
    <p id='client_id' class="details">City  :  Dubai</p>
    <p id='client_id' class="details">Country  :  UAE</p>
    <p id='client_id' class="details">Type  :  4 bedroom</p>


        </TabPanel>

        <TabPanel style={{height:230}}>
    <h3 class="dt">CallOut Image</h3>
<input type="file" class=""form-control/>
<br />
<br />
<br />

<button>ADD IMAGE</button>

        </TabPanel>  
        <TabPanel style={{height:230}}>
    <h3 class="dt">Pre Image</h3>
<input type="file" class=""form-control/>
<br />
<br />
<br />

<button>ADD IMAGE</button>

        </TabPanel>
        <TabPanel style={{height:230}}>
    <h3 class="dt">Post Image</h3>
<input type="file" class=""form-control/>
<br />
<br />
<br />

<button>ADD IMAGE</button>

        </TabPanel>

        <TabPanel style={{height:230}}>
    <h3 class="dt">Service Notes</h3>
    <p id='client_id' class="details">No service notes details found

.

</p>
        </TabPanel>
        <TabPanel style={{height:230}}>
    <h3 class="dt">Job History</h3>
    <p id='client_id' class="details">No job History details found

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
    <table name="client"  class="table">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Callout By</th>
      <th scope="col">Property Address</th>
      <th scope="col">Job Type</th>
      <th scope="col">Status</th>
      <th scope="col">Urgency</th>
      <th scope="col">Category</th>
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

        </td>
        <td>
          
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
    <table name="client"  class="table">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Callout By</th>
      <th scope="col">Property Address</th>
      <th scope="col">Job Type</th>
      <th scope="col">Status</th>
      <th scope="col">Urgency</th>
      <th scope="col">Category</th>
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

        </td>
        <td>
          
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
    <table name="client"  class="table">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Callout By</th>
      <th scope="col">Property Address</th>
      <th scope="col">Job Type</th>
      <th scope="col">Status</th>
      <th scope="col">Urgency</th>
      <th scope="col">Category</th>
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

        </td>
        <td>
          
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
    <table name="client"  class="table">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Callout By</th>
      <th scope="col">Property Address</th>
      <th scope="col">Job Type</th>
      <th scope="col">Status</th>
      <th scope="col">Urgency</th>
      <th scope="col">Category</th>
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

        </td>
        <td>
          
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
    <table name="client"  class="table">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Callout By</th>
      <th scope="col">Property Address</th>
      <th scope="col">Job Type</th>
      <th scope="col">Status</th>
      <th scope="col">Urgency</th>
      <th scope="col">Category</th>
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

        </td>
        <td>
          
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
    <table name="client"  class="table">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Callout By</th>
      <th scope="col">Property Address</th>
      <th scope="col">Job Type</th>
      <th scope="col">Status</th>
      <th scope="col">Urgency</th>
      <th scope="col">Category</th>
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

        </td>
        <td>
          
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
