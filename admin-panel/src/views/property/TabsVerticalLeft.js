import { useState, Fragment  } from 'react'
import AppCollapse from '@components/app-collapse'
import moment from "moment"
import { TabContent, TabPane, Nav, NavItem, NavLink, ListGroup, ListGroupItem, Card, Col, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Spinner  } from 'reactstrap'

import { auth, storage } from "../../utility/nhost"
import { toast } from "react-toastify"
import axios from "axios"
import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client"
import Avatar from "@components/avatar"
import { Trash, Upload, XCircle, Check } from 'react-feather'
import { DivOverlay } from 'leaflet'
import { DOMAIN, HASURA } from '../../_config'

const MANAGEMENT_REPORT = gql`
mutation AddManagementReport($property_id: Int!, $report_location: String = "") {
  insert_management_report_one(object: {property_id: $property_id, report_location: $report_location}) {
    id
    report_upload_date
    report_location
    property_id
  }
}`

const MARKET_REPORT = gql`
mutation AddMarketReport($property_id: Int!, $report_location: String = "") {
  insert_market_report_one(object: {property_id: $property_id, report_location: $report_location}) {
    id
    report_upload_date
    report_location
    property_id
  }
}`

const MONTHLY_STATUS_REPORT = gql`
mutation AddMonthlyStatusReport($property_id: Int!, $report_location: String = "") {
  insert_monthly_services_report_one(object: {property_id: $property_id, report_location: $report_location}) {
    id
    report_upload_date
    report_location
    property_id
  }
}`

const MATERIAL_WARRANTY_REPORT = gql`
mutation AddMaterialWarrantyReport($property_id: Int!, $report_location: String = "") {
  insert_material_warranty_report_one(object: {property_id: $property_id, report_location: $report_location}) {
    id
    report_upload_date
    report_location
    property_id
  }
}`

const DELETE_MANAGEMENT_REPORT = gql`
mutation DeleteManagmentReport($id: Int!) {
  delete_management_report_by_pk(id: $id) {
    id
  }
}
`
const DELETE_MARKET_REPORT = gql`
mutation DeletMarketReport($id: Int!) {
  delete_market_report_by_pk(id: $id) {
    id
  }
}
`
const DELETE_MONTHLY_STATUS_REPORT = gql`
mutation DeleteMonthlyReport($id: Int!) {
  delete_monthly_services_report_by_pk(id: $id) {
    id
  }
}
`

const DELETE_MATERIAL_WARRANTY_REPORT = gql`
mutation DeleteMaterialWarrantyReport($id: Int!) {
  delete_material_warranty_report_by_pk(id: $id) {
    id
  }
}
`

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

//Overlay component
const Overlay = ({setLoaderButton, loaderButton, setLoading}) => {
  return (
<div style={{
    position: "fixed",
    display: "block",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 2
}}>
  <div style={{
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)"
  }}>
      <Spinner color='primary' />
      {loaderButton && <div className="d-flex flex-column align-items-center mt-2">
        <h6 className="text-primary">Hmmm it is taking longer than expected</h6>
        <Button color='secondary' className="mt-2" onClick={ () => { setLoaderButton(false); setLoading(false) }}>Go back</Button>
        </div>}
    </div>
  </div>
  )
}

