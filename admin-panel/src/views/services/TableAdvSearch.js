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
import { MoreVertical, Edit, ChevronDown, Plus, Trash, Eye, EyeOff, Edit3, Upload, Loader, Check, XCircle, Search } from 'react-feather'
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

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { gql, useMutation, useQuery } from '@apollo/client'
import ButtonGroup from 'reactstrap/lib/ButtonGroup'
import Badge from 'reactstrap/lib/Badge'
import TabsVerticalLeft from './TabsVerticalLeft'
import { useNiceQuery } from '../../utility/Utils'

const PAGINATE  = 10

const GET_CALLOUT = gql`
query GetCallout($offset: Int, $limit: Int, $where: callout_bool_exp = {}) {
  callout(order_by: {id: desc}, offset: $offset, limit: $limit, where: $where) {
    id
    callout_by_email
    property_id
    job_type
    urgency_level
    category
    active
    request_time
    status
    description
    inserted_by
    updated_by
    picture1
    picture2
    picture3
    picture4
    video
    property {
      id
      city
      country
      community
      address
      comments
      type
    }
    client_callout_email {
      id
      full_name
      email
    }
    pre_pics {
      picture_location
      upload_time
      id
    }
    postpics {
      id
      picture_location
      upload_time
    }
    job_history {
      id
      updated_by
      status_update
      time
      location
    }
    job_worker {
      worker {
        id
        full_name
        email
        team_id
      }
    }
    callout_job {
      feedback
      instructions
      rating
      signature
      solution
    }
    schedulers {
      id
      date_on_calendar
      time_on_calendar
    }
  }
  callout_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}
`

