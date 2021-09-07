// ** React Imports
import { useState, Fragment, forwardRef, useContext, useRef } from 'react'


// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'
import Exportqs from '../extensions/import-export/Exportqs'
import moment from "moment"
import { MoreVertical, Edit, ChevronDown, Plus, Trash, Eye, EyeOff, Edit3, Upload, Loader, Check, XCircle } from 'react-feather'
import { Card, CardHeader, CardBody, CardTitle, Input, Label, FormGroup, Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Select from 'react-select'

// ** Toast Component
const ToastComponent = ({ title, icon, color }) => (
  <Fragment>
    <div className='toastify-header pb-0'>
      <div className='title-wrapper'>
        <Avatar size='sm' color={color} icon={icon} />
        <h6 className='toast-title'>{title}</h6>
      </div>
    </div>
  </Fragment>
)

// ** Bootstrap Checkbox Component
// const BootstrapCheckbox = forwardRef(({ onClick, ...rest }, ref) => {
//     return (
// <div className='custom-control custom-checkbox'>
//     <input type='checkbox' className='custom-control-input' ref={ref} {...rest} />
//     <label className='custom-control-label' onClick={onClick} />
//   </div>
//     )
// })

// ** Conditional Style
const conditionalRowStyles = [
  {
    when: row => row?.type === "Deferred",
    style: {
      backgroundColor: '#4b4b4b',
      color: 'white',
      '&:hover': {
        cursor: 'pointer'
      }
    }
  }
]

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { gql, useMutation, useQuery } from '@apollo/client'
import AddNewModal from './AddNewModal'
import ButtonGroup from 'reactstrap/lib/ButtonGroup'
import Badge from 'reactstrap/lib/Badge'
import TabsVerticalLeft from './TabsVerticalLeft'

const GET_JOB_TICKETS = gql`
query getJobTickets {
  job_tickets(order_by: {id: desc}) {
    id
    notes
    name
    callout_id
    description
    type
    worker_email
    worker_id
    status
    created_at
    worker_email_rel {
      full_name
    }
    callout {
      id
      property_id
      job_type
      description
      status
      request_time
      urgency_level
      picture1
      picture2
      picture3
      picture4
      video
      client: client_callout_email {
        id
        full_name
        email
        phone
      }
      job: callout_job {
        solution
        feedback
        rating
      }
      property {
        id
        address
        community
        country
        city
      }
      schedulers {
        id
        date_on_calendar
        time_on_calendar
      }
      pre_pics {
        picture_location
      }
      postpics {
        picture_location
      }
      job_history {
        id
        location
        status_update
        time
      }
    }
  }
}
`

const UPDATE_JOB_TICKET = gql`
mutation UpdateJobTicket($id: Int!, $description: String, $name: String, $notes: _text, $worker_email: String, $type: String) {
  update_job_tickets_by_pk(pk_columns: {id: $id}, _set: {description: $description, name: $name, worker_email: $worker_email, type: $type}) {
    id
  }
}
`
const ADD_JOB_TICKET = gql`
mutation AddJobTicket($name: String, $description: String, $worker_email: String, $type: String) {
  insert_job_tickets_one(object: {name: $name, description: $description, worker_email: $worker_email, type: $type}) {
    id
  }
}
`

const DELETE_JOB_TICKET = gql`
mutation deleteJobTicket($id: Int!) {
  delete_job_tickets_by_pk(id: $id) {
    id
  }
}
`

const DataTableAdvSearch = () => {

  // ** States
  const { loading, data, error } = useQuery(GET_JOB_TICKETS)
  const [updateJobTicket, { loading: updateJobTicketLoading }] = useMutation(UPDATE_JOB_TICKET, { refetchQueries: [{ query: GET_JOB_TICKETS }] })
  const [addJobTicket, { loading: addJobTicketLoading }] = useMutation(ADD_JOB_TICKET, { refetchQueries: [{ query: GET_JOB_TICKETS }] })
  const [deleteJobTicket, { loading: deleteJobLoading }] = useMutation(DELETE_JOB_TICKET, { refetchQueries: [{ query: GET_JOB_TICKETS }] })
  const [modal, setModal] = useState(false)
  const [detailsModal, setDetailsModal] = useState(false)
  const [modalDetails, setModalDetails] = useState(null)
  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [searchType, setSearchType] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [searchCalloutId, setSearchCalloutId] = useState('')
  const [description, setDescription] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [filteredData, setFilteredData] = useState([])
  const [toAddNewJobTicket, setToAddNewJobTicket] = useState(false)
  const [row, setRow] = useState(null)
  const [rowId, setRowId] = useState(null)
  const [modalAlert, setModalAlert] = useState(null)

  const typeOptions = [
    { value: "", label: "All" },
    { value: "Deferred", label: "Deferred" },
    { value: "Additional Request", label: "Additional Request" },
    { value: "Full Job", label: "Full Job" },
    { value: "Material Request", label: "Material Request" },
    { value: "Request for quotation", label: "Request for quotation" },
    { value: "Patch Job", label: "Patch Job" }
  ]

  const statusOptions = [
    { value: "Open", label: "Open" },
    { value: "Closed", label: "Closed" },
    { value: "In Progress", label: "In Progress" }
  ]
  const toggleModal = () => {
    setModalAlert(!modalAlert)
  }

  const openModalAlert = (id) => {
    setRowId(id)
    setModalAlert(true)
  }

  const closeModal = () => {
    setModal(!modal)
  }

  //** Function to open details modal */
  const openDetailsModal = (item) => {
    console.log(item)
    setDetailsModal(true)
    setModalDetails(item) //set row value 
  }

  // ** Function to handle Modal toggle
  const handleModal = (row) => {
    console.log(row)
    setRow(row)
    setTimeout(() => {
      setModal(!modal)
    }, 10)
    setToAddNewJobTicket(false)
  }

  // ** Function to handle Pagination
  const handlePagination = page => setCurrentPage(page.selected)

  // ** Table Columns
  const advSearchColumns = [
    {
      name: 'Id',
      selector: 'id',
      sortable: true,
      minWidth: '10px'
    },
    {
      name: 'Callout ID',
      selector: 'callout_id',
      sortable: true,
      minWidth: '10px',
      cell: row => (
        row?.callout_id ? row.callout_id : "No ID"
      )
    },
    // {
    //   name: 'Email',
    //   selector: 'worker_email',
    //   sortable: true,
    //   minWidth: '200px'
    // },
    // {
    //   name: 'Name',
    //   selector: 'name',
    //   sortable: true,
    //   minWidth: '200px'
    // },
    {
      name: 'Type',
      selector: 'type',
      sortable: true,
      minWidth: '200px'
    },
    {
      name: 'Description',
      selector: 'description',
      sortable: true,
      minWidth: '250px',
      compact: false,
      wrap: true,
      cell: row => {
        if (row?.type === 'Deferred') {
          if (row?.description && row?.name) {
            return `${row?.description}; ${row?.name}`
          } else if (row?.description) {
            return `${row?.description}`
          } else if (row?.name) {
            return `${row?.name}`
          } else {
            return "No description"
          }
        } else {
          if (row?.description) {
            return `${row?.description}`
          } else {
            return "No description"
          }
        }

      }
    },
    {
      name: 'Worker Assigned',
      selector: 'worker_email_rel',
      sortable: true,
      minWidth: '100px',
      wrap: true,
      cell: row => {
        if (row?.worker_email_rel?.full_name) {
          return row?.worker_email_rel?.full_name
        } else {
          return "No worker Assigned"
        }
      }
    },
    // {
    //   name: 'Scheduler Id',
    //   selector: 'scheduler_id',
    //   sortable: true,
    //   minWidth: '150px'
    // },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      minWidth: '150px',
      cell: row => {
        if (row?.status) {
          return (
            <Badge color={row?.status === 'Open' ? 'light-danger' : (row.status === 'In Progress' ? 'light-warning' : 'light-success')} pill>
              {row?.status}
            </Badge>
          )
        } else {
          return "No Status"
        }
      }
    },
    {
      name: 'Urgency',
      selector: 'callout.urgency_level',
      sortable: true,
      minWidth: '100px',
      cell: row => {
        if (row?.callout?.urgency_level) {
          return (
            <Badge color={row?.callout?.urgency_level === 'High' ? 'light-danger' : 'light-success'} pill>
              {row?.callout?.urgency_level}
            </Badge>
          )
        } else {
          return "No Urgerncy"
        }
      }
    },
    {
      name: "Date",
      selector: "created_at",
      sortable: true,
      minWidth: "250px",
      wrap: true,
      cell: row => {
        return (
          moment(row?.created_at).format('MMMM Do YYYY, h:mm:ss a')
        )
      }
    },
    {
      name: 'Actions',
      minWidth: '200px',
      allowOverflow: true,
      cell: row => {
        return (
          <div className="d-flex w-100 align-items-center">
            <ButtonGroup size="sm" >
              <Button color='danger' className="btn-icon" size="sm" onClick={() => { openModalAlert(row.id) }}>
                <Trash size={15} />
              </Button>
              {/* <Button color='primary' className="btn-icon" size="sm">
                <Edit size={15} onClick={() => handleModal(row)} />
              </Button> */}
            </ButtonGroup>

          </div>

        )
      }
    }
  ]

  // ** Table data to render
  const dataToRender = () => {
    if (
      searchName.length ||
      description.length ||
      searchEmail.length ||
      searchType?.length || searchStatus?.length || searchCalloutId.length
    ) {
      return filteredData
    } else {
      return data?.job_tickets
    }
  }

  const handleUpdate = (updatedRow) => {
    updateJobTicket({
      variables: {
        description: updatedRow.description,
        worker_email: updatedRow.worker_email,
        name: updatedRow.name,
        type: updatedRow.type,
        id: updatedRow.id
      }
    })
    dataToRender()
    if (!updateJobTicketLoading) {
      setModal(!modal)
    }
  }

  const addJobTicketRecord = () => {
    setToAddNewJobTicket(true)
    setRow({
      description: "",
      worker_email: "",
      name: "",
      type: "Deferred"
    })
    setTimeout(() => {
      setModal(!modal)
    }, 200)
  }


  const handleAddJobTicket = (newRow) => {
    console.log(newRow)
    addJobTicket({
      variables: {
        description: newRow.description,
        worker_email: newRow.worker_email,
        name: newRow.name,
        type: newRow.type
      }
    })
    dataToRender()
    if (!addJobTicketLoading) {
      setModal(!modal)
    }
  }

  const handleDeleteJobTicket = (id) => {

    deleteJobTicket({
      variables: {
        id
      }
    })
    toast.error(<ToastComponent title='Job Ticket Removed' color='danger' icon={<Trash />} />, {
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false
    })
    dataToRender()
    if (!deleteJobLoading) {
      toggleModal()
    }
  }


  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={''}
      nextLabel={''}
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={dataToRender().length / 7 || 1}
      breakLabel={'...'}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName={'active'}
      pageClassName={'page-item'}
      nextLinkClassName={'page-link'}
      nextClassName={'page-item next'}
      previousClassName={'page-item prev'}
      previousLinkClassName={'page-link'}
      pageLinkClassName={'page-link'}
      breakClassName='page-item'
      breakLinkClassName='page-link'
      containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-center pr-1 mt-1'}
    />
  )

  // ** Function to handle name filter
  const handleNameFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchEmail.length || description.length || searchType?.length || searchCalloutId.length || searchStatus?.length) {
        return filteredData
      } else {
        return data?.job_tickets
      }
    }

    setSearchName(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item?.worker_email_rel?.full_name?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item?.worker_email_rel?.full_name?.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData([...updatedData])
      setSearchName(value)
    }
  }

  // ** Function to handle Occupation filter
  const handleDescriptionFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchEmail.length || searchName.length || searchType?.length || searchCalloutId.length || searchStatus?.length) {
        return filteredData
      } else {
        return data?.job_tickets
      }
    }

    setDescription(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.description?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.description?.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData([...updatedData])
      setDescription(value)
    }
  }

  // ** Function to handle Callout ID filter
  const handleCalloutIdFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchEmail.length || searchName.length || description.length || searchType?.length || searchStatus?.length) {
        return filteredData
      } else {
        return data?.job_tickets
      }
    }

    setSearchCalloutId(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item?.callout_id?.toString().startsWith(value.toLowerCase())

        const includes = item?.callout_id?.toString().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData([...updatedData])
      setSearchCalloutId(value)
    }
  }

  // ** Function to handle type filter
  const handleTypeFilter = e => {

    const value = e?.value
    let updatedData = []
    const dataToFilter = () => {
        if (searchEmail.length || searchName.length || description.length || searchCalloutId.length || searchStatus?.length) {
         return filteredData
       } else {
      return data?.job_tickets
        }
    }
    
    if (value?.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.type?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.type?.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })

      setFilteredData([...updatedData])

      setSearchType(value)
    }
  }
  //handle status filter
  const handleStatusFilter = e => {
    console.log(e)
    const value = e?.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchEmail.length || searchName.length || description.length || searchCalloutId.length || searchType?.length) {
       return filteredData
     } else {
    return data?.job_tickets
      }
  }

    if (value?.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.status?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.status?.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      console.log(updatedData)
      setFilteredData([...updatedData])
      // console.log(filteredData)
      setSearchStatus(value)
    }
    
  }
  //for export data start
  //=================================
  const createExportObject = (DataTojson) => {
    const objectsToExport = []

    for (const keys in DataTojson) {
      objectsToExport.push({
        id: DataTojson[keys].id.toString(),
        type: DataTojson[keys].type,
        status: DataTojson[keys].status,
        description: DataTojson[keys].description,
        urgency_level: DataTojson[keys]?.callout?.urgency_level,
        worker_assigned: DataTojson[keys]?.worker_email_rel?.full_name,
        CreationDate: DataTojson[keys].created_at

      })

    }
    //   console.log((objectsToExport))
    return (objectsToExport)

  }
  //for export data end
  const dataToExport = () => {
    if (
      searchName.length ||
      description.length ||
      searchEmail.length ||
      searchType?.length || searchStatus?.length
    ) {
      return createExportObject(filteredData)
    } else {
      return createExportObject(data?.job_tickets)
    }
  }
  
  const clearRecord = () => {
    setSearchEmail("") 
    setSearchName("")  
    setDescription("")  
    setSearchType(null)  
    setSearchCalloutId("")
    setSearchStatus(null)
  }
  
  return (
    <Fragment>
      <Card>

        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Ticket Search</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
          { (searchEmail || searchName || description || searchType || searchStatus || searchCalloutId) && <Button className='ml-2' color='danger' outline onClick={() => clearRecord()}>
              <XCircle size={15} />
              <span className='align-middle ml-50'>Clear filter</span>
            </Button>}
            {/* <Button className='ml-2' color='primary' onClick={addJobTicketRecord}>
              <Plus size={15} />
              <span className='align-middle ml-50'>Add Record</span>
            </Button> */}
          </div>
        </CardHeader>

        <CardBody>
          <Row form className='mt-1 mb-50'>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='name'>Name:</Label>
                <Input id='name' placeholder='Search Worker Name' value={searchName} onChange={handleNameFilter} />
              </FormGroup>
            </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='occupation'>Description:</Label>
                <Input id='occupation' placeholder='AC not working' value={description} onChange={handleDescriptionFilter} />
              </FormGroup>
            </Col>
            {/* <Col lg='4' md='6'>
              <FormGroup>
                <Label for='organization'>Organization:</Label>
                <Input id='organization' placeholder='San Diego' value={teamId} onChange={handleOrganizationFilter} />
              </FormGroup>
            </Col> */}
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='type'>Job Type:</Label>
                <Select
                  onChange={handleTypeFilter}
                  className='react-select'
                  classNamePrefix='select'
                  defaultValue={searchType}
                  placeholder="Select Type"
                  options={typeOptions}
                  isClearable={true}
                />
              </FormGroup>
            </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='type'>Status Type:</Label>
                <Select
                  onChange={handleStatusFilter}
                  className='react-select'
                  classNamePrefix='select'
                  defaultValue={searchStatus}
                  placeholder="Select Status"
                  options={statusOptions}
                  isClearable={true}
                />
              </FormGroup>
              {/* <FormGroup>
                <Label for='Status'>Status:</Label>
                <Input id='status' type='select' value={searchStatus} onChange={handleStatusFilter}>
                  <option></option>
                  <option>Open</option>
                  <option>Closed</option>
                  <option>In Progress</option>

                </Input>
              </FormGroup> */}
            </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='calloutId'>Callout ID:</Label>
                <Input id='calloutId' placeholder='Search callout id' value={searchCalloutId} onChange={handleCalloutIdFilter} />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
        <Exportqs InData={dataToExport()}></Exportqs>
        {!loading ? <DataTable
          noHeader
          pagination
          conditionalRowStyles={conditionalRowStyles}
          columns={advSearchColumns}
          paginationPerPage={7}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
          paginationDefaultPage={currentPage + 1}
          //   paginationComponent={CustomPagination}
          data={dataToRender()}
          onRowClicked={(row) => openDetailsModal(row)}
          highlightOnHover={true}
          pointerOnHover={true}
        // selectableRowsComponent={BootstrapCheckbox}
        /> : <h4 className="d-flex text-center align-items-center justify-content-center mb-5">Loading Job Ticket information</h4>}

      </Card>
      <AddNewModal
        open={modal}
        handleModal={handleModal}
        handleAddJobTicket={handleAddJobTicket}
        toAddNewJobTicket={toAddNewJobTicket}
        closeModal={closeModal}
        row={row}
        setRow={setRow}
        handleUpdate={handleUpdate}
      />
      <div className='theme-modal-danger'>
        <Modal
          isOpen={modalAlert}
          toggle={toggleModal}
          className='modal-dialog-centered'
          modalClassName="modal-danger"
        >
          <ModalHeader toggle={toggleModal}>Delete Record</ModalHeader>
          <ModalBody>
            Are you sure you want to delete?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => { handleDeleteJobTicket(rowId) }} >
              Delete
            </Button>
            <Button color='secondary' onClick={toggleModal} outline>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <div className='vertically-centered-modal'>
        <Modal isOpen={detailsModal} toggle={() => setDetailsModal(!detailsModal)} className='modal-dialog-centered modal-xl'>
          <ModalHeader className="d-flex justify-content-center" toggle={() => setDetailsModal(!detailsModal)}>Job Details</ModalHeader>
          <ModalBody>
            <TabsVerticalLeft item={modalDetails} />
          </ModalBody>
        </Modal>
      </div>
    </Fragment>
  )
}

export default DataTableAdvSearch