const TabsVerticalLeft = ({data, propertyLoading, property_id}) => {
  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
  console.log(property_id)
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [modalAlert, setModalAlert] = useState(null)
  const [active, setActive] = useState('1')
  const [pdf, setPdf] = useState(null)
  const [time, setTime] = useState(null)
  const [uploadButton, setUploadButton] = useState(false)
  const [loaderButton, setLoaderButton] = useState(false)
  const management_report = data?.management_report
  const market_report = data?.market_report
  const monthly_status_report = data?.monthly_services_report
  const material_warranty_report = data?.material_warranty_report
  const [uploadManagementReport, { loading: managementReportLoading, error: managementReportError }] = useMutation(MANAGEMENT_REPORT)
  const [uploadMarketReport, { loading: marketReportLoading, error: marketReportError }] = useMutation(MARKET_REPORT)
  const [uploadMonthlyStatusReport, { loading: monthlyReportLoading, error: monthlyReportError }] = useMutation(MONTHLY_STATUS_REPORT)
  const [uploadMaterialWarrantyReport, { loading: materialReportLoading, error:materialReportError }] = useMutation(MATERIAL_WARRANTY_REPORT)
  const [deleteManagementReport, { loading: deleteManagementReportLoading, error: deleteManagementReportError }] = useMutation(DELETE_MANAGEMENT_REPORT)
  const [deleteMarketReport, { loading: deleteMarketReportLoading, error: deleteMarketReportError }] = useMutation(DELETE_MARKET_REPORT)
  const [deleteMonthlyStatusReport, { loading: deleteMonthlyReportLoading, error: deleteMonthlyReportError }] = useMutation(DELETE_MONTHLY_STATUS_REPORT)
  const [deleteMaterialWarrantyReport, { loading: deleteMaterialReportLoading, error: deleteMaterialReportError }] = useMutation(DELETE_MATERIAL_WARRANTY_REPORT)
  
  const uploadPdf = async (reportNumber) => {
    setLoaderButton(false)
    if (pdf) {
       setLoading(true)
       setTimeout(() => {
        setLoaderButton(true)
      }, 6000)
       try {
        switch (reportNumber) {
          case 1: { //MANAGEMENT_REPORT
            await storage.put(`/management_report/${pdf.name}`, pdf)
            const res = await uploadManagementReport({variables: {
              property_id, 
              report_location: `${HASURA}/storage/o/management_report/${pdf.name}`
            }})
            const result_id = res?.data?.insert_management_report_one?.id
            const result_property_id = res?.data?.insert_management_report_one?.property_id
            const result_report_upload_date = res?.data?.insert_management_report_one?.report_upload_date
            const result_report_location = res?.data?.insert_management_report_one?.report_location
            management_report.push({id: result_id, property_id: result_property_id, report_upload_date:result_report_upload_date, report_location: result_report_location })
            setTime(result_report_upload_date)
            setLoading(false)
            setLoaderButton(false)
            return toast.success(
              <ToastComponent title="Plan Added" color="success" icon={<Check />} />,
              {
                autoClose: 4000,
                hideProgressBar: false,
                closeButton: false
              }
            )
          } case 2: { //MARKET_REPORT
            await storage.put(`/market_report/${pdf.name}`, pdf)
            const res = await uploadMarketReport({variables: {
              property_id, 
              report_location: `${HASURA}/storage/o/market_report/${pdf.name}`
            }})
            const result_id = res?.data?.insert_market_report_one?.id
            const result_property_id = res?.data?.insert_market_report_one?.property_id
            const result_report_upload_date = res?.data?.insert_market_report_one?.report_upload_date
            const result_report_location = res?.data?.insert_market_report_one?.report_location
            market_report.push({id: result_id, property_id: result_property_id, report_upload_date:result_report_upload_date, report_location: result_report_location })
            setTime(result_report_upload_date)
            setLoading(false)
            setLoaderButton(false)
            return toast.success(
              <ToastComponent title="Plan Added" color="success" icon={<Check />} />,
              {
                autoClose: 4000,
                hideProgressBar: false,
                closeButton: false
              }
            )
          } case 3: { //MONTHLY_STATUS_REPORT
            await storage.put(`/monthly_status_report/${pdf.name}`, pdf)
            const res = await uploadMonthlyStatusReport({variables: {
              property_id, 
              report_location: `${HASURA}/storage/o/monthly_status_report/${pdf.name}`
            }})
            const result_id = res?.data?.insert_monthly_services_report_one?.id
            const result_property_id = res?.data?.insert_monthly_services_report_one?.property_id
            const result_report_upload_date = res?.data?.insert_monthly_services_report_one?.report_upload_date
            const result_report_location = res?.data?.insert_monthly_services_report_one?.report_location
            monthly_status_report.push({id: result_id, property_id: result_property_id, report_upload_date:result_report_upload_date, report_location: result_report_location })
            setTime(result_report_upload_date)
            setLoading(false)
            setLoaderButton(false)
            // monthly_status_report.push({})
            console.log(res)
            return toast.success(
              <ToastComponent title="Plan Added" color="success" icon={<Check />} />,
              {
                autoClose: 4000,
                hideProgressBar: false,
                closeButton: false
              }
            )
          } case 4: { //MATERIAL_WARRANTY_REPORT
            await storage.put(`/material_warranty_report/${pdf.name}`, pdf)
            const res = await uploadMaterialWarrantyReport({variables: {
              property_id, 
              report_location: `${HASURA}/storage/o/material_warranty_report/${pdf.name}`
            }})
            const result_id = res?.data?.insert_material_warranty_report_one?.id
            const result_property_id = res?.data?.insert_material_warranty_report_one?.property_id
            const result_report_upload_date = res?.data?.insert_material_warranty_report_one?.report_upload_date
            const result_report_location = res?.data?.insert_material_warranty_report_one?.report_location
            material_warranty_report.push({id: result_id, property_id: result_property_id, report_upload_date:result_report_upload_date, report_location: result_report_location })
            setTime(result_report_upload_date)
            setLoading(false)
            setLoaderButton(false)
            return toast.success(
              <ToastComponent title="Plan Added" color="success" icon={<Check />} />,
              {
                autoClose: 4000,
                hideProgressBar: false,
                closeButton: false
              }
            )
          }
        }
        } catch (e) {
          console.log(e)
          setLoading(false)
          setLoaderButton(false)
          return toast.error(
            <ToastComponent title="Error Uploading pdf" color="danger" icon={<XCircle />} />,
            {
              autoClose: 4000,
              hideProgressBar: false,
              closeButton: false
            }
          )
        }
    }
   }

   const deleteReport = async () => {
     setLoaderButton(false)
      setModalAlert(false)
      setLoading(true)
      setTimeout(() => {
        setLoaderButton(true)
      }, 6000)
      try {
       switch (deleteId.reportNumber) {
         case 1: { //MANAGEMENT_REPORT
           const res = await deleteManagementReport({variables: {
             id: deleteId.id 
           }})
           console.log(deleteId.index, "index")
           management_report.splice(deleteId.index, 1)
           setLoading(false)
           setLoaderButton(false)
           return toast.error(
             <ToastComponent title="Report Deleted" color="danger" icon={<Check />} />,
             {
               autoClose: 4000,
               hideProgressBar: false,
               closeButton: false
             }
           )
         } case 2: { //MARKET_REPORT
           const res = await deleteMarketReport({variables: {
             id: deleteId.id
           }})
           market_report.splice(deleteId.index, 1)
           setLoading(false)
           setLoaderButton(false)
           return toast.error(
             <ToastComponent title="Report Deleted" color="danger" icon={<Check />} />,
             {
               autoClose: 4000,
               hideProgressBar: false,
               closeButton: false
             }
           )
         } case 3: { //MONTHLY_STATUS_REPORT
           const res = await deleteMonthlyStatusReport({variables: {
             id: deleteId.id
           }})
           monthly_status_report.splice(deleteId.index, 1)
           setLoading(false)
           setLoaderButton(false)
           console.log(res)
           return toast.error(
             <ToastComponent title="Report Deleted" color="danger" icon={<Check />} />,
             {
               autoClose: 4000,
               hideProgressBar: false,
               closeButton: false
             }
           )
         } case 4: { //MATERIAL_WARRANTY_REPORT
           const res = await deleteMaterialWarrantyReport({variables: {
             id: deleteId.id
           }})
           material_warranty_report.splice(deleteId.index, 1)
           setLoading(false)
           setLoaderButton(false)
           return toast.error(
             <ToastComponent title="Report Deleted" color="danger" icon={<Check />} />,
             {
               autoClose: 4000,
               hideProgressBar: false,
               closeButton: false
             }
           )
         }
       }
       } catch (e) {
         console.log(e)
         setLoading(false)
         setLoaderButton(false)
         return toast.error(
           <ToastComponent title="Error Uploading pdf" color="danger" icon={<XCircle />} />,
           {
             autoClose: 4000,
             hideProgressBar: false,
             closeButton: false
           }
         )
       }
  }

  const openModalAlert = (id, reportNumber, index) => {
    setDeleteId({id, reportNumber, index})
    setModalAlert(true)
  }

  const toggleModalAlert = () => {
    setModalAlert(!modalAlert)
  }

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
      setPdf(null)
      setTime(null)
      setUploadButton(false)
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

    const ReportList = ({item, reportNumber, index}) => (
      <ListGroupItem>
        <Row className="d-flex align-items-center">
          <Col sm="1">
          <b>ID:</b> {item.id}
          </Col>
        <Col>
        <b>Year: </b> {moment(item.report_upload_date).format("YYYY")}
        </Col>
        <Col>
        <b>Month: </b> {moment(item.report_upload_date).format("MMMM")}
        </Col>
        <Col>
        <b>Day: </b> {moment(item.report_upload_date).format("dddd Do")}
        </Col>
        <Col>
        <b>Time: </b> {moment(item.report_upload_date).format("h:mm a")}
        </Col>
        <Col>
        <Button color='primary' className="mr-1" size="sm" onClick={() => openInNewTab(item.report_location)}>
          View Report
        </Button>
        </Col>
        <Col sm="1">
          <Button color='danger' className="btn-icon" size="sm" onClick={() => { openModalAlert(item.id, reportNumber, index) }}>
            <Trash size={15} />
          </Button>
        </Col>
        </Row>
        {/* {itemKey.split("_").map(value => value.charAt(0).toUpperCase() + value.slice(1)).join(" ")} */}
      </ListGroupItem>
    )

  return (
    <div className='nav-vertical'>
      {loading && <Overlay setLoaderButton={setLoaderButton} loaderButton={loaderButton} setLoading={setLoading} />}
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
            {management_report?.length > 0 ? management_report.map((item, i) => (
              <ReportList item={item} reportNumber={1} key={i} index={i} />
            )) : <div>No data Available</div>}
            <div className="mt-2">
                   <Input type="file" name="file" id="exampleFile" onChange={(e) => { setPdf(e.target.files[0]); setUploadButton(true) }}/>
                  </div>                   
                  <div className="mt-2">
                 {!uploadButton ? <Button color='secondary' size="sm" disabled>
                <Upload size={15} />
                  Upload
                </Button> : <Button color='info' size="sm" onClick={() => uploadPdf(1)}>
                  <Upload size={15} />
                    Upload
                </Button>}
                 </div>
            { time && <div className="mt-2">
               <span className="font-weight-bold">Uploaded at: </span>
               {moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')}
               </div>}
            </ListGroup>
        </TabPane>
        <TabPane tabId='4'>
        <h1>Market Reports</h1>
        <ListGroup flush>
            {market_report?.length > 0 ? market_report.map((item, i) => (
              <ReportList item={item} reportNumber={2} key={i} index={i} />
              )) : <div>No data Available</div>}
              <div className="mt-2">
                   <Input type="file" name="file" id="exampleFile" onChange={(e) => { setPdf(e.target.files[0]); setUploadButton(true) }}/>
                  </div>                   
                  <div className="mt-2">
                 {!uploadButton ? <Button color='secondary' size="sm" disabled>
                <Upload size={15} />
                  Upload
                </Button> : <Button color='info' size="sm" onClick={() => uploadPdf(2)}>
                  <Upload size={15} />
                    Upload
                </Button>}
                 </div>
            { time && <div className="mt-2">
               <span className="font-weight-bold">Uploaded at: </span>
               {moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')}
               </div>}
            </ListGroup>
        </TabPane>
        <TabPane tabId='5'>
        <h1>Monthly Status Report</h1>
            <ListGroup flush>
            {monthly_status_report?.length > 0 ? monthly_status_report.map((item, i) => (
              <ReportList item={item} key={i} reportNumber={3} index={i} />
              )) : <div>No data Available</div>}
                 <div className="mt-2">
                   <Input type="file" name="file" id="exampleFile" onChange={(e) => { setPdf(e.target.files[0]); setUploadButton(true) }}/>
                  </div>                   
                  <div className="mt-2">
                 {!uploadButton ? <Button color='secondary' size="sm" disabled>
                <Upload size={15} />
                  Upload
                </Button> : <Button color='info' size="sm" onClick={() => uploadPdf(3)}>
                  <Upload size={15} />
                    Upload
                </Button>}
                 </div>
            { time && <div className="mt-2">
               <span className="font-weight-bold">Uploaded at: </span>
               {moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')}
               </div>}
            </ListGroup>
        </TabPane> <TabPane tabId='6'>
        <h1>Material Warranty Report</h1>
        <ListGroup flush>
            {material_warranty_report?.length > 0 ? material_warranty_report?.map((item, i) => (
              <ReportList item={item} reportNumber={4} key={i} index={i} />
              )) : <div>No data Available</div>}
              <div className="mt-2">
                   <Input type="file" name="file" id="exampleFile" onChange={(e) => { setPdf(e.target.files[0]); setUploadButton(true) }}/>
                  </div>                   
                  <div className="mt-2">
                 {!uploadButton ? <Button color='secondary' size="sm" disabled>
                <Upload size={15} />
                  Upload
                </Button> : <Button color='info' size="sm" onClick={() => uploadPdf(4)}>
                  <Upload size={15} />
                    Upload
                </Button>}
                 </div>
            { time && <div className="mt-2">
               <span className="font-weight-bold">Uploaded at: </span>
               {moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')}
               </div>}
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
        Are you sure you want to delete?
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={() => deleteReport()}>
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
