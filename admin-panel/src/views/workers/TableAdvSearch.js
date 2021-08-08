// ** React Imports
import { useState, Fragment, forwardRef, useContext } from 'react'


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
import Badge from 'reactstrap/lib/Badge'

const GET_WORKER = gql`
query GetWorker {
    worker(order_by: {id: desc}) {
      active
      description
      email
      full_name
      id
      isEmergency
      team_id
      role
      phone
      password
      teams {
        team_color
      }
      teams_member {
        team_color
      }
    }
  }
`
const CLEAR_EMERGENCY_WORKER = gql`
  mutation UpdateWorker($emergencyId: Int!) {
    clear_emergency: update_worker_by_pk(pk_columns: {id: $emergencyId}, _set: {isEmergency: false}) {
      email
    }
  }
`

const UPDATE_WORKER = gql`
mutation UpdateWorker($id: Int!, $description: String, $email: String, $full_name: String, $isEmergency: Boolean, $password: String, $phone: String, $role: String, $team_id: Int, $active: smallint) {
   update_worker_by_pk(pk_columns: {id: $id}, _set: {description: $description, email: $email, full_name: $full_name, password: $password, phone: $phone, role: $role, team_id: $team_id, isEmergency: $isEmergency, active: $active}) {
     id
   }
 }
`
const ADD_WORKER = gql`
mutation AddWorker($description: String, $email: String, $full_name: String, $isEmergency: Boolean, $password: String, $phone: String, $role: String, $team_id: Int, $active: smallint) {
    insert_worker_one(object: {description: $description, email: $email, full_name: $full_name, isEmergency: $isEmergency, password: $password, phone: $phone, role: $role, team_id: $team_id, active: $active}) {
      id
    }
  }
`

const DELETE_WORKER = gql
`mutation DeleteWorker($id: Int!) {
  delete_worker_by_pk(id: $id) {
    id
  }
}
`

const DataTableAdvSearch = () => {

        // ** States
  const { loading, data, error } = useQuery(GET_WORKER)
  const [clearEmergency, {loading: emergencyworkerLoading}] = useMutation(CLEAR_EMERGENCY_WORKER)
  const [updateWorker, {loading: workerLoading}] = useMutation(UPDATE_WORKER, {refetchQueries:[{query: GET_WORKER}]})
  const [addWorker, {loading: addWorkerLoading}] = useMutation(ADD_WORKER, {refetchQueries:[{query: GET_WORKER}]})
  const [deleteWorker, {loading: deleteWorkerLoading}] = useMutation(DELETE_WORKER, {refetchQueries:[{query: GET_WORKER}]})
  const [modal, setModal] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [description, setDescription] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
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
      name: 'Phone',
      selector: 'phone',
      sortable: true,
      minWidth: '200px'
    },
    {
      name: 'Description',
      selector: 'description',
      sortable: true,
      minWidth: '250px'
    },
    {
        name: 'Emergency Team',
        selector: 'isEmergency',
        sortable: true,
        minWidth: '200px',
        cell: row => {
            return (
                <>
                {row.isEmergency && <Badge color={'light-danger'} pill>Emergency Team</Badge>}
                </>
            )
        }
      },
      {
        name: 'Team',
        selector: 'teams',
        sortable: true,
        minWidth: '50px',
        cell: row => {
          const color = row?.teams?.[0]?.team_color ?? row?.teams_member?.team_color
          console.log('color', row)
          return (
            color && <Badge pill style={{backgroundColor: color}}>{' '}</Badge>
          )
        }
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
      searchPhone.length    
    ) {
      return filteredData
    } else {
      console.log(data.worker)
      return data?.worker
    }
  }

  const handleUpdate = (updatedRow) => {
    if (updatedRow.isEmergency) {
      const emergencyId = data?.worker.filter(value => value.isEmergency === true)?.[0]?.id
      if (emergencyId) {
        clearEmergency({ variables: emergencyId })
      }
    }
    
    updateWorker({variables: {
      active: updatedRow.active,
      description: updatedRow.description,
      email: updatedRow.email,
      full_name: updatedRow.full_name,
      id: updatedRow.id,
      isEmergency: updatedRow.isEmergency,
      team_id: updatedRow.team_id,
      role: updatedRow.role,
      phone: updatedRow.phone,
      password: updatedRow.password
    }})
    dataToRender()
    if (!workerLoading) {
        
      setModal(!modal)
    }
  }

  const addWorkerRecord = () => {
    setToAddNewRecord(true)
    setRow({
        active: 1,
        description: "",
        email: "",
        full_name: "",
        isEmergency: false,
        team_id: null,
        role: null,
        phone: "",
        password: ""
    })
    setTimeout(() => {
      setModal(!modal) 
    }, 200)
  }


  const handleAddRecord = (newRow) => {
    addWorker({variables: {
        active: newRow.active,
        description: newRow.description,
        email: newRow.email,
        full_name: newRow.full_name,
        isEmergency: newRow.isEmergency,
        team_id: newRow.team_id,
        role: newRow.role,
        phone: newRow.phone,
        password: newRow.password
      }})
      dataToRender()
      if (!addWorkerLoading) {
        setModal(!modal)
      }
  }

  const handleDeleteRecord = (id) => {
    deleteWorker({variables: {
        id
      }})
      dataToRender()
      if (!deleteWorkerLoading) {
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
        if (searchEmail.length || searchName.length || description.length || searchPhone.length)  {
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
        if (searchEmail.length || searchName.length || description.length || searchPhone.length) {
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
  const handleDescriptionFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
        if (searchEmail.length || searchName.length || description.length || searchPhone.length) {
        return filteredData
      } else {
        return data?.client
      }
    }

    setDescription(value)
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
      setDescription(value)
    }
  }

  // ** Function to handle phone filter
  const handlePhoneFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
        if (searchEmail.length || searchName.length || description.length || searchPhone.length) {
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

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Advance Search</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            <Button className='ml-2' color='primary' onClick={addWorkerRecord}>
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
                <Label for='occupation'>Description:</Label>
                <Input id='occupation' placeholder='Web Designer' value={description} onChange={handleDescriptionFilter} />
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
                <Label for='phone'>Phone:</Label>
                <Input id='phone' placeholder='San Diego' value={searchPhone} onChange={handlePhoneFilter} />
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
        /> : <h4 className="d-flex text-center align-items-center justify-content-center mb-5">Loading Worker information</h4>}
       
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
