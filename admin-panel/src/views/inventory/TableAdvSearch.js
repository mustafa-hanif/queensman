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
import ButtonGroup from "reactstrap/lib/ButtonGroup"
import { months } from "moment"
import axios from "axios"
import TabsVerticalLeft from "./TabsVerticalLeft"

const GET_INVENTORY = gql`
query GetInventory {
  inventory_report {
    id
    property_id
    ops_team_id
    inspection_done_by
    summary
    approved
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

const UPDATE_CLIENT = gql`
  mutation UpdateClient(
    $id: Int!
    $email: String
    $full_name: String
    $gender: String
    $occupation: String
    $organization: String
    $phone: String
    $active: smallint
    $sec_email: String
    $sec_phone: String
    $account_type: String
    $age_range: String
    $family_size: Int
    $ages_of_children: String
    $earning_bracket: String
    $nationality: String
    $years_expatriate: Int
    $years_native: Int
    $referred_by: Int
    $other_properties: String
    $contract_start_date: date
    $contract_end_date: date
    $sign_up_time: timestamp
    $password: String
  ) {
    update_client_by_pk(
      pk_columns: { id: $id }
      _set: {
        id: $id
        email: $email
        full_name: $full_name
        gender: $gender
        occupation: $occupation
        organization: $organization
        phone: $phone
        password: $password
        active: $active
        sec_email: $sec_email
        sec_phone: $sec_phone
        account_type: $account_type
        age_range: $age_range
        family_size: $family_size
        ages_of_children: $ages_of_children
        earning_bracket: $earning_bracket
        nationality: $nationality
        years_expatriate: $years_expatriate
        years_native: $years_native
        referred_by: $referred_by
        other_properties: $other_properties
        contract_start_date: $contract_start_date
        contract_end_date: $contract_end_date
        sign_up_time: $sign_up_time
      }
    ) {
      id
    }
  }
`
const ADD_CLIENT = gql`
  mutation AddClient(
    $email: String
    $full_name: String
    $gender: String
    $occupation: String
    $organization: String
    $phone: String
    $active: smallint
    $sec_email: String
    $sec_phone: String
    $account_type: String
    $age_range: String
    $family_size: Int
    $ages_of_children: String
    $earning_bracket: String
    $nationality: String
    $years_expatriate: Int
    $years_native: Int
    $referred_by: Int
    $other_properties: String
    $contract_start_date: date
    $contract_end_date: date
    $password: String
  ) {
    insert_client_one(
      object: {
        email: $email
        full_name: $full_name
        gender: $gender
        occupation: $occupation
        organization: $organization
        phone: $phone
        password: $password
        active: $active
        sec_email: $sec_email
        sec_phone: $sec_phone
        account_type: $account_type
        age_range: $age_range
        family_size: $family_size
        ages_of_children: $ages_of_children
        earning_bracket: $earning_bracket
        nationality: $nationality
        years_expatriate: $years_expatriate
        years_native: $years_native
        referred_by: $referred_by
        other_properties: $other_properties
        contract_start_date: $contract_start_date
        contract_end_date: $contract_end_date
      }
    ) {
      id
    }
  }
`

const DELETE_CLIENT = gql`
  mutation DeleteClient($id: Int!) {
    delete_client_by_pk(id: $id) {
      id
    }
  }
`
const UPDATE_CLIENT_HASPLAN = gql`
  mutation UpdateHasPLan($id: Int!, $hasPlan: Boolean!) {
    update_client_by_pk(pk_columns: { id: $id }, _set: { hasPlan: $hasPlan }) {
      hasPlan
    }
  }
`
const UPLOAD_PLAN = gql`
  mutation AddCallout(
    $date_on_calendar: date
    $callout_by: Int
    $notes: String
    $time_on_calendar: time
    $end_time_on_calendar: time
    $end_date_on_calendar: date
    $email: String
    $property_id: Int
  ) {
    insert_scheduler_one(
      object: {
        callout: {
          data: {
            callout_by_email: $email
            callout_by: $callout_by
            property_id: $property_id
            category: "Uncategorized"
            job_type: "Scheduled Services"
            status: "Planned"
            urgency_level: "Scheduled"
            active: 1
          }
        }
        date_on_calendar: $date_on_calendar
        time_on_calendar: $time_on_calendar
        end_time_on_calendar: $end_time_on_calendar
        end_date_on_calendar: $end_date_on_calendar
        notes: "Scheduled Services"
      }
    ) {
      date_on_calendar
    }
  }
