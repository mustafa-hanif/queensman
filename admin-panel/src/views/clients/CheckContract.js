// ** React Imports
import { useState, Fragment, forwardRef } from "react"
import { Link, useHistory } from 'react-router-dom'

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
  Edit,
  ChevronDown,
  Plus,
  Check,
  XCircle
} from "react-feather"
import {
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner
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
import { gql, useMutation, useQuery } from "@apollo/client"
import AddNewModal from "./AddNewModal"
import ButtonGroup from "reactstrap/lib/ButtonGroup"
import moment from "moment"
import TabsVerticalLeft from "./TabsVerticalLeft"

const conditionalRowStyles = [
  {
    when: row => moment(row?.contract_end_date) < moment(),
    style: {
      backgroundColor: '#fd9090',
      color: 'black',
      '&:hover': {
        backgroundColor: '#fd9090'
      }
    }
  }
]

const GET_CLIENT = gql`
  query GetClient {
    client(order_by: { id: desc }) {
      id
      email
      full_name
      gender
      occupation
      organization
      phone
      active
      hasPlan
      sec_email
      sec_phone
      account_type
      age_range
      family_size
      ages_of_children
      earning_bracket
      nationality
      years_expatriate
      years_native
      referred_by
      other_properties
      contract_start_date
      contract_end_date
      sign_up_time
      documents {
        document_name
      }
      property_owneds {
        property {
          address
          community
          city
          country
          id
        }
      }
      leases {
        property {
          address
          community
          city
          country
          id
        }
      }
    }
  }
`

const UPDATE_CLIENT = gql`
  mutation UpdateClient(
    $id: Int!
    $email: String
    $full_name: String
    $phone: String
    $active: smallint
    $sec_email: String
    $sec_phone: String
    $account_type: String
    $referred_by: Int
    $contract_start_date: date
    $contract_end_date: date
    $sign_up_time: timestamptz
  ) {
    update_client_by_pk(
      pk_columns: { id: $id }
      _set: {
        id: $id
        email: $email
        full_name: $full_name
        phone: $phone
        active: $active
        sec_email: $sec_email
        sec_phone: $sec_phone
        account_type: $account_type
        referred_by: $referred_by
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
    $phone: String
    $active: smallint
    $sec_email: String
    $sec_phone: String
    $account_type: String
    $referred_by: Int
    $contract_start_date: date
    $contract_end_date: date
  ) {
    insert_client_one(
      object: {
        email: $email
        full_name: $full_name
        phone: $phone
        active: $active
        sec_email: $sec_email
        sec_phone: $sec_phone
        account_type: $account_type
        referred_by: $referred_by
        contract_start_date: $contract_start_date
        contract_end_date: $contract_end_date
      }
    ) {
      id
    }
  }
`

const UPDATE_ACTIVE = gql`
mutation MyMutation($active: Boolean!, $email: citext!) {
  update_auth_accounts(where: {email: {_eq: $email}}, _set: {active: $active}) {
    affected_rows
  }
}`

const DataTableAdvSearch = () => {
  // ** States
  const history = useHistory()
  const [queryLoading, setQueryLoading] = useState(false)
  const [loaderButton, setLoaderButton] = useState(false)
  const { loading, data, error, refetch: refetchClient } = useQuery(GET_CLIENT, {fetchPolicy: 'network-only', nextFetchPolicy: 'network-only'})
  const [updateClient, { loading: clientLoading }] = useMutation(
    UPDATE_CLIENT,
    { refetchQueries: [{ query: GET_CLIENT }] }
  )
  const [addClient, { loading: addClientLoading }] = useMutation(ADD_CLIENT, {
    refetchQueries: [{ query: GET_CLIENT }]
  })
  const [updateClientActive] = useMutation(UPDATE_ACTIVE)
  const [modal, setModal] = useState(false)
  const [searchName, setSearchName] = useState("")
  const [searchOccupation, setSearchOccupation] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [searchEmail, setSearchEmail] = useState("")
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
            <strong>Full name</strong>: {data.full_name}
            </li>
            <li>
              <strong>email</strong>: {data.email}
            </li>
          </ul>
        </div>
      </Fragment>
    )
  }

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


  const closeModal = () => {
    setModal(!modal)
  }

  //** Function to open details modal */
  const openDetailsModal = (item) => {
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
      name: "Id",
      selector: "id",
      sortable: true,
      minWidth: "5px"
    },
    {
      name: "Full Name",
      selector: "full_name",
      sortable: true,
      minWidth: "200px"
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
      minWidth: "230px"
    },
    {
      name: "Phone",
      selector: "phone",
      sortable: true,
      minWidth: "150px"
    },
    {
      name: "Contract Start Date",
      selector: "contract_start_date",
      sortable: true,
      minWidth: "150px",
      cell: (row) => {
        if (row?.contract_start_date) {
          return moment(row?.contract_start_date).format("YYYY-MM-DD")
        } else {
          return "No date"
        }
      }
    },
    {
      name: "Contract End Date",
      selector: "contract_end_date",
      sortable: true,
      minWidth: "150px",
      cell: (row) => {
        if (row?.contract_end_date) {
          return moment(row?.contract_end_date).format("YYYY-MM-DD")
        } else {
          return "No date"
        }
      }
    },
    {
      name: "Actions",
      minWidth: "200px",
      allowOverflow: true,
      cell: (row) => {
        return (
          <div className="d-flex w-100 align-items-center">
            <ButtonGroup size="sm">
              <Button color="primary" className="btn-icon" size="sm">
                <Edit size={15} onClick={() => handleModal(row)} />
              </Button>
            </ButtonGroup>
          </div>
        )
      }
    }
  ]

  const clearRecord = () => {
    setSearchName("")
    setSearchEmail("")
    setSearchPhone("")
  }

  // ** Table data to render
  const dataToRender = () => {
    if (
      searchName.length ||
      searchEmail.length ||
      searchPhone.length
    ) {
      return filteredData
    } else {
      return data?.client
    }
  }

  const handleUpdate = async (updatedRow, newPassword, oldPassword) => {
    // auth.requestPasswordChange(updatedRow.email)
    if (newPassword) {
      console.log(oldPassword, newPassword)
    }
    updateClient({
      variables: {
        id: updatedRow.id,
        email: updatedRow.email,
        full_name: updatedRow.full_name,
        phone: updatedRow.phone,
        active: updatedRow.active,
        sec_email: updatedRow.sec_email,
        sec_phone: updatedRow.sec_phone,
        account_type: updatedRow.account_type,
        referred_by: updatedRow.referred_by,
        contract_start_date: updatedRow.contract_start_date,
        contract_end_date: updatedRow.contract_end_date,
        sign_up_time: updatedRow.sign_up_time
      }
    }).then(() => {
      toast.success(
        <ToastComponent
          title="Client Updated"
          color="success"
          icon={<Check />}
        />,
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        }
      )
      refetchClient()
    }).catch(err => {
      console.log(err)
      toast.error(
        <ToastComponent
          title="Error"
          color="danger"
          icon={<XCircle />}
        />,
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        }
      )
    })
    dataToRender()
    if (!clientLoading) {
      setModal(!modal)
    }
  }

  const addClientRecord = () => {
    setToAddNewRecord(true)
    setRow({active: 1})
    setTimeout(() => {
      setModal(!modal)
    }, 200)
  }

  const updateActive = async (active, row) => {
    try {
      await updateClientActive({variables:{
      email: row?.email,
      active
    }})
  } catch (e) {
    console.log(e)
    toast.error(
      <ToastComponent
        title="No admin rights"
        color="danger"
        icon={<XCircle />}
      />,
      {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      }
    )
  }
  }
  const handleAddRecord = async (newRow, redirect = false) => {
    console.log(redirect)
    try {
      await addClient({
        variables: {
          email: newRow?.email.toLowerCase(),
          full_name: newRow?.full_name,
          phone: newRow?.phone,
          active: newRow?.active,
          sec_email: newRow?.sec_email.toLowerCase(),
          sec_phone: newRow?.sec_phone,
          account_type: newRow?.account_type,
          referred_by: newRow?.referred_by,
          contract_start_date: newRow?.contract_start_date,
          contract_end_date: newRow?.contract_end_date
        }
      })
        auth.register({
          email: newRow.email,
          password: "0000", // newRow.password,
          options: { userData: { display_name: newRow.full_name } }
        })
        toast.success(<SuccessToast data={newRow} />, { hideProgressBar: true })
      
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
      setRow(null)
      if (redirect) {
        history.push({pathname: '/property', state: {active: "4"}})
      }
    } catch (e) {
      console.log(e.message)
      if (e.message.substr(0, 20) === "Uniqueness violation") {
        return toast.error(
          <ToastComponent title="Client already exists with same email" color="danger" icon={<XCircle />} />,
          {
            autoClose: 6000,
            hideProgressBar: true,
            closeButton: false
          }
        )
      }
    }
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

  // ** Function to handle name filter
  const handleNameFilter = (e) => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (
        searchEmail.length ||
        searchName.length ||
        searchPhone.length
      ) {
        return filteredData
      } else {
        return data?.client
      }
    }

    setSearchName(value)
    if (value.length) {
      updatedData = dataToFilter().filter((item) => {
        const startsWith = item.full_name
          ?.toLowerCase()
          .startsWith(value.toLowerCase())

        const includes = item.full_name
          ?.toLowerCase()
          .includes(value.toLowerCase())

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

  // ** Function to handle email filter
  const handleEmailFilter = (e) => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (
        searchEmail.length ||
        searchName.length ||
        searchOccupation.length ||
        searchOrganization.length ||
        searchPhone.length ||
        searchGender.length
      ) {
        return filteredData
      } else {
        return data?.client
      }
    }

    setSearchEmail(value)
    if (value.length) {
      updatedData = dataToFilter().filter((item) => {
        const startsWith = item.email
          ?.toLowerCase()
          .startsWith(value.toLowerCase())

        const includes = item.email
          ?.toLowerCase()
          .includes(value.toLowerCase())

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

  // ** Function to handle phone filter
  const handlePhoneFilter = (e) => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (
        searchEmail.length ||
        searchName.length ||
        searchPhone.length
      ) {
        return filteredData
      } else {
        return data?.client
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

  return (
    <Fragment>
      {queryLoading && <Overlay setLoaderButton={setLoaderButton} loaderButton={loaderButton} setLoading={setQueryLoading} />}
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Advance Search</CardTitle>
          <div className="d-flex mt-md-0 mt-1">
          { (searchName || searchEmail || searchPhone) && <Button className='ml-2' color='danger' outline onClick={() => clearRecord()}>
              <XCircle size={15} />
              <span className='align-middle ml-50'>Clear filter</span>
            </Button>}
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
                <Label for="name">Name:</Label>
                <Input
                  id="name"
                  placeholder="Bruce Wayne"
                  value={searchName}
                  onChange={handleNameFilter}
                />
              </FormGroup>
            </Col>
            <Col lg="4" md="6">
              <FormGroup>
                <Label for="email">Email:</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Bwayne@email.com"
                  value={searchEmail}
                  onChange={handleEmailFilter}
                />
              </FormGroup>
            </Col>
            <Col lg="4" md="6">
              <FormGroup>
                <Label for="phone">Phone:</Label>
                <Input
                  id="phone"
                  placeholder="San Diego"
                  value={searchPhone}
                  onChange={handlePhoneFilter}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
        {!loading ? (
          <DataTable
            noHeader
            pagination
            conditionalRowStyles={conditionalRowStyles}
            columns={advSearchColumns}
            paginationPerPage={7}
            className="react-dataTable"
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            paginationComponent={CustomPagination}
            data={dataToRender()}
            onRowClicked={(row) => openDetailsModal(row)}
            highlightOnHover={true}
            pointerOnHover={true}
            // selectableRowsComponent={BootstrapCheckbox}
          />
        ) : (
          <h4 className="d-flex text-center align-items-center justify-content-center mb-5">
            Loading Client information
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
        updateActive={updateActive}
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
          className="modal-dialog-centered modal-xl modal-primary"
        >
          <ModalHeader className="d-flex justify-content-center"  toggle={() => setDetailsModal(!detailsModal)}>
            Client Details
          </ModalHeader>
          <ModalBody>
            <TabsVerticalLeft item={modalDetails} />
          </ModalBody>
        </Modal>
      </div>
    </Fragment>
  )
}

export default DataTableAdvSearch
