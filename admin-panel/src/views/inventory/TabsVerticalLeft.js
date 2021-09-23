import { useState, Fragment } from 'react'
import AppCollapse from '@components/app-collapse'
import { Spinner, TabContent, TabPane, Nav, NavItem, NavLink, ListGroup, ListGroupItem, Card, Col, Row, Button, ButtonGroup,  Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Badge  } from 'reactstrap'
import { Check, Upload, XCircle, Info, X } from 'react-feather'
import Rooms from './Rooms'
import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client"
import { auth, storage } from "../../utility/nhost"
import moment from 'moment'
import { toast } from "react-toastify"
import axios from "axios"
import Avatar from "@components/avatar"
import { DOMAIN, HASURA } from '../../_config'

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
const UPDATE_TO_REVIEW = gql`
mutation UpdateToReview($approved: smallint = 1, $id: Int!) {
  update_inventory_report_by_pk(pk_columns: {id: $id}, _set: {approved: $approved}) {
    id
  }
}
`
const UPDATE_TO_UNAPPROVE = gql`
mutation UpdateToUnapprove($approved: smallint = 0, $id: Int!) {
  update_inventory_report_by_pk(pk_columns: {id: $id}, _set: {approved: $approved}) {
    id
  }
}
`
const UPDATE_TO_APPROVAL = gql`
mutation UpdateToReview($approved: smallint = 2, $id: Int!) {
  update_inventory_report_by_pk(pk_columns: {id: $id}, _set: {approved: $approved}) {
    id
  }
}
`
const UPDATE_TO_APPROVE = gql`
mutation UpdateToReview($approved: smallint = 3, $id: Int!) {
  update_inventory_report_by_pk(pk_columns: {id: $id}, _set: {approved: $approved}) {
    id
  }
}
`

const ADD_INVENTORY_PDF = gql`
mutation AddInventoryPdf($inventory_report_id: Int!, $property_id: Int!, $report_location: String = "") {
  insert_inventory_report_pdf_one(object: {inventory_report_id: $inventory_report_id, property_id: $property_id, report_location: $report_location}) {
    id
  }
}
`
const UPDATE_INVENTORY_PDF = gql`
mutation MyMutation($id: Int!, $report_location: String) {
  update_inventory_report_pdf(where: {id: {_eq: $id}}, _set: {report_location: $report_location}) {
    affected_rows
    returning {
      report_updated_date
    }
  }
}

`