`

const DELETE_PLAN = gql`
  mutation MyMutation($email: String, $callout_id: Int!) {
    delete_callout(
      where: {
        _or: { callout_by_email: { _eq: $email } }
        callout_by: { _eq: $callout_id }
      }
    ) {
      affected_rows
    }
  }
`

const DataTableAdvSearch = () => {
  // ** States
  const { loading, data, error } = useQuery(GET_INVENTORY)
  const [property_id, setPropertyId] = useState(null)
  const [getClient, { propertyLoading, data: allProperty, propertyError }] = useLazyQuery(GET_CLIENT, {
    variables: { property_id }
  })
  const [updateClient, { loading: clientLoading }] = useMutation(
    UPDATE_CLIENT,
    { refetchQueries: [{ query: GET_INVENTORY }] }
  )
  const [addClient, { loading: addClientLoading }] = useMutation(ADD_CLIENT, {
    refetchQueries: [{ query: GET_INVENTORY }]
  })
  const [deleteClient, { loading: deleteClientLoading }] = useMutation(
    DELETE_CLIENT,
    { refetchQueries: [{ query: GET_INVENTORY }] }
  )
  const [addPlan, { loading: addPlanLoading }] = useMutation(UPLOAD_PLAN)
  const [deletePlan, { loading: deletePlanLoading }] = useMutation(DELETE_PLAN)
  const [updateClientPlan] = useMutation(UPDATE_CLIENT_HASPLAN, {
    refetchQueries: [{ query: GET_INVENTORY }]
  })
  const [modal, setModal] = useState(false)
  const [searchReportId, setSearchReportId] = useState("")
  const [searchInspectionBy, setsearchInspectionBy] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [searchAddress, setsearchAddress] = useState("")
  const [searchOrganization, setSearchOrganization] = useState("")
  const [searchPhone, setSearchPhone] = useState("")
  const [searchGender, setSearchGender] = useState("")
  const [filteredData, setFilteredData] = useState([])
  const [toAddNewRecord, setToAddNewRecord] = useState(false)
  const [row, setRow] = useState(null)
  const [rowId, setRowId] = useState(null)

  const [modalAlert, setModalAlert] = useState(null)
  const [detailsModal, setDetailsModal] = useState(false)
  const [modalDetails, setModalDetails] = useState(null)

  const toggleModal = () => {
    setModalAlert(!modalAlert)
  }

  const SuccessToast = ({ data }) => {
    return (
      <Fragment>
        <div className='toastify-header'>
          <div className='title-wrapper'>
            <Avatar size='sm' color='success' icon={<Check size={12} />} />
            <h6 className='toast-title'>Form Submitted!</h6>
          </div>
        </div>
        <div className='toastify-body'>
          <ul className='list-unstyled mb-0'>
            <li>
              <strong>firstName</strong>: {data.firstName}
            </li>
            <li>
              <strong>lastName</strong>: {data.lastName}
            </li>
            <li>
              <strong>email</strong>: {data.email}
            </li>
          </ul>
        </div>
      </Fragment>
    )
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
    console.log(item.property_id)
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
      minWidth: "10px"
    },
    {
      name: "Property Address",
      selector: "property.address",
      sortable: true,
      minWidth: "300px",
      wrap: true,
      compact: false
    },
    {
      name: "Inspection Done By",
      selector: "inspection_done_by",
      sortable: true,
      minWidth: "200px"
    },
    {
      name: "Approved",
      selector: "approved",
      sortable: true,
      minWidth: "150px",
      cell: row => {
        return (
          <Badge color={row?.approved === 1 ? 'light-success' :  'light-danger'} pill>
            {row?.approved === 1 ? "Approved" : "Unapproved"}
          </Badge>
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
      searchPhone.length ||
      searchGender.length ||
      searchOrganization.length
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
    setRow({active: 1})
    setTimeout(() => {
      setModal(!modal)
    }, 200)
  }

  const handleAddRecord = (newRow) => {
    console.log("Addin")
    addClient({
      variables: {
        email: newRow?.email,
        full_name: newRow?.full_name,
        gender: newRow?.gender,
        occupation: newRow?.occupation,
        organization: newRow?.organization,
        phone: newRow?.phone,
        password: newRow?.password,
        active: newRow?.active,
        sec_email: newRow?.sec_email,
        sec_phone: newRow?.sec_phone,
        account_type: newRow?.account_type,
        age_range: newRow?.age_range,
        family_size: newRow?.family_size,
        ages_of_children: newRow?.ages_of_children,
        earning_bracket: newRow?.earning_bracket,
        nationality: newRow?.nationality,
        years_expatriate: newRow?.years_expatriate,
        years_native: newRow?.years_native,
        referred_by: newRow?.referred_by,
        other_properties: newRow?.other_properties,
        contract_start_date: newRow?.contract_start_date,
        contract_end_date: newRow?.contract_end_date
      }
    }).then(() => {
      auth.register({
        email: newRow.email,
        password: newRow.password,
        options: { userData: { display_name: newRow.full_name } }
      })
      toast.success(<SuccessToast data={newRow} />, { hideProgressBar: true })
    })
    
    const url = 'https://y8sr1kom3g.execute-api.us-east-1.amazonaws.com/dev/sendWelcomeEmail'
    const data = new URLSearchParams()
    data.set('clientName', newRow.full_name)
    data.set('clientEmail', newRow.email)

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: data.toString()
    })
    dataToRender()
    if (!addClientLoading) {
      setModal(!modal)
    }
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
        searchOrganization.length ||
        searchPhone.length ||
        searchGender.length
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
        searchOrganization.length ||
        searchPhone.length ||
        searchGender.length
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

  // ** Function to handle organization filter
  const handleOrganizationFilter = (e) => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (
        searchAddress.length ||
        searchReportId.length ||
        searchInspectionBy.length ||
        searchOrganization.length ||
        searchPhone.length ||
        searchGender.length
      ) {
        return filteredData
      } else {
        return data?.inventory_report
      }
    }

    setSearchOrganization(value)
    if (value.length) {
      updatedData = dataToFilter().filter((item) => {
        const startsWith = item?.organization
          ?.toLowerCase()
          .startsWith(value.toLowerCase())

        const includes = item?.organization
          ?.toLowerCase()
          .includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData([...updatedData])
      setSearchOrganization(value)
    }
  }

  // ** Function to handle phone filter
  const handlePhoneFilter = (e) => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (
        searchAddress.length ||
        searchReportId.length ||
        searchInspectionBy.length ||
        searchOrganization.length ||
        searchPhone.length ||
        searchGender.length
      ) {
        return filteredData
      } else {
        return data?.inventory_report
      }
    }

    setSearchPhone(value)
    if (value.length) {
      updatedData = dataToFilter().filter((item) => {
        const startsWith = item.phone
          ?.toLowerCase()
          .startsWith(value.toLowerCase())

        const includes = item.phone
          ?.toLowerCase()
          .includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData([...updatedData])
      setSearchPhone(value)
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
      searchOrganization.length ||
      searchPhone.length ||
      searchGender.length
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

  // ** Function to handle gender filter
  const handleGenderFilter = (e) => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (
        searchAddress.length ||
        searchReportId.length ||
        searchInspectionBy.length ||
        searchOrganization.length ||
        searchPhone.length ||
        searchGender.length
      ) {
        return filteredData
      } else {
        return data?.inventory_report
      }
    }

    setSearchGender(value)
    if (value.length) {
      updatedData = dataToFilter().filter((item) => {
        const startsWith = item.gender
          ?.toLowerCase()
          .startsWith(value.toLowerCase())

        const includes = item.gender
          ?.toLowerCase()
          .includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData([...updatedData])
      setSearchGender(value)
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
          <CardTitle tag="h4">Advance Search</CardTitle>
          <div className="d-flex mt-md-0 mt-1">
            <Button className="ml-2" color="primary" onClick={addClientRecord}>
              <Plus size={15} />
              <span className="align-middle ml-50">Add Record</span>
            </Button>
          </div>
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
                  onChange={ handleInspectionByFilter}
                />
              </FormGroup>
            </Col>
            
          </Row>
        </CardBody>
        <Exportqs InData={dataToExport()}></Exportqs>
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
          <ModalHeader className="d-flex justify-content-center"  toggle={() => setDetailsModal(!detailsModal)}>
            Inventory Details
          </ModalHeader>
          <ModalBody>
            <TabsVerticalLeft item={modalDetails} allProperty={allProperty} />
          </ModalBody>
        </Modal>
      </div>
    </Fragment>
  )
}

export default DataTableAdvSearch
