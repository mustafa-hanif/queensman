// ** React Imports
import { useState, Fragment, forwardRef } from 'react'


const fetch = require('node-fetch')
const FormData = require('form-data')

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'
import { MoreVertical, Edit, ChevronDown, Plus, Trash, Eye, EyeOff, Edit3, Upload, Loader, Check } from 'react-feather'
import { Card, CardHeader, CardBody, CardTitle, Input, Label, FormGroup, Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

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

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { gql, useMutation, useQuery } from '@apollo/client'
import AddNewModal from './AddNewModal'
import ButtonGroup from 'reactstrap/lib/ButtonGroup'
import { months } from 'moment'
import axios from 'axios'

const GET_CLIENT = gql`
query GetClient {
  client(order_by: {id: desc}) {
    id
    email
    full_name
    gender
    occupation
    organization
    phone
    password
    hasPlan
    property_owneds {
      property_id
    }
  }
}
`

const UPDATE_CLIENT = gql`
mutation UpdateClient($id: Int!, $email: String, $full_name: String, $gender: String, $occupation: String, $organization: String, $phone: String, $password: String) {
    update_client_by_pk(pk_columns: {id: $id}, _set: {email: $email, full_name: $full_name, gender: $gender, occupation: $occupation, organization: $organization, phone: $phone, password: $password}) {
      id
    }
  }
  `
const ADD_CLIENT = gql`
mutation AddClient($full_name: String, $gender: String, $email: String, $occupation: String, $organization: String, $phone: String, $password: String) {
  insert_client_one(object: {full_name: $full_name, gender: $gender, email: $email, occupation: $occupation, organization: $organization, phone: $phone, password: $password}) {
    id
  }
}
`

const DELETE_CLIENT = gql
`mutation DeleteClient($id: Int!) {
  delete_client_by_pk(id: $id) {
    id
  }
}
`
const UPDATE_CLIENT_HASPLAN = gql
`mutation UpdateHasPLan($id: Int!, $hasPlan: Boolean!) {
  update_client_by_pk(pk_columns: {id: $id}, _set: {hasPlan: $hasPlan}) {
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
  delete_callout(where: {_or: {callout_by_email: {_eq: $email}}, callout_by: {_eq: $callout_id}}) {
    affected_rows
  }
}
`

const DataTableAdvSearch = () => {

        // ** States
  const { loading, data, error } = useQuery(GET_CLIENT)
  const [updateClient, {loading: clientLoading}] = useMutation(UPDATE_CLIENT, {refetchQueries:[{query: GET_CLIENT}]})
  const [addClient, {loading: addClientLoading}] = useMutation(ADD_CLIENT, {refetchQueries:[{query: GET_CLIENT}]})
  const [deleteClient, {loading: deleteClientLoading}] = useMutation(DELETE_CLIENT, {refetchQueries:[{query: GET_CLIENT}]})
  const [addPlan, {loading: addPlanLoading}] = useMutation(UPLOAD_PLAN)
  const [deletePlan, {loading: deletePlanLoading}] = useMutation(DELETE_PLAN)
  const [updateClientPlan] = useMutation(UPDATE_CLIENT_HASPLAN, {refetchQueries:[{query: GET_CLIENT}]})
  const [modal, setModal] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [searchOccupation, setSearchOccupation] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [searchEmail, setSearchEmail] = useState('')
  const [searchOrganization, setSearchOrganization] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [searchGender, setSearchGender] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [toAddNewRecord, setToAddNewRecord] = useState(false)
  const [row, setRow] = useState(null)
  const [rowId, setRowId] = useState(null)

  const [modalAlert, setModalAlert] = useState(null)

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

  // ** Function to handle Modal toggle
  const handleModal = (row) => { 
      setRow(row)
      setTimeout(() => {
        setModal(!modal) 
      }, 200)
      setToAddNewRecord(false)
    }

  const addHours = (date, hours) => {
    return new Date(new Date(date).setHours(new Date(date).getHours() + hours))
  }

  const handleAddPlan = async (row) => {
    console.log("meow")
    let currentDate = new Date().toISOString().split('T')[0].split('-')  //["2021", "07", "01"]
    let year = parseInt(currentDate[0])
    let month = parseInt(currentDate[1])
    console.log(row)
    for (let i = 0; i < 6; i++) {
      if (month % 13 === 0) {
        month = 1
        year++
      }
      const date_on_calendar = `${year}-${month < 10 ? `0${month}` : month}-01`//new Date().getMonth()+1
      const time_on_calendar = "10:00:00" //10:00:00
      const end_time_on_calendar = addHours(`${date_on_calendar} ${time_on_calendar}`, 4).toTimeString().substr(0, 8)
      const end_date_on_calendar = addHours(`${date_on_calendar} ${time_on_calendar}`, 4).toISOString().substr(0, 10)
      console.log({
        property_id: row.property_owneds[0]?.property_id,
        callout_by: row.id,
        email: row.email,
        date_on_calendar,
        time_on_calendar,
        end_time_on_calendar,
        end_date_on_calendar
      })
      // await addPlan({
      //   variables: {
      //   property_id: row.property_owneds[0]?.property_id,
      //   callout_by: row.id,
      //   email: row.email,
      //   date_on_calendar,
      //   time_on_calendar,
      //   end_time_on_calendar,
      //   end_date_on_calendar
      //   }
      // })
      month += 2
    }
    if (!addPlanLoading) {
      toast.success(<ToastComponent title='Plan Added' color='success' icon={<Check />} />, {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      })
      // await updateClientPlan({
      //   variables: {
      //     id: row.id,
      //     hasPlan: true
      //   }
      // })
    }
    
    currentDate = new Date().toLocaleDateString().split("/")  // "7/11/2021"
    year = parseInt(currentDate[2])
    month = parseInt(currentDate[0])
    const day = parseInt(currentDate[1])
    for (let i = 0; i < 4; i++) {
      if (month % 13 === 0) {
        month = 1
        year++
      }
      const date = new Date(`${month}/${day}/${year}`).toDateString().split(" ")
      const dateString = `${date[1]} ${date[2]}, ${date[3]}`
      const form = new FormData()
      /*eslint-disable*/
      console.log(JSON.stringify({
        "Subject":`Task Client ${date[1]}`,
        "Description":`Task Client ${date[1]}`,
        "Status":`Idk`,
        "Due_Date": "Jul 11, 2021",
        "email":`${row.email}`
      }))
      form.append("arguments", JSON.stringify({
        "Subject":`Task Client ${date[1]}`,
        "Description":`Task Client ${date[1]}`,
        "Status":`Idk`,
        "Due_Date":  "Jul 11, 2021",
        "email":`${row.email}`
      }))

      try {
        const res = await axios.post('https://y8sr1kom3g.execute-api.us-east-1.amazonaws.com/dev/quarterlyTasks', {
          "Subject":`Task Client ${date[1]}`,
        "Description":`Task Client ${date[1]}`,
        "Status":`Idk`,
        "Due_Date":  `${dateString}`,
        "email":`${row.email}`
        })
      } catch (e) {
        console.log("ERROR")
        console.log(e)
      }
      month += 3
    }
   
  }

  const handleDeletePlan = async (row) => {
    console.log(row)
      console.log({
        email: row.email,
        callout_id: row.id
      })
      await deletePlan({
        variables: {
          email: row.email,
          callout_id: row.id
        }
      })
      if (!deletePlanLoading) {
        toast.error(<ToastComponent title='Plan Removed' color='danger' icon={<Trash />} />, {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        })
        console.log('delete')
        await updateClientPlan({
          variables: {
            id: row.id,
            hasPlan: false
          }
        })
      }
   
   
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
      name: 'Email',
      selector: 'email',
      sortable: true,
      minWidth: '200px'
    },
    {
      name: 'Full Name',
      selector: 'full_name',
      sortable: true,
      minWidth: '200px'
    },
    {
      name: 'Gender',
      selector: 'gender',
      sortable: true,
      minWidth: '100px'
    },
    {
      name: 'Occupation',
      selector: 'occupation',
      sortable: true,
      minWidth: '250px'
    },
  
    {
      name: 'Organization',
      selector: 'organization',
      sortable: true,
      minWidth: '250px'
    },
    {
      name: 'Phone',
      selector: 'Phone',
      sortable: true,
      minWidth: '200px'
    },
    {
      name: 'Password',
      minWidth: '150px',
      cell: row => {
        const [eye, setEye] = useState(true)
        return (
        <>
            {row?.password !== 'null' && row?.password &&  
            <div className='d-flex w-100 justify-content-between'>
            {eye ? <span>{row?.password.split('').map(value => "*")}</span> : <span>{row.password}</span>}
            {eye ? <Eye size={15} onClick={() => { setEye(!eye) }}/> : <EyeOff size={15} onClick={() => { setEye(!eye) }} />}
            </div>
            }
        </>
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
                  <Button color='primary' className="btn-icon" size="sm">
                  <Edit size={15} onClick={() => handleModal(row)} />
                  </Button>
                  {!row.hasPlan ? <Button color='secondary' outline className="btn" size="sm" onClick={() => { handleAddPlan(row) }} >
                    {addPlanLoading ? <Loader size={15} /> : <Edit3 size={15} />}
                    {addPlanLoading ? <span className='align-middle ml-25'>Loading</span> : <span className='align-middle ml-25'>Upload Plan</span>}
                  </Button> : <Button color='danger' outline className="btn" size="sm" onClick={() => { handleDeletePlan(row) }} >
                              <span className='align-middle ml-25'>Delete Plan</span>
                          </Button>
                }
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
      searchOccupation.length ||
      searchEmail.length ||
      searchPhone.length ||
      searchGender.length ||
      searchOrganization.length
    ) {
      return filteredData
    } else {
      return data?.client
    }
  }

  const handleUpdate = (updatedRow) => {
    updateClient({variables: {
        id: updatedRow.id,
        email: updatedRow.email, 
        full_name: updatedRow.full_name, 
        occupation: updatedRow.occupation, 
        organization: updatedRow.organization, 
        gender: updatedRow.gender,
        phone: updatedRow.phone,
        password: updatedRow.password
      }})
      dataToRender()
      if (!clientLoading) {
          
        setModal(!modal)
      }
  }

  const addClientRecord = () => {
    setToAddNewRecord(true)
    setRow({
      full_name: "",
      email:"",
      occupation:"",
      organization:"",
      gender:"",
      phone:"",
      password:""
    })
    setTimeout(() => {
      setModal(!modal) 
    }, 200)
  }


  const handleAddRecord = (newRow) => {
    addClient({variables: {
        email: newRow.email, 
        full_name: newRow.full_name, 
        occupation: newRow.occupation, 
        organization: newRow.organization, 
        gender: newRow.gender,
        phone: newRow.phone,
        password: newRow.password
      }})
      dataToRender()
      if (!addClientLoading) {
        setModal(!modal)
      }
  }

  const handleDeleteRecord = (id) => {
    deleteClient({variables: {
        id
      }})
      dataToRender()
      if (!deleteClientLoading) {
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
      containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'}
    />
  )

  // ** Function to handle name filter
  const handleNameFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
        if (searchEmail.length || searchName.length || searchOccupation.length || searchOrganization.length || searchPhone.length || searchGender.length) {
        return filteredData
      } else {
        return data?.client
      }
    }

    setSearchName(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.full_name?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.full_name?.toLowerCase().includes(value.toLowerCase())

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
  const handleEmailFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
        if (searchEmail.length || searchName.length || searchOccupation.length || searchOrganization.length || searchPhone.length || searchGender.length) {
        return filteredData
      } else {
        return data?.client
      }
    }

    setSearchEmail(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.email?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.email?.toLowerCase().includes(value.toLowerCase())

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

  // ** Function to handle Occupation filter
  const handleOccupationFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
        if (searchEmail.length || searchName.length || searchOccupation.length || searchOrganization.length || searchPhone.length || searchGender.length) {
        return filteredData
      } else {
        return data?.client
      }
    }

    setSearchOccupation(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.occupation?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.occupation?.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData([...updatedData])
      setSearchOccupation(value)
    }
  }

  // ** Function to handle organization filter
  const handleOrganizationFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
        if (searchEmail.length || searchName.length || searchOccupation.length || searchOrganization.length || searchPhone.length || searchGender.length) {
        return filteredData
      } else {
        return data?.client
      }
    }

    setSearchOrganization(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item?.organization?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item?.organization?.toLowerCase().includes(value.toLowerCase())

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
  const handlePhoneFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
        if (searchEmail.length || searchName.length || searchOccupation.length || searchOrganization.length || searchPhone.length || searchGender.length) {
        return filteredData
      } else {
        return data?.client
      }
    }

    setSearchPhone(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.phone?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.phone?.toLowerCase().includes(value.toLowerCase())

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

  // ** Function to handle gender filter
  const handleGenderFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
        if (searchEmail.length || searchName.length || searchOccupation.length || searchOrganization.length || searchPhone.length || searchGender.length) {
        return filteredData
      } else {
        return data?.client
      }
    }

    setSearchGender(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.gender?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.gender?.toLowerCase().includes(value.toLowerCase())

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
  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Advance Search</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            <Button className='ml-2' color='primary' onClick={addClientRecord}>
              <Plus size={15} />
              <span className='align-middle ml-50'>Add Record</span>
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Row form className='mt-1 mb-50'>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='name'>Name:</Label>
                <Input id='name' placeholder='Bruce Wayne' value={searchName} onChange={handleNameFilter} />
              </FormGroup>
            </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='email'>Email:</Label>
                <Input
                  type='email'
                  id='email'
                  placeholder='Bwayne@email.com'
                  value={searchEmail}
                  onChange={handleEmailFilter}
                />
              </FormGroup>
            </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='occupation'>Occupation:</Label>
                <Input id='occupation' placeholder='Web Designer' value={searchOccupation} onChange={handleOccupationFilter} />
              </FormGroup>
            </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='organization'>Organization:</Label>
                <Input id='organization' placeholder='San Diego' value={searchOrganization} onChange={handleOrganizationFilter} />
              </FormGroup>
            </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='phone'>Phone:</Label>
                <Input id='phone' placeholder='San Diego' value={searchPhone} onChange={handlePhoneFilter} />
              </FormGroup>
            </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='gender'>Gender:</Label>
                <Input id='gender' placeholder='Male' value={searchGender} onChange={handleGenderFilter} />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
        {!loading ?  <DataTable
          noHeader
          pagination
          // selectableRows
          columns={advSearchColumns}
          paginationPerPage={7}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
          paginationDefaultPage={currentPage + 1}
          paginationComponent={CustomPagination}
          data={dataToRender()}
          // selectableRowsComponent={BootstrapCheckbox}
        /> : <h4 className="d-flex text-center align-items-center justify-content-center mb-5">Loading Client information</h4>}
       
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
            <Button color="danger" onClick={() => { handleDeleteRecord(rowId) }} >
              Delete
            </Button>
            <Button color='secondary' onClick={toggleModal} outline>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Fragment>
  )
}

export default DataTableAdvSearch
