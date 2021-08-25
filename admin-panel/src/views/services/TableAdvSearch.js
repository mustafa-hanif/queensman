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

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { gql, useMutation, useQuery } from '@apollo/client'
import ButtonGroup from 'reactstrap/lib/ButtonGroup'
import Badge from 'reactstrap/lib/Badge'
import TabsVerticalLeft from './TabsVerticalLeft'

const GET_CALLOUT = gql`
query GetCallout {
    callout(order_by: {id: desc}) {
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
        id
      }
      postpics {
        id
        picture_location
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
  }
`

const DataTableAdvSearch = () => {

  // ** States
  const { loading, data, error } = useQuery(GET_CALLOUT)
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
        row?.category ? row?.job_type : "No Category"
      )
    }
  ]

  // ** Table data to render
  const dataToRender = () => {
    if (
      searchStatus?.length || searchCalloutId.length
    ) {
      return filteredData
    } else {
      return data?.callout
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
      if (searchStatus?.length) {
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
      if (searchCalloutId.length) {
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
          <CardTitle tag='h4'>Callout Search</CardTitle>
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
            {/* <Col lg='4' md='6'>
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
            </Col> */}
            {/* <Col lg='4' md='6'>
              <FormGroup>
                <Label for='organization'>Organization:</Label>
                <Input id='organization' placeholder='San Diego' value={teamId} onChange={handleOrganizationFilter} />
              </FormGroup>
            </Col> */}
            {/* <Col lg='4' md='6'>
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
            </Col> */}
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
