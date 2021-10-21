/* eslint-disable no-use-before-define */
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
import { DOMAIN, HASURA } from '../../_config'
import { useNiceMutation } from '../../utility/Utils'

const UPLOAD_CONTRACT = gql`
mutation AddContractReport($client_id: Int!, $report_location: String = "") {
  insert_contract_report_one(object: {client_id: $client_id, report_location: $report_location}) {
    id
    report_upload_date
    report_location
    client_id
  }
}`

const DELETE_CONTRACT_REPORT = gql`
mutation DeleteContractReport($id: Int!) {
  delete_contract_report_by_pk(id: $id) {
    id
  }
}
`

const DELETE_ZOHO_CONTRACT_REPORT = gql`
mutation DeleteZohoContractReport($client_email: String) {
  delete_documents(where: {client_email: {_eq: $client_email}}) {
    affected_rows
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

const TabsVerticalLeft = ({ item, refetchClient }) => {

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  const [active, setActive] = useState("1")
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [modalAlert, setModalAlert] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [time, setTime] = useState(null)
  const [uploadButton, setUploadButton] = useState(false)
  const [loaderButton, setLoaderButton] = useState(false)
  const [contract_local, setcontract_local] = useState(item?.contract_report ? [item?.contract_report] : [])
  const [contract_zoho, setcontract_zoho] = useState(item?.documents?.[item?.documents.length - 1]?.document_name)
  const [uploadContract, { loading: uploadContractLoading, error: uploadContractError }] = useNiceMutation(UPLOAD_CONTRACT)
  const [deleteContract] = useNiceMutation(DELETE_CONTRACT_REPORT)
  const [deleteZohoContract] = useNiceMutation(DELETE_ZOHO_CONTRACT_REPORT)

  const uploadPdf = async () => {
    setLoaderButton(false)
    if (pdf) {
       setLoading(true)
       setTimeout(() => {
        setLoaderButton(true)
      }, 6000)
       try {
          await storage.put(`/monthly_report/${pdf.name}`, pdf)
          const res = await uploadContract({variables: {
            client_id: item.id, 
            report_location: `${HASURA}/storage/o/monthly_report/${pdf.name}`
          }})
          const result_id = res?.data?.insert_contract_report_one?.id
          const result_client_id = res?.data?.insert_contract_report_one?.client_id
          const result_report_upload_date = res?.data?.insert_contract_report_one?.report_upload_date
          const result_report_location = res?.data?.insert_contract_report_one?.report_location
          setcontract_local([{id: result_id, client_id: result_client_id, report_upload_date: result_report_upload_date, report_location: result_report_location }])
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
      if (deleteId?.email) {
        const res = await deleteZohoContract({variables: {
          client_email: deleteId.email 
        }})
        setcontract_zoho(null)
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
      } else {
        const res = await deleteContract({variables: {
          id: deleteId.id 
        }})
        setcontract_local([])
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
        

  const openModalAlert = (id, email = null) => {
    setDeleteId({id, email})
    setModalAlert(true)
  }

  const toggleModalAlert = () => {
    setModalAlert(!modalAlert)
  }

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const RowContent = ({ data: prop, lease }) => (
    <div>
      <div className="meetup-header d-flex align-items-center">
        <h5 className="mb-1">Address: </h5>
        <h6 className="mb-1 ml-1">{prop.property.address}</h6>
      </div>
      <div className="meetup-header d-flex align-items-center">
        <h5 className="mb-1">Country: </h5>
        <h6 className="mb-1 ml-1">{prop.property.country}</h6>
      </div>
      <div className="meetup-header d-flex align-items-center">
        <h5 className="mb-1">City: </h5>
        <h6 className="mb-1 ml-1">{prop.property.city}</h6>
      </div>
      {lease &&  <div><div className="meetup-header d-flex align-items-center">
        <h5 className="mb-1">Start Date: </h5>
        <h6 className="mb-1 ml-1">{moment(prop.lease_start).format('MMMM Do YYYY, h:mm:ss a')}</h6>
      </div>
      <div className="meetup-header d-flex align-items-center">
      <h5 className="mb-1">End Date: </h5>
      <h6 className="mb-1 ml-1">{moment(prop.lease_end).format('MMMM Do YYYY, h:mm:ss a')}</h6>
    </div></div>}
    </div>
  )

  const CollapseDefault = ({ data }) => (
    <AppCollapse data={data} type="border" />
  )

  const property_owneds = item.property_owneds
  const prop_count = property_owneds.length
  const property_owneds_modified =
    prop_count !== 0 ? property_owneds.map((prop, i) => ({
      title: `Property id: ${prop.property.id} Adddress: ${prop.property.address}`,
      content: <RowContent data={prop} count={property_owneds.length} />
    })) : [
      {
        title: `No data Available`,
        content: <div></div>
      }
    ]

    const lease = item.leases
    const lease_count = lease.length
    const lease_modified =
      lease_count !== 0 ? lease.map((prop, i) => ({
        title: `Property id: ${prop.property.id} Adddress: ${prop.property.address}`,
        content: <RowContent data={prop} count={lease.length} lease={true} />
      })) : [
        {
          title: `No data Available`,
          content: <div></div>
        }
      ]
  const ItemValue = ({ item, itemKey }) => (
    <ListGroupItem>
      <span style={{ fontWeight: "bold" }}>
        {itemKey.split("_").map(value => value.charAt(0).toUpperCase() + value.slice(1)).join(" ")}: </span>
      {itemKey === "sign_up_time" ? moment(item[itemKey]).format('MMMM Do YYYY, h:mm:ss a') : item[itemKey] ? item[itemKey] : "N/A"}
    </ListGroupItem>
  )

  const ReportList = ({item}) => (
    <ListGroupItem>
      <Row className="d-flex align-items-center">
        <Col sm="1">
        <b>ID:</b> {item?.id}
        </Col>
      <Col>
      <b>Year: </b> {moment(item?.report_upload_date).format("YYYY")}
      </Col>
      <Col>
      <b>Month: </b> {moment(item?.report_upload_date).format("MMMM")}
      </Col>
      <Col>
      <b>Day: </b> {moment(item?.report_upload_date).format("dddd Do")}
      </Col>
      <Col>
      <b>Time: </b> {moment(item?.report_upload_date).format("h:mm a")}
      </Col>
      <Col>
      <Button color='primary' className="mr-1" size="sm" onClick={() => openInNewTab(item?.report_location)}>
        View Report
      </Button>
      </Col>
      <Col sm="1">
        <Button color='danger' className="btn-icon" size="sm" onClick={() => { openModalAlert(item?.id) }}>
          <Trash size={15} />
        </Button>
      </Col>
      </Row>
      {/* {itemKey.split("_").map(value => value.charAt(0).toUpperCase() + value.slice(1)).join(" ")} */}
    </ListGroupItem>
  )
  
  return (
    <div className="nav-vertical">
      {loading && <Overlay setLoaderButton={setLoaderButton} loaderButton={loaderButton} setLoading={setLoading} />}
      <Nav tabs className="nav-left">
        <NavItem>
          <NavLink
            active={active === "1"}
            onClick={() => {
              toggle("1")
            }}
          >
            Client Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === "2"}
            onClick={() => {
              toggle("2")
            }}
          >
            Owned Properties
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === "3"}
            onClick={() => {
              toggle("3")
            }}
          >
            Leased Properties
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '4'}
            onClick={() => {
              toggle('4')
            }}
          >
            Contract
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId="1">
          <h1>Details</h1>
          <h5>Client Details</h5>
          <ListGroup flush>
            {item && Object.keys(item).map((itemKey) => {
              if (!["documents", "property_owneds", "hasPlan", "leases", "contract_report", "__typename"].includes(itemKey)) {
                return (
                  <ItemValue item={item} itemKey={itemKey} />
                )
              }
            })}
          </ListGroup>
        </TabPane>
        <TabPane tabId="2">
          <h1>Owned Properties</h1>
            <CollapseDefault data={property_owneds_modified} />
        </TabPane>
        <TabPane tabId="3">
          <h1>Leased Properties</h1>
          <CollapseDefault data={lease_modified} />
        </TabPane>
        <TabPane tabId='4'>
        <h1>Contract Queensman</h1>
        <ListGroup flush>
            {contract_local?.length > 0 ? <ReportList item={contract_local[0]} /> : <div>No data Available</div>}
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
            { time && <div className="mt-1">
               <span className="font-weight-bold">Uploaded at: </span>
               {moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')}
               </div>}
            </ListGroup>
            <h1 className="mt-1">Contract from ZOHO</h1>
            {contract_zoho ? <Document row={item} openModalAlert={openModalAlert} /> : <div>No data Available</div>}
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


const Document = ({ row, openModalAlert }) => {
  const [loading, setloading] = useState(false)
  const documentId = (row?.documents?.[row?.documents.length - 1].document_name ?? '').split(', ')[1]
  const name = row?.full_name
  // const downloadContract = () => {
  //   setloading(true)
  //   const myHeaders = new Headers()
  //   myHeaders.append("Content-Type", "application/x-www-form-urlencoded")

  //   const urlencoded = new URLSearchParams()
  //   urlencoded.append("document_id", documentId)

  //   const requestOptions = {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: urlencoded,
  //     redirect: 'follow'
  //   }

  //   fetch(`${HASURA}/downloadDocument`, requestOptions)
  //     .then(response => response.text())
  //     .then(result => {
  //       // console.log(result)
  //       const file = b64toBlob(result, "application/pdf")
  //       const fileUrl = window.URL.createObjectURL(file)
  //       const link = document.createElement('a')
  //       link.href = fileUrl
  //       link.setAttribute('download', `${name} contract.pdf`)
  //       document.body.appendChild(link)
  //       link.click()
  //       setloading(false)
  //     })
  //     .catch(error => console.log('error', error))
  // }

  if (loading) {
    return <Spinner />
  }
  return (
    <div>
        <Button target="_blank" href={`https://api-8106d23e.nhost.app/?document_id=${documentId}`} color='primary' className="btn-icon mr-5">Download Contract</Button>
        <Button color='danger' className="btn-icon" size="sm" onClick={() => { openModalAlert(row?.id, row?.email) }}>
          <Trash size={18} />
        </Button>
    </div>
  )
}

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || ""
  sliceSize = sliceSize || 512

  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }


  return new File(byteArrays, "pot", { type: contentType })
}

export default TabsVerticalLeft
