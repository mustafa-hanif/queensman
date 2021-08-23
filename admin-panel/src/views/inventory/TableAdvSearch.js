// ** React Imports
import { useState, Fragment, forwardRef } from "react"

import { auth } from "../../utility/nhost"
const fetch = require("node-fetch")
const FormData = require("form-data")

// ** Custom Components
import Avatar from "@components/avatar"

// ** Third Party Components
import ReactPaginate from "react-paginate"
import DataTable from "react-data-table-component"
import { toast } from "react-toastify"
import {
  MoreVertical,
  Edit,
  ChevronDown,
  Plus,
  Trash,
  Eye,
  EyeOff,
  Edit3,
  Upload,
  Loader,
  Check
} from "react-feather"
import {
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Input,
  Label,
  FormGroup,
  Row,
  Col,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap"
import Select from 'react-select'
// ** Toast Component
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
//for export
import Exportqs from '../extensions/import-export/Exportqs'
// ** Bootstrap Checkbox Component
// const BootstrapCheckbox = forwardRef(({ onClick, ...rest }, ref) => {
//     return (
// <div className='custom-control custom-checkbox'>
//     <input type='checkbox' className='custom-control-input' ref={ref} {...rest} />
//     <label className='custom-control-label' onClick={onClick} />
//   </div>
//     )
// })

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss"
import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client"
import AddNewModal from "./AddNewModal"
import moment from "moment"
import axios from "axios"
import TabsVerticalLeft from "./TabsVerticalLeft"

const GET_INVENTORY = gql`
query GetInventory {
  inventory_report(order_by: {id: desc}) {
    id
    property_id
    ops_team_id
    inspection_done_by
    summary
    approved
    checked_on
    inventory_rooms {
      id
      inventory_report_id
      room
      inventory_articles {
        id
        inventory_room_id
        type
        description
        inspection
        work_description
        remarks
        work_description
      }
      inventory_pictures {
        id
        inventory_room_id
        picture_location
        upload_time
      }
    }
    property {
      id
      address
      city
      country
      community
    }
    inventory_report_pdfs {
      report_location
      report_upload_date
      report_updated_date
      id
    }
  }
}
`
const GET_CLIENT = gql`
query MyQuery($property_id: Int!) {
  client(where: {property_owneds: {property_id: {_eq: $property_id}}}) {
    id
    email
    full_name
    account_type
  }
}
`

// const UPDATE_CLIENT = gql`
// `
// const ADD_CLIENT = gql`
// `

// const DELETE_CLIENT = gql`
// `

const DataTableAdvSearch = () => {
  // ** States
  const { loading, data, error } = useQuery(GET_INVENTORY)
  const [property_id, setPropertyId] = useState(null)
  const [getClient, { propertyLoading, data: allProperty, propertyError }] = useLazyQuery(GET_CLIENT, {
    variables: { property_id }
  })
  // const [updateClient, { loading: clientLoading }] = useMutation(
  //   UPDATE_CLIENT,
  //   { refetchQueries: [{ query: GET_INVENTORY }] }
  // )
  // const [addClient, { loading: addClientLoading }] = useMutation(ADD_CLIENT, {
  //   refetchQueries: [{ query: GET_INVENTORY }]
  // })
  // const [deleteClient, { loading: deleteClientLoading }] = useMutation(
  //   DELETE_CLIENT,
  //   { refetchQueries: [{ query: GET_INVENTORY }] }
  // )

  const [modal, setModal] = useState(false)
  const [searchReportId, setSearchReportId] = useState("")
  const [searchInspectionBy, setsearchInspectionBy] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [searchAddress, setsearchAddress] = useState("")
  const [searchStatus, setsearchStatus] = useState("")
  const [filteredData, setFilteredData] = useState([])
  const [toAddNewRecord, setToAddNewRecord] = useState(false)
  const [row, setRow] = useState(null)
  const [rowId, setRowId] = useState(null)

  const [modalAlert, setModalAlert] = useState(null)
  const [detailsModal, setDetailsModal] = useState(false)
  const [modalDetails, setModalDetails] = useState(null)
  const StatusOptions = [
    { value: "", label: "All" },
    { value: 0, label: "Unapproved" },
    { value: 1, label: "Review" },
    { value: 2, label: "Approval" },
    { value: 3, label: "Approved" }

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
    setPropertyId(item.property_id)
    console.log(item)
    getClient()
    // if (!propertyLoading) {
    // console.log(allProperty)
    // console.log({...item, ...allProperty})
    // }

    // item = [...item, allProperty]
    setDetailsModal(true)

    setModalDetails(item) //set row value
  }

  // ** Function to handle Modal toggle
  const handleModal = (row) => {
    setRow(row)
    setTimeout(() => {
      setModal(!modal)
    }, 200)
    setToAddNewRecord(false)
  }

  // ** Function to handle Pagination
  const handlePagination = (page) => setCurrentPage(page.selected)

  // ** Table Columns
  const advSearchColumns = [
    {
      name: "Report ID",
      selector: "id",
      sortable: true,
      minWidth: "140px"
    },
    {
      name: "Property Address",
      selector: "property.address",
      sortable: true,
      minWidth: "250px",
      wrap: true,
      compact: false
    },
    {
      name: "Inspection Done By",
      selector: "inspection_done_by",
      sortable: true,
      minWidth: "200px",
      wrap: true,
      cell: row => (
        row?.inspection_done_by === "" ? "No data" : row?.inspection_done_by
      )
    },
    {
      name: "Approved",
      selector: "approved",
      sortable: true,
      minWidth: "150px",
      cell: row => {
        return (
          <Badge color={row?.approved === 3 ? 'light-success' : row?.approved === 2 ? 'light-warning' : row?.approved === 1 ? 'light-info' : 'light-danger'} pill>
            {row?.approved === 3 ? "Approved" : row?.approved === 2 ? "Approval" : row?.approved === 1 ? "Review" : "Unapproved"}
          </Badge>
        )
      }
    },
    {
      name: "PDF upload date",
      selector: "inventory_report_pdfs.report_updated_date",
      sortable: true,
      minWidth: "300px",
      wrap: true,
      cell: row => {
        return (
          row?.inventory_report_pdfs?.[0]?.report_updated_date ? moment(row?.inventory_report_pdfs?.[0]?.report_updated_date).format('MMMM Do YYYY, h:mm:ss a') : "No file uploaded"
        )
      }
    },
    {
      name: "Date",
      selector: "checked_on",
      sortable: true,
      minWidth: "300px",
      cell: row => {
        return (
          row?.checked_on ? moment(row?.checked_on).format('MMMM Do YYYY, h:mm:ss a') : "No file uploaded"
        )
      }
    }
  ]

  // ** Table data to render
  const dataToRender = () => {
    if (
      searchReportId.length ||
      searchInspectionBy.length ||
      searchAddress.length ||
      searchStatus
    ) {
      return filteredData
    } else {
      return data?.inventory_report
    }
  }

  const handleUpdate = (updatedRow) => {
    // auth.requestPasswordChange(updatedRow.email)
    // console.log(updatedRow)
    // updateClient({
    //   variables: {
    //     id: updatedRow.id,
    //     email: updatedRow.email,
    //     full_name: updatedRow.full_name,
    //     gender: updatedRow.gender,
    //     occupation: updatedRow.occupation,
    //     organization: updatedRow.organization,
    //     phone: updatedRow.phone,
    //     password: updatedRow.password,
    //     active: updatedRow.active,
    //     sec_email: updatedRow.sec_email,
    //     sec_phone: updatedRow.sec_phone,
    //     account_type: updatedRow.account_type,
    //     age_range: updatedRow.age_range,
    //     family_size: updatedRow.family_size,
    //     ages_of_children: updatedRow.ages_of_children,
    //     earning_bracket: updatedRow.earning_bracket,
    //     nationality: updatedRow.nationality,
    //     years_expatriate: updatedRow.years_expatriate,
    //     years_native: updatedRow.years_native,
    //     referred_by: updatedRow.referred_by,
    //     other_properties: updatedRow.other_properties,
    //     contract_start_date: updatedRow.contract_start_date,
    //     contract_end_date: updatedRow.contract_end_date,
    //     sign_up_time: updatedRow.sign_up_time,
    //   },
    // }).then(() => {
    //   toast.success(
    //     <ToastComponent
    //       title="Client Updated"
    //       color="success"
    //       icon={<Check />}
    //     />,
    //     {
    //       autoClose: 2000,
    //       hideProgressBar: true,
    //       closeButton: false,
    //     }
    //   )
    // })
    // dataToRender()
    // if (!clientLoading) {
    //   setModal(!modal)
    // }
  }

  const addClientRecord = () => {
    setToAddNewRecord(true)
    setRow({ active: 1 })
    setTimeout(() => {
      setModal(!modal)
    }, 200)
  }

  const handleAddRecord = (newRow) => {
    console.log("Addin")
    // addClient({
    //   variables: {
    //   }
    // }).then(() => {
    //   auth.register({
    //     email: newRow.email,
    //     password: newRow.password,
    //     options: { userData: { display_name: newRow.full_name } }
    //   })
    //   toast.success(<SuccessToast data={newRow} />, { hideProgressBar: true })
    // })

    // if (!addClientLoading) {
    //   setModal(!modal)
    // }
  }

  const handleDeleteRecord = (id) => {
    deleteClient({
      variables: {
        id
      }
    })
    dataToRender()
    if (!deleteClientLoading) {
      toggleModal()
    }
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={""}
      nextLabel={""}
      forcePage={currentPage}
      onPageChange={(page) => handlePagination(page)}
      pageCount={dataToRender().length / 7 || 1}
      breakLabel={"..."}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName={"active"}
      pageClassName={"page-item"}
      nextLinkClassName={"page-link"}
      nextClassName={"page-item next"}
      previousClassName={"page-item prev"}
      previousLinkClassName={"page-link"}
      pageLinkClassName={"page-link"}
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName={
        "pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
      }
    />
  )

  // ** Function to handle reportId filter
  const handleReportIdFilter = (e) => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (
        searchAddress.length ||
        searchReportId.length ||
        searchInspectionBy.length ||
        searchStatus.length
      ) {
        return filteredData
      } else {
        return data?.inventory_report
      }
    }

    setSearchReportId(value)
    if (value.length) {
      updatedData = dataToFilter().filter((item) => {

        const startsWith = item.id?.toString().startsWith(value.toLowerCase())

        const includes = item.id
          ?.toString().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData([...updatedData])
      setSearchReportId(value)
    }
  }


  // ** Function to handle InspectionBy filter
  const handleInspectionByFilter = (e) => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (
        searchAddress.length ||
        searchReportId.length ||
        searchInspectionBy.length ||
        searchStatus.length
      ) {
        return filteredData
      } else {
        return data?.inventory_report
      }
    }

    setsearchInspectionBy(value)
    if (value.length) {
      updatedData = dataToFilter().filter((item) => {
        const startsWith = item.inspection_done_by
          ?.toLowerCase()
          .startsWith(value.toLowerCase())

        const includes = item.inspection_done_by
          ?.toLowerCase()
          .includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData([...updatedData])
      setsearchInspectionBy(value)
    }
  }


  // ** Function to handle Address filter
  const handleAddressFilter = (e) => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (
        searchAddress.length ||
        searchReportId.length ||
        searchInspectionBy.length ||
        searchStatus.length
      ) {
        return filteredData
      } else {
        return data?.inventory_report
      }
    }

    setsearchAddress(value)
    if (value.length) {
      updatedData = dataToFilter().filter((item) => {
        const startsWith = item.property.address
          ?.toLowerCase()
          .startsWith(value.toLowerCase())

        const includes = item.property.address
          ?.toLowerCase()
          .includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData([...updatedData])
      setsearchAddress(value)
    }
  }
  // ** Function to handle Status filter
  const handleStatusFilter = (e) => {

    const value = e.value

    let updatedData = []
    const dataToFilter = () => {
      return data?.inventory_report
    }

    setsearchStatus(value)
    if (value >= 0) {
      updatedData = dataToFilter().filter((item) => {
        if (item.approved === value) {
          return item.approved
        } else {
          return null
        }
      })
      console.log(updatedData)
      setFilteredData([...updatedData])
      setsearchStatus(value)
    }
  }
  //for export data start
  //=================================
  const createExportObject = (DataTojson) => {
    const objectsToExport = []

    for (const keys in DataTojson) {
      objectsToExport.push({
        id: DataTojson[keys].id.toString(),
        propert_address: DataTojson[keys].property.address,
        inspection_done_by: DataTojson[keys].inspection_done_by,
        status: DataTojson[keys]?.approved


      })

    }
    //   console.log((objectsToExport))
    return (objectsToExport)

  }
  const dataToExport = () => {
    if (
      searchAddress.length ||
      searchReportId.length ||
      searchInspectionBy.length

    ) {
      return createExportObject(filteredData)
    } else {
      return createExportObject(data?.inventory_report)
    }
  }
  //for export data end
  //=================================


  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Inventory Search</CardTitle>
          {/* <div className="d-flex mt-md-0 mt-1">
            <Button className="ml-2" color="primary" onClick={addClientRecord}>
              <Plus size={15} />
              <span className="align-middle ml-50">Add Record</span>
            </Button>
          </div> */}
        </CardHeader>
        <CardBody>
          <Row form className="mt-1 mb-50">
            <Col lg="4" md="6">
              <FormGroup>
                <Label for="reportid">Report id:</Label>
                <Input
                  id="reportid"
                  placeholder="999"
                  value={searchReportId}
                  onChange={handleReportIdFilter}
                />
              </FormGroup>
            </Col>
            <Col lg="4" md="6">
              <FormGroup>
                <Label for="Address">Address:</Label>
                <Input
                  id="Address"
                  placeholder="Discovery garden"
                  value={searchAddress}
                  onChange={handleAddressFilter}
                />
              </FormGroup>
            </Col>
            <Col lg="4" md="6">
              <FormGroup>
                <Label for="InspectionBy">Inspection by:</Label>
                <Input
                  id="InspectionBy"
                  placeholder="Name"
                  value={searchInspectionBy}
                  onChange={handleInspectionByFilter}
                />
              </FormGroup>
            </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='type'>Status:</Label>
                {/* <Input id='type' type='select' value={searchType} onChange={handleTypeFilter} placeholder="Type"> */}
                <Select
                  onChange={handleStatusFilter}
                  className='react-select'
                  classNamePrefix='select'
                  defaultValue={searchStatus}
                  placeholder="Select Status"
                  options={StatusOptions}
                  isClearable={false}
                />
                {/* <option>Deferred</option>
                  <option>Additional Request</option>
                  <option>Full Job</option>
                  <option>Material Request</option>
                  <option>Request for quotation</option>
                  <option>Patch Job</option>
                </Input> */}
              </FormGroup>
            </Col>
            <Exportqs InData={dataToExport()} />
          </Row>
        </CardBody>

        {!loading ? (
          <DataTable
            noHeader
            pagination
            // selectableRows
            columns={advSearchColumns}
            paginationPerPage={7}
            className="react-dataTable"
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            // paginationComponent={CustomPagination}
            data={dataToRender()}
            onRowClicked={(row) => openDetailsModal(row)}
            highlightOnHover={true}
            pointerOnHover={true}
          // selectableRowsComponent={BootstrapCheckbox}
          />
        ) : (
          <h4 className="d-flex text-center align-items-center justify-content-center mb-5">
            Loading Inventory information
          </h4>
        )}
      </Card>
      <AddNewModal
        open={modal}
        handleModal={handleModal}
        handleAddRecord={handleAddRecord}
        toAddNewRecord={toAddNewRecord}
        closeModal={closeModal}
        row={row}
        setRow={setRow}
        handleUpdate={handleUpdate}
      />
      <div className="theme-modal-danger">
        <Modal
          isOpen={modalAlert}
          toggle={toggleModal}
          className="modal-dialog-centered"
          modalClassName="modal-danger"
        >
          <ModalHeader toggle={toggleModal}>Delete Record</ModalHeader>
          <ModalBody>Are you sure you want to delete?</ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onClick={() => {
                handleDeleteRecord(rowId)
              }}
            >
              Delete
            </Button>
            <Button color="secondary" onClick={toggleModal} outline>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <div className="vertically-centered-modal">
        <Modal
          isOpen={detailsModal}
          toggle={() => setDetailsModal(!detailsModal)}
          className="modal-dialog-centered modal-xl"
        >
          <ModalHeader className="d-flex justify-content-center" toggle={() => setDetailsModal(!detailsModal)}>
            Inventory Details
          </ModalHeader>
          <ModalBody>
            <TabsVerticalLeft item={modalDetails} allProperty={allProperty} GET_INVENTORY={GET_INVENTORY}/>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => setDetailsModal(!detailsModal)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Fragment>
  )
}

export default DataTableAdvSearch