const DataTableAdvSearch = () => {

  // ** States
  const [currentPage, setCurrentPage] = useState(0)
  const [searchEmail, setSearchEmail] = useState('')
  const [searchCalloutId, setSearchCalloutId] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  
  const variables = {}

  if (searchCalloutId) {
    variables.offset = 0
    if (searchEmail || searchStatus) {
      variables.where = { id: { _eq: searchCalloutId }, callout_by_email: {_ilike:  `%${searchEmail}%`}, status: {_ilike: `%${searchStatus}%`} }  
    } else {
      variables.where = { id: { _eq: searchCalloutId }}
    }
  } else if (searchEmail || searchStatus) {
    variables.where = {  id: { _gt: 0 }, callout_by_email: {_ilike:  `%${searchEmail}%`}, status: {_ilike: `%${searchStatus}%`} }  
  } else {
    variables.limit = PAGINATE
    variables.offset = ((currentPage + 1) * PAGINATE) - PAGINATE
  }

  const { loading, data, error } = useNiceQuery(GET_CALLOUT, {
    variables
  })
  const [modal, setModal] = useState(false)
  const [detailsModal, setDetailsModal] = useState(false)
  const [modalDetails, setModalDetails] = useState(null)
  const [searchName, setSearchName] = useState('')
  const [searchType, setSearchType] = useState('')
  const [description, setDescription] = useState('')
  const [filteredData, setFilteredData] = useState([])

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
    { value: "Requested", label: "Requested" },
    { value: "Planned", label: "Planned" },
    { value: "Assigned", label: "Assigned" },
    { value: "In Progress", label: "In Progress" },
    { value: "Closed", label: "Closed" },
    { value: "Cancelled", label: "Cancelled" }
  ]

  //** Function to open details modal */
  const openDetailsModal = (item) => {
      console.log(item)
      setDetailsModal(true)
      setModalDetails(item) //set row value 
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
      name: 'Callout by',
      selector: 'callout_by_email',
      sortable: true,
      wrap: true,
      minWidth: '150px',
      cell: row => (
        row?.callout_by_email ? row?.callout_by_email : "No Email"
      )
    },
    {
      name: 'Property Address',
      selector: 'property.address',
      sortable: true,
      wrap: true,
      minWidth: '150px',
      cell: row => (
        row?.property?.address ? row?.property?.address : "No Address"
      )
    },
    {
      name: 'Job Type',
      selector: 'job_type',
      sortable: true,
      minWidth: '150px',
      wrap: true,
      cell: row => (
        row?.job_type ? row?.job_type : "No Job type"
      )
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      minWidth: '100px',
      wrap: true,
      cell: row => (
        row?.status ? row?.status : "No Status"
      )
    },
    {
      name: 'Urgency',
      selector: 'urgency_level',
      sortable: true,
      minWidth: '50px',
      wrap: true,
      cell: row => {
        if (row?.urgency_level) {
          return (
            <Badge color={row?.urgency_level === 'High' ? 'light-danger' : 'light-success'} pill>
              {row?.urgency_level}
            </Badge>
          )
        } else {
          return "No Urgency"
        }
      }
    },
    {
      name: 'Category',
      selector: 'category',
      sortable: true,
      minWidth: '150px',
      cell: row => (
        row?.category ? row?.category : "No Category"
      )
    }
  ]

  // ** Table data to render
  const dataToRender = () => {

      return data
    
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={''}
      nextLabel={''}
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={dataToRender()?.callout_aggregate.aggregate.count / PAGINATE}
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

  // ** Function to handle Occupation filter
  const handleEmailFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchStatus?.length) {
        return filteredData
      } else {
        return data?.callout
      }
    }

    setSearchEmail(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item?.callout_by_email?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item?.callout_by_email?.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData([...updatedData])
      setSearchEmail(value)
    }
  }

  // ** Function to handle Callout ID filter
  const handleCalloutIdFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchStatus?.length || searchEmail.length) {
        return filteredData
      } else {
        return data?.callout
      }
    }

    setSearchCalloutId(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item?.id?.toString().startsWith(value.toLowerCase())

        const includes = item?.id?.toString().includes(value.toLowerCase())

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

  //handle status filter
  const handleStatusFilter = e => {
    console.log(e)
    const value = e?.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchEmail.length) {
       return filteredData
     } else {
    return data?.callout
      }
  }
  setSearchStatus(value)
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
    setSearchCalloutId("")
    setSearchStatus("")
  }
  
  const beginSearch = () => {

  }
  
  return (
    <Fragment>
      <Card>        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Callout Search</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
          { (searchEmail || searchStatus || searchCalloutId) && <><Button className='ml-2' color='danger' outline onClick={() => clearRecord()}>
              <XCircle size={15} />
              <span className='align-middle ml-50'>Clear filter</span>
            </Button>
              <Button className='ml-2' color='primary' onClick={() => beginSearch()}>
              <Search size={15} />
              <span className='align-middle ml-50'>Search</span>
            </Button></>}
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
                <Label for='type'>Status Type:</Label>
                <Select
                  onChange={(e) => setSearchStatus(e?.value ?? "")}
                  className='react-select'
                  classNamePrefix='select'
                  defaultValue={searchStatus}
                  placeholder="Select Status"
                  options={statusOptions}
                  isClearable={true}
                />
              </FormGroup>
            </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='calloutId'>Callout ID:</Label>
                <Input id='calloutId' type="number" placeholder='Search callout id' value={searchCalloutId} onChange={(e) => setSearchCalloutId(e.target.value)} />
              </FormGroup>
            </Col>          <Col lg='4' md='6'>
              <FormGroup>
                <Label for='email'>Client Email:</Label>
                <Input id='email' placeholder='AC not working' value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
        {/* <Exportqs InData={dataToExport()}></Exportqs> */}
        {!loading ? <DataTable
          noHeader
          pagination
          columns={advSearchColumns}
          paginationPerPage={(currentPage + 1) * PAGINATE}
          className='react-dataTable'
          sortIcon={<ChevronDown size={(currentPage + 1) * PAGINATE} />}
          paginationDefaultPage={currentPage + 1}
            paginationComponent={CustomPagination}
          data={dataToRender()?.callout}
          onRowClicked={(row) => openDetailsModal(row)}
          highlightOnHover={true}
          pointerOnHover={true}
        // selectableRowsComponent={BootstrapCheckbox}
        /> : <h4 className="d-flex text-center align-items-center justify-content-center mb-5">Loading Callouts information</h4>}

      </Card>
      <div className='vertically-centered-modal'>
        <Modal isOpen={detailsModal} toggle={() => setDetailsModal(!detailsModal)} className='modal-dialog-centered modal-xl'>
          <ModalHeader className="d-flex justify-content-center" toggle={() => setDetailsModal(!detailsModal)}>Callout Details</ModalHeader>
          <ModalBody>
            <TabsVerticalLeft item={modalDetails} />
          </ModalBody>
        </Modal>
      </div>
    </Fragment>
  )
}

export default DataTableAdvSearch
