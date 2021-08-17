import { useState } from 'react'
import AppCollapse from '@components/app-collapse'
import moment from "moment"
import { TabContent, TabPane, Nav, NavItem, NavLink, ListGroup, ListGroupItem, Card, Col, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter  } from 'reactstrap'

import { auth, storage } from "../../utility/nhost"
import { toast } from "react-toastify"
import axios from "axios"
import Avatar from "@components/avatar"
import { Trash } from 'react-feather'

// Toast Component
const ToastComponent = ({ title, icon, color }) => (
  <Fragment>
    <div className="toastify-header pb-0">
      <div className="title-wrapper">
        <Avatar size="sm" color={color} icon={icon} />
        <h6 className="toast-title">{title}</h6>
      </div>
    </div>
  </Fragment>
)

const TabsVerticalLeft = ({data, propertyLoading}) => {
  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
  const [deleteId, setDeleteId] = useState(null)
  const [modalAlert, setModalAlert] = useState(null)
  const [active, setActive] = useState('1')
  
  const openModalAlert = (id) => {
    setDeleteId(id)
    setModalAlert(true)
  }

  const toggleModalAlert = () => {
    setModalAlert(!modalAlert)
  }

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const RowContent = ({data: client}) => (
    <div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>ID: </h5> 
      <h6 className='mb-1 ml-1'>{client.id}</h6>
    </div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Full Name: </h5>
      <h6 className='mb-1 ml-1'>{client.full_name}</h6>
    </div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Account Type: </h5>
      <h6 className='mb-1 ml-1'>{client.account_type}</h6>
    </div>
  </div>
  )

  const CollapseDefault = ({data}) => <AppCollapse data={data} type='border' />

  const CalloutPicture = ({picture}) => {
    return <div style={{width: "250px", margin:4}}>
     {picture ? <a href={picture} target="_blank"><img src={picture} style={{width: "100%", height: "250px", objectFit: "cover",  borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10}}/></a> : <div style={{width: "100px", height: "100px", borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10, display: "flex", justifyContent: "center", alignItems: "center"}}><p style={{fontSize: "12px", fontWeight: "bold", margin: 0}}>NO PICTURE</p></div>}
     </div>
  }
  const management_report = data?.management_report
  const market_report = data?.market_report
  const monthly_services_report = data?.monthly_services_report
  const material_warranty_report = data?.material_warranty_report
  const propertyOwnedClients = data?.property_owned
  const prop_owned_count = propertyOwnedClients?.length
  const propertyLeasedClients = data?.lease
  const prop_lease_count = propertyLeasedClients?.length
  const property_owneds_modified = data?.property_owned ? propertyOwnedClients.map((prop, i) => ({
      title: `Client email: ${prop.client.email}`,
      content: <RowContent data={prop.client} count={prop_owned_count} />
    })) : [
      {
        title: `No data Available`,
        content: <div></div>
      }
    ]

    const property_leased_modified = data?.lease ? propertyLeasedClients.map((prop, i) => ({
      title: `Client email: ${prop.client.email}`,
      content: <RowContent data={prop.client} count={prop_lease_count} />
    })) : [
      {
        title: `No data Available`,
        content: <div></div>
      }
    ]

  const ReportList = ({item}) => (
    <ListGroupItem>
      <Row className="d-flex align-items-center">
        <Col sm="1">
        ID: {item.id}
        </Col>
      <Col>
      Year: {moment(item.report_upload_date).format("YYYY")}
      </Col>
      <Col>
      Month: {moment(item.report_upload_date).format("MMMM")}
      </Col>
      <Col>
      <Button color='primary' className="mr-1" size="sm" onClick={() => openInNewTab(item.report_location)}>
        View Report
      </Button>
      </Col>
      <Col sm="1">
        <Button color='danger' className="btn-icon" size="sm" onClick={() => { openModalAlert(item.id) }}>
          <Trash size={15} />
        </Button>
      </Col>
      </Row>
      {/* {itemKey.split("_").map(value => value.charAt(0).toUpperCase() + value.slice(1)).join(" ")} */}
    </ListGroupItem>
  )
  const ItemValue = ({item, itemKey}) => (
    <ListGroupItem>
      <Row>
      <Col>
      Year: {item[itemKey]}
      </Col>
      <Col>
      Month
      </Col>
      <Col>
      View Report
      </Col>
      </Row>
      {/* {itemKey.split("_").map(value => value.charAt(0).toUpperCase() + value.slice(1)).join(" ")} */}
    </ListGroupItem>
  )
  return (
    <div className='nav-vertical'>
      <Nav tabs className='nav-left'>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            Current Owner
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Current Tenant
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
          >
            Management Reports
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '4'}
            onClick={() => {
              toggle('4')
            }}
          >
            Market Reports
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '5'}
            onClick={() => {
              toggle('5')
            }}
          >
            Monthly Status Report
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '6'}
            onClick={() => {
              toggle('6')
            }}
          >
            Material Warranty Report
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
        <h1>Current Owner Details</h1>
        <div>{propertyLoading ? <div></div> : <CollapseDefault data={property_owneds_modified} />}</div>
        
        </TabPane>
        <TabPane tabId='2'>
        <h1>Current Tenant Details</h1>
        <CollapseDefault data={property_leased_modified} />
        </TabPane>
        <TabPane tabId='3'>
        <h1>Management Reports</h1>
        <ListGroup flush>
            {management_report?.length > 0 ? management_report.map(item => (
              <ReportList item={item} />
            )) : <div>No data Available</div>}
            </ListGroup>
        </TabPane>
        <TabPane tabId='4'>
        <h1>Market Reports</h1>
        <ListGroup flush>
            {market_report?.length > 0 ? market_report.map(item => (
              <ReportList item={item} />
              )) : <div>No data Available</div>}
            </ListGroup>
        </TabPane>
        <TabPane tabId='5'>
        <h1>Monthly Status Report</h1>
            <ListGroup flush>
            {monthly_services_report?.length > 0 ? monthly_services_report.map(item => (
              <ReportList item={item} />
              )) : <div>No data Available</div>}
            </ListGroup>
        </TabPane> <TabPane tabId='6'>
        <h1>Material Warranty Report</h1>
        <ListGroup flush>
            {material_warranty_report?.length > 0 ? material_warranty_report?.map(item => (
              <ReportList item={item} />
              )) : <div>No data Available</div>}
            </ListGroup>
        </TabPane>
      </TabContent>
      <Modal
      isOpen={modalAlert}
      toggle={toggleModalAlert}
      className='modal-dialog-centered'
      modalClassName="modal-danger"
    >
      <ModalHeader toggle={toggleModalAlert}>Delete Record</ModalHeader>
      <ModalBody>
        Are you sure you want to delete? {deleteId}
      </ModalBody>
      <ModalFooter>
        <Button color="danger" >
          Delete
        </Button>
        <Button color='secondary' onClick={toggleModalAlert} outline>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
    </div>
  )
}
export default TabsVerticalLeft