const TabsVerticalLeft = ({item, allProperty, GET_INVENTORY}) => {
  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
  const [active, setActive] = useState("1")
  const [loading, setLoading] = useState(false)
  const userName = JSON.parse(localStorage.getItem('userData')).user.email
  const [declineModal, setDeclineModal] = useState(false)
  const [approveModal, setApproveModal] = useState(false)
  const [approveStatus, setApproveStatus] = useState(item?.approved)
  const [pdf, setPdf] = useState(null)
  const [pdfLocation, setPdfLocation] = useState(null)
  const [uploadButton, setUploadButton] = useState(false)
  const [setToReviewStage, { loading: reviewStageLoading, data: reviewStage, reviewStageError }] = useMutation(UPDATE_TO_REVIEW, { refetchQueries: [{ query: GET_INVENTORY }] })
  const [setToUnApproveStage, { loading: unApproveStageLoading, data: unApproveStage, unApproveStageError }] = useMutation(UPDATE_TO_UNAPPROVE, { refetchQueries: [{ query: GET_INVENTORY }] })
  const [setToApprovalStage, { loading: approvalStageLoading, data: approvalStage, approvalStageError }] = useMutation(UPDATE_TO_APPROVAL, { refetchQueries: [{ query: GET_INVENTORY }] })
  const [setToApproveStage, { loading: approveStageLoading, data: approveStage, approveStageError }] = useMutation(UPDATE_TO_APPROVE, { refetchQueries: [{ query: GET_INVENTORY }] })
  const [uploadPDF, { loading: uploadPDFLoading, data: uploadPDFdata, uploadPDFError }] = useMutation(ADD_INVENTORY_PDF, { refetchQueries: [{ query: GET_INVENTORY }] })
  const [uploadUpdatePDF, { loading: uploadUpdatePDFLoading, data: uploadUpdatePDFdata, uploadUpdatePDFError }] = useMutation(UPDATE_INVENTORY_PDF, { refetchQueries: [{ query: GET_INVENTORY }] })

  if (allProperty?.client) {
    item = {...item, ...allProperty}
  }
  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }


  const decline = (decline) => {
    if (decline === "decline") {
      setToUnApproveStage({variables: {id: item?.id}}) //Unapproved Stage
      setApproveStatus(0)
      setDeclineModal(false)
      toast.error(
        <ToastComponent title="Report set to unapproved stage" color="danger" icon={<X />} />,
        {
          autoClose: 4000,
          hideProgressBar: false,
          closeButton: false
        }
      )
    } else {
      setDeclineModal(true)
    }
    
  }

  const acceptApprove = async (inventory_report_pdf, property, inventory_rooms, client) => {
    setToApproveStage({variables: {id: item?.id}}) //Final Stage Approved 
      setApproveStatus(3)
      setApproveModal(false)
      setLoading(true)

      try {
        const res = await axios.post(
          `${DOMAIN}/sendInventoryClientEmail`,
          {
            inventory_report_pdf,
            property,
            inventory_rooms,
            client
          }
        )
      } catch (e) {
        console.log("ERROR")
        console.log(e)
      }

      try {
        const res = await axios.post(
          `${DOMAIN}/sendInventoryTeamEmail`,
          {
            inventory_report_pdf,
            property,
            inventory_rooms,
            client
          }
        )
      } catch (e) {
        console.log("ERROR")
        console.log(e)
      }
      setLoading(false)
      toast.success(
        <ToastComponent title="Report approved" color="success" icon={<Check />} />,
        {
          autoClose: 4000,
          hideProgressBar: false,
          closeButton: false
        }
      )
  }

  const checkMark = (role) => {
    if (role === "superAdmin") {
      setApproveModal(true) //Final Stage Approved 
    } else if (role === "admin") {
      setToApprovalStage({variables: {id: item?.id}}) //Approval Stage
      setApproveStatus(2)
      toast.warn(
        <ToastComponent title="Report is now in approval stage" color="warning" icon={<Info />} />,
        {
          autoClose: 4000,
          hideProgressBar: false,
          closeButton: false
        }
      )
    }  else  {
      if (!pdfLocation) {
        alert("Please upload pdf first")
      } else {
        setToReviewStage({variables: {id: item?.id}}) //Review Stage
        setApproveStatus(1)
        toast.info(
          <ToastComponent title="Report is now in review stage" color="info" icon={<Check />} />,
          {
            autoClose: 4000,
            hideProgressBar: false,
            closeButton: false
          }
        )
      }
    }
  }

  const cancel = (role) => {
    if (role === "superAdmin") {
      setToApprovalStage({variables: {id: item?.id}}) //Approval Stage
      setApproveStatus(2)
      toast.warn(
        <ToastComponent title="Report is now in approval stage" color="warning" icon={<Info />} />,
        {
          autoClose: 4000,
          hideProgressBar: false,
          closeButton: false
        }
      )
    } else if (role === "admin") {
      setToReviewStage({variables: {id: item?.id}}) //Review Stage
      setApproveStatus(1)
      toast.info(
        <ToastComponent title="Report is now in review stage" color="info" icon={<Check />} />,
        {
          autoClose: 4000,
          hideProgressBar: false,
          closeButton: false
        }
      )
    } else {
      setToUnApproveStage({variables: {id: item?.id}}) //Unapproved Stage
      setApproveStatus(0)
      toast.error(
        <ToastComponent title="Report set to unapproved stage" color="danger" icon={<X />} />,
        {
          autoClose: 4000,
          hideProgressBar: false,
          closeButton: false
        }
      )
    }
    
  }

  const client = item?.client //array
  const inventory_rooms = item?.inventory_rooms //array
  const property = item?.property
  const inventory_report_pdf = item?.inventory_report_pdfs?.[0]

  const uploadPdf = async () => {
   if (pdf) {
    if (inventory_report_pdf?.report_location) { //If file already exists
      setLoading(true)
      setTimeout(() => {
        setUploadButton(false)
      }, 1000)
      try {
        await storage.put(`/inventory_report/${pdf.name}`, pdf) //upload in storage
          setLoading(false)
          await uploadUpdatePDF({variables: { //update file
            id: inventory_report_pdf.id,
            report_location: `${HAUSRA}/storage/o/inventory_report/${pdf.name}`
          }})
          setPdfLocation(`${HAUSRA}/storage/o/inventory_report/${pdf.name}`)
          toast.success(
            <ToastComponent title="File Uploaded" color="success" icon={<Check />} />,
            {
              autoClose: 4000,
              hideProgressBar: false,
              closeButton: false
            }
          )
      } catch (e) {
        console.log(e)
        toast.error(
          <ToastComponent title="Error uploading file" color="danger" icon={<XCircle />} />,
          {
            autoClose: 4000,
            hideProgressBar: false,
            closeButton: false
          }
        )
      }
    } else { //New file upload
      setLoading(true)
      setTimeout(() => {
        setUploadButton(false)
      }, 1000)
      try {
        await storage.put(`/inventory_report/${pdf.name}`, pdf) //Upload in storage
          setLoading(false)
          await uploadPDF({variables: { //Add in db
            inventory_report_id: item.id,
            property_id: property.id, 
            report_location: `${HAUSRA}/storage/o/inventory_report/${pdf.name}`
          }})
          setPdfLocation(`${HAUSRA}/storage/o/inventory_report/${pdf.name}`)
          toast.success(
            <ToastComponent title="File Uploaded" color="success" icon={<Check />} />,
            {
              autoClose: 4000,
              hideProgressBar: false,
              closeButton: false
            }
          )
      } catch (e) {
        console.log(e)
        toast.error(
          <ToastComponent title="Error uploading file" color="danger" icon={<XCircle />} />,
          {
            autoClose: 4000,
            hideProgressBar: false,
            closeButton: false
          }
        )
      }
    }
   }
  }

  const RowContent = ({data: prop}) => (
    <div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>ID: </h5> 
      <h6 className='mb-1 ml-1'>{prop.id}</h6>
    </div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Full Name: </h5>
      <h6 className='mb-1 ml-1'>{prop.full_name}</h6>
    </div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Account Type: </h5>
      <h6 className='mb-1 ml-1'>{prop.account_type}</h6>
    </div>
  </div>
  )

  const CollapseDefault = ({data}) => <AppCollapse data={data} type='border' />
  
  const client_modified = allProperty?.client ? client.map((prop, i) => (
    {
        title: `Client email: ${prop.email}`,
        content: (
          <RowContent data={prop} count={client.length}/>
        )
      }
)) : [
    {
    title: `No data Available`,
    content: (
      <div>
    </div>
    )
  }
]

  const ItemValue = ({item, itemKey}) => (
    <ListGroupItem>
    <span style={{fontWeight: "bold"}}>
      {itemKey.split("_").map(value => value.charAt(0).toUpperCase() + value.slice(1)).join(" ")}: </span> 
      {item[itemKey] ? item[itemKey] : "N/A"}
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
            Client Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Property Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
          >
            Inventory Rooms
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '4'}
            onClick={() => {
              toggle('4')
            }}
          >
            Actions
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
        <h1 className="mb-1">Client Details</h1>
        <CollapseDefault data={client_modified} />
        </TabPane>
        <TabPane tabId='2'>
        <h1 className="mb-1">Property Details</h1>
        <ListGroup flush>
            {property && Object.keys(property).map(itemKey => {
              if ((!["__typename"].includes(itemKey))) {     
                  return (
                    <ItemValue item={property} itemKey={itemKey} key={itemKey}/>
                )                        
              }
              })}
            </ListGroup>
        </TabPane>
        <TabPane tabId='3'>
          <div className="d-flex align-items-center mb-1">
          <h1 className="mr-2 mb-0">Inventory Rooms</h1>
          </div>
          <div className="d-flex align-items-center">
          <h6 className="mr-1">Approved Status:</h6>
          <h6>
          {approveStatus === 0 ? <Badge color='light-danger' pill>
            Unapproved
          </Badge> : approveStatus === 1 ? <Badge color='light-info' pill>
            Review
          </Badge> : approveStatus === 2 ? <Badge color='light-warning' pill>
            Approval
          </Badge> : <Badge color='light-success' pill>
            Approved
          </Badge>}
          </h6>
          
          
          </div>
          
          <h6>Room count: {inventory_rooms.length}</h6>
        <Row className='m-2'>
        {inventory_rooms && inventory_rooms.length === 0 ? <div>No Rooms</div> : inventory_rooms.map((items, i) => (
          <Col md={`${inventory_rooms.length > 2 ? '4' : ''}`}>
          <Rooms inventory_articles={items.inventory_articles} inventory_pictures={items.inventory_pictures} id={items.id} title={items.room} index={(i + 1)}/>
          </Col>
        ))}
        </Row>
        <div>
        </div>
        {/* <ListGroup flush>
            {client && Object.keys(client).map(itemKey => {
              if ((![""].includes(itemKey))) {     
                  return (
                    <ItemValue item={client} itemKey={itemKey} key={itemKey}/>
                )                        
              }
              })}
            </ListGroup> */}
        </TabPane>
        <TabPane tabId='4'>
          <div className="d-flex align-items-center mb-1">
            <h1 className="mr-2">Inventory Actions</h1>
            { (reviewStageLoading || unApproveStageLoading || approvalStageLoading || approveStageLoading || uploadPDFLoading || uploadUpdatePDFLoading || loading) && <Spinner color='primary' />}
          </div>
          {/* To upload files */}
        {userName === "ffakhri@queensman.com" ? <div className="mr-2"> 
        <Row>
          <Col md="2">
          <div>Status</div>
          </Col>
          <Col md="4">
          <div>Review Actions</div>
          </Col>
        </Row>
        <Row>
          <Col md="2">
            {approveStatus === 0 ? <Button color="danger" className="btn" size="sm">
            <span className="align-middle ml-25">Unapproved</span>
          </Button> : approveStatus === 1 ? <Button color="info" className="btn" size="sm">
            <span className="align-middle ml-25">Review</span>
          </Button> : approveStatus === 2 ? <Button color="warning" className="btn" size="sm">
            <span className="align-middle ml-25">Approval</span>
          </Button> : <Button color="success" className="btn" size="sm">
            <span className="align-middle ml-25">Approved</span>
          </Button>}
         
          
          </Col>
          <Col md="4">
            {/* If it is not in review stage */}
            {approveStatus === 0 ?  <ButtonGroup className='mb-1'>
            <Button color='info' className="btn-icon" size="sm" onClick={() => checkMark()}>
              <Check size={15} />
            </Button>
            <Button color='secondary' className="btn-icon" size="sm" disabled>
              <XCircle size={15} />
            </Button>
          </ButtonGroup> :  approveStatus === 1 ? <ButtonGroup className='mb-1'>
            <Button color='secondary' className="btn-icon" size="sm" disabled>
              <Check size={15} />
            </Button>
            <Button color='danger' className="btn-icon" size="sm" onClick={() => cancel()}>
              <XCircle size={15} />
            </Button>
          </ButtonGroup> :  <ButtonGroup className='mb-1'>
            <Button color='secondary' className="btn-icon" size="sm" disabled>
              <Check size={15} />
            </Button>
            <Button color='secondary' className="btn-icon" size="sm" disabled>
              <XCircle size={15} />
            </Button>
          </ButtonGroup>}
         
          </Col>
        </Row>
        <Row className="mt-1">
        <Col>
        {/* If it is not in review or unapproved stage */}
        {approveStatus === 1 && <p className="font-weight-bold text-danger">Status is already in review. Please unapprove it to upload file.</p>}
        { (approveStatus === 0 || approveStatus === 1) && <div> 
          <div className="d-flex align-items-center mb-2">
            <Label>Upload PDF: </Label>
            {approveStatus === 1 ? <Input type="file" name="file" id="exampleFile" disabled onClick={() => alert("")}/> : <Input type="file" name="file" id="exampleFile" onChange={(e) => { setPdf(e.target.files[0]); setUploadButton(true) }}/>}
            {!uploadButton ? <Button color='secondary' size="sm" disabled>
              <Upload size={15} />
              Upload
            </Button> : <Button color='info' size="sm" onClick={() => uploadPdf()}>
              <Upload size={15} />
              Upload
            </Button>}
            
          </div>
          <div className="d-flex align-items-center mb-1">
          {/* <div className="mr-1">PDF selected: {pdf ? <a href="#" target="_blank"><span>{pdf.name}</span></a> : <span>Nothing Selected</span>}</div>
          {pdf && <Button.Ripple className='btn-icon rounded-circle' color='flat-danger' onClick={() => removePdf()}>
                    <XCircle size={16} />
                  </Button.Ripple>} */}
      </div>
      </div>
     } 
     <div className="d-flex align-items-center">
       
       {pdfLocation ? <Button color='primary' size="sm" className="mr-1"  onClick={() => openInNewTab(pdfLocation)}>
           View Uploaded PDF
           </Button> : inventory_report_pdf ?  <Button color='primary' className="mr-1" size="sm" onClick={() => openInNewTab(inventory_report_pdf?.report_location)}>
             View Uploaded PDF
           </Button> :  <Button color='secondary' size="sm" className="mr-1" disabled={true}>
           View Uploaded PDF
           </Button>}
           { pdfLocation ? <div>
               <span className="font-weight-bold">Uploaded at: </span>
               {moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')}
               </div> : inventory_report_pdf && <div>
             <span className="font-weight-bold">Uploaded at: </span>
             {moment(inventory_report_pdf.report_updated_date).format('MMMM Do YYYY, h:mm:ss a')}
             </div>}
     </div>
         </Col>
          
        </Row> 
        {/* admin role */}
        </div> : userName === "opscord@queensman.com" ? <div className="mr-2"> 
        <Row>
          <Col md="2">
          <div>Status</div>
          </Col>
          <Col md="2">
          <div>Review Actions</div>
          </Col>
          { (approveStatus !== 0) && <Col md="4">
          <div>Decline Report</div>
          </Col> }
        </Row>
        <Row>
          <Col md="2">
            {approveStatus === 0 ? <Button color="danger" className="btn" size="sm">
            <span className="align-middle ml-25">Unapproved</span>
          </Button> : approveStatus === 1 ? <Button color="info" className="btn" size="sm">
            <span className="align-middle ml-25">Review</span>
          </Button> : approveStatus === 2 ? <Button color="warning" className="btn" size="sm">
            <span className="align-middle ml-25">Approval</span>
          </Button> : <Button color="Success" className="btn" size="sm">
            <span className="align-middle ml-25">Approved</span>
          </Button>}
         
          
          </Col>
          <Col md="2">
            {approveStatus === 1 ? <ButtonGroup className='mb-1'>
            <Button color='info' className="btn-icon" size="sm" onClick={() => checkMark("admin")}>
              <Check size={15} />
            </Button>
            <Button color='secondary' className="btn-icon" size="sm" disabled>
              <XCircle size={15} />
            </Button>
          </ButtonGroup> : approveStatus === 2 ? <ButtonGroup className='mb-1'>
            <Button color='secondary' className="btn-icon" size="sm" disabled>
              <Check size={15} />
            </Button>
            <Button color='danger' className="btn-icon" size="sm" onClick={() => cancel("admin")}>
              <XCircle size={15} />
            </Button>
          </ButtonGroup> : <ButtonGroup className='mb-1'>
            <Button color='secondary' className="btn-icon" size="sm" disabled >
              <Check size={15} />
            </Button>
            <Button color='secondary' className="btn-icon" size="sm" disabled >
              <XCircle size={15} />
            </Button>
          </ButtonGroup> }
          </Col>
          { (approveStatus !== 0) && <Col md="4">
          <Button color='danger' size="sm" outline onClick={() => decline()}>
              Decline
            </Button>
          </Col>}
          
        </Row>
        <Row className="mt-4">
          <Col>
      <div className="d-flex align-items-center">
      {inventory_report_pdf ?  <Button color='primary' className="mr-1" size="sm" onClick={() => openInNewTab(inventory_report_pdf?.report_location)}>
             View Uploaded PDF
           </Button> :  <Button color='secondary' size="sm" className="mr-1" disabled={true}>
           View Uploaded PDF
           </Button>}
      {inventory_report_pdf && <div>
        <span className="font-weight-bold">Uploaded at: </span>
        {moment(inventory_report_pdf.report_updated_date).format('MMMM Do YYYY, h:mm:ss a')}
        </div>}
      </div>
          </Col>
        </Row>
        {/* Super Admin Role */}
        </div> : userName === "opsmanager@queensman.com" ? <div className="mr-2"> 
        <Row>
          <Col md="2">
          <div>Status</div>
          </Col>
          <Col md="2">
          <div>Review Actions</div>
          </Col>
          { (approveStatus !== 0) && <Col md="4">
          <div>Decline Report</div>
          </Col> }
        </Row>
        <Row>
          <Col md="2">
          {approveStatus === 0 ? <Button color="danger" className="btn" size="sm">
            <span className="align-middle ml-25">Unapproved</span>
          </Button> : approveStatus === 1 ? <Button color="info" className="btn" size="sm">
            <span className="align-middle ml-25">Review</span>
          </Button> : approveStatus === 2 ? <Button color="warning" className="btn" size="sm">
            <span className="align-middle ml-25">Approval</span>
          </Button> : <Button color="success" className="btn" size="sm">
            <span className="align-middle ml-25">Approved</span>
          </Button>}
         
          
          </Col>
          <Col md="2">
            {approveStatus === 0 ?  <ButtonGroup className='mb-1'>
            <Button color='secondary' className="btn-icon" size="sm" disabled >
              <Check size={15} />
            </Button>
            <Button color='secondary' className="btn-icon" size="sm" disabled >
              <XCircle size={15} />
            </Button>
          </ButtonGroup> :  approveStatus === 2 ? <ButtonGroup className='mb-1'>
            <Button color='info' className="btn-icon" size="sm" onClick={() => checkMark("superAdmin")}>
              <Check size={15} />
            </Button>
            <Button color='secondary' className="btn-icon" size="sm" disabled >
              <XCircle size={15} />
            </Button>
          </ButtonGroup> :  approveStatus === 3 ? <ButtonGroup className='mb-1'>
            <Button color='secondary' className="btn-icon" size="sm" disabled >
              <Check size={15} />
            </Button>
            <Button color='danger' className="btn-icon" size="sm" onClick={() => cancel("superAdmin")}>
              <XCircle size={15} />
            </Button>
          </ButtonGroup> :  <ButtonGroup className='mb-1'>
            <Button color='secondary' className="btn-icon" size="sm" disabled >
              <Check size={15} />
            </Button>
            <Button color='secondary' className="btn-icon" size="sm" disabled >
              <XCircle size={15} />
            </Button>
          </ButtonGroup>}
          </Col>
          { (approveStatus !== 0) && <Col md="4">
          <Button color='danger' size="sm" outline onClick={() => decline()}>
              Decline
            </Button>
          </Col>}
          
        </Row>
        <Row className="mt-4">
          <Col>
      <div className="d-flex align-items-center">
      {inventory_report_pdf ?  <Button color='primary' className="mr-1" size="sm" onClick={() => openInNewTab(inventory_report_pdf?.report_location)}>
             View Uploaded PDF
           </Button> :  <Button color='secondary' size="sm" className="mr-1" disabled={true}>
           View Uploaded PDF
           </Button>}
      {inventory_report_pdf && <div>
        <span className="font-weight-bold">Uploaded at: </span>
        {moment(inventory_report_pdf.report_updated_date).format('MMMM Do YYYY, h:mm:ss a')}
        </div>}
      </div>
          </Col>
        </Row>
        {/* Default Access */}
        </div> : <div className="mr-2"> 
          <Row>
          <Col md="2">
          <div>Status</div>
          </Col>
          <Col md="2">
          <div>Review Actions</div>
          </Col>
        </Row>
        <Row>
          <Col md="2">
          {approveStatus === 0 ? <Button color="danger" className="btn" size="sm">
            <span className="align-middle ml-25">Unapproved</span>
          </Button> : approveStatus === 1 ? <Button color="info" className="btn" size="sm">
            <span className="align-middle ml-25">Review</span>
          </Button> : approveStatus === 2 ? <Button color="warning" className="btn" size="sm">
            <span className="align-middle ml-25">Approval</span>
          </Button> : <Button color="success" className="btn" size="sm">
            <span className="align-middle ml-25">Approved</span>
          </Button>}
         
          
          </Col>
          <Col md="2">
            <ButtonGroup className='mb-1'>
            <Button color='secondary' className="btn-icon" size="sm" disabled >
              <Check size={15} />
            </Button>
            <Button color='secondary' className="btn-icon" size="sm" disabled >
              <XCircle size={15} />
            </Button>
          </ButtonGroup>
          </Col>          
        </Row>
        <Row className="mt-4">
          <Col>
      <div className="d-flex align-items-center">
      {inventory_report_pdf ?  <Button color='primary' className="mr-1" size="sm" onClick={() => openInNewTab(inventory_report_pdf?.report_location)}>
             View Uploaded PDF
           </Button> :  <Button color='secondary' size="sm" className="mr-1" disabled={true}>
           View Uploaded PDF
           </Button>}
      {inventory_report_pdf && <div>
        <span className="font-weight-bold">Uploaded at: </span>
        {moment(inventory_report_pdf.report_updated_date).format('MMMM Do YYYY, h:mm:ss a')}
        </div>}
      </div>
          </Col>
        </Row></div>}
        <div className="modal-warning" >
        <Modal
          isOpen={declineModal}
          toggle={() => setDeclineModal(!declineModal)}
          className='modal-dialog-centered'
          modalClassName="modal-warning"

        >
          <ModalHeader toggle={() => setDeclineModal(!declineModal)}>Warning</ModalHeader>
          <ModalBody>
            Declining it will set the status to unapproved. 
            User will have to upload the report again.
          </ModalBody>
          <ModalFooter>
            <Button color="warning" onClick={() => decline("decline")}>
              I Accept
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      <div className="modal-warning" >
        <Modal
          isOpen={approveModal}
          toggle={() => setApproveModal(!approveModal)}
          className='modal-dialog-centered'
          modalClassName="modal-warning"

        >
          <ModalHeader toggle={() => setApproveModal(!approveModal)}>Warning</ModalHeader>
          <ModalBody>
            Approving this report will send email to the client. Are you sure you want to approve?
          </ModalBody>
          <ModalFooter>
            <Button color="warning" onClick={() => acceptApprove(inventory_report_pdf, property, inventory_rooms, client)}>
              I Accept
            </Button>
            <Button onClick={() => setApproveModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      
        </TabPane>
      </TabContent>
    </div>
  )
}
export default TabsVerticalLeft
