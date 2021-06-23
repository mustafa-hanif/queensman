// ** React Imports
import { useState } from 'react'
import "./styles.css"
import Button from "./Button"
import Popup  from "./Popup"

import 'react-bootstrap'
// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'
import ReactDOM, { render } from 'react-dom'
import paginator from 'react-bootstrap-table2-paginator'
 
// ** Third Party Components
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
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
    <>
          <Breadcrumbs breadCrumbTitle='Clients' breadCrumbParent='Home' breadCrumbActive='Clients List' />

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
    <Tab class="active">Owned Properties</Tab>
      <Tab class="active" >Client Details</Tab>
      <Tab class="active">Leased Properties</Tab>

    </TabList>

    <TabPanel>
    <h3 class="dt">Owned Properties</h3>
    <p id='client_id' class="details">No owned property(s) found.

</p>


        </TabPanel>
    <TabPanel name="client" >
    <h3 class="dt">Details</h3>
    <h5 class="modal-client">CLIENT DETAILS</h5>

                  <p key={client.id} value={client.full_name} class="details"> {client.full_name}</p>
                  <p id='client_phone' class="details">Phone: +428717293</p> 
                  <p id='client_email' class="details"> {client.email}</p>
                  <p id='client_phone' class="details">Client Phone: spence@gmail.com</p> 
                  <p id='client_sec_email' class="details">Client Other Email: spence@gmail.com</p>
                  <p id='client_sec_phone' class="details">Client Other: spence@gmail.com</p>
                  <p id='client_account_type' class="details">Client Other: spence@gmail.com</p>
                   <p id="client_address" class="details">Address: G13 Street 4</p> 
                  <p id='callout_id' class="details">Callout ID: 2791ss</p>
                  <p id="callout_job_type" class="details">Job Type: Woodworks</p>
                  <p id='callout_req_time' class="details">Request Time: 9:30pm 21-03-2019ss</p>
                  <p id='callout_urgency' class="details">Urgency Level: 20ss</p>
                  <p id='description' class="details">Description: 4.5ss</p>
                  <p id='prop_id' class="details">Property ID: undefinedss</p>
                  <p id='prop_address' class="details">Property Address: 3592 Austen Dem Suite 905 Southss</p>
                  <p id='prop_community' class="details">Comunity: Rebekah Inletss</p>
                  <p id="prop_city" class="details">City: Cicerofurtss</p>
                  <p id="years_native" class="details">City: Cicerofurtss</p>
                  <p id="referred_by" class="details">City: Cicerofurtss</p>
                  <p id="other_properties" class="details">City: Cicerofurtss</p>
                  <p id="contract_start_date" class="details">City: Cicerofurtss</p>
                  <p id="contract_end_date" class="details">City: Cicerofurtss</p>
                  <p id="sign_up_time" class="details">City: Cicerofurtss</p>
    
    
    </TabPanel>
    <TabPanel>
    <h3 class="dt">Leased Properties</h3>
    <p id='client_id' class="details">No Leased property(s) found.

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

   </>
  )
}

export default Clients

