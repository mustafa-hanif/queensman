// ** React Imports
import { useState, Fragment, forwardRef } from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { MoreVertical, Edit, ChevronDown, Plus, Trash, Eye, EyeOff } from 'react-feather'
import { Card, CardHeader, CardBody, CardTitle, Input, Label, FormGroup, Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

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
    }
  }  
`

const UPDATE_CLIENT = gql`
mutation UpdateClient($id: Int!, $email: String, $full_name: String, $gender: String, $occupation: String, $organization: String, $phone: String) {
    update_client_by_pk(pk_columns: {id: $id}, _set: {email: $email, full_name: $full_name, gender: $gender, occupation: $occupation, organization: $organization, phone: $phone}) {
      id
    }
  }
  `
const ADD_CLIENT = gql`
mutation AddClient($full_name: String, $gender: String, $email: String, $occupation: String, $organization: String, $phone: String) {
  insert_client_one(object: {full_name: $full_name, gender: $gender, email: $email, occupation: $occupation, organization: $organization, phone: $phone}) {
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

const DataTableAdvSearch = () => {

        // ** States
  const { loading, data, error } = useQuery(GET_CLIENT)
  const [updateClient, {loading: clientLoading}] = useMutation(UPDATE_CLIENT, {refetchQueries:[{query: GET_CLIENT}]})
  const [addClient, {loading: addClientLoading}] = useMutation(ADD_CLIENT, {refetchQueries:[{query: GET_CLIENT}]})
  const [deleteClient, {loading: deleteClientLoading}] = useMutation(DELETE_CLIENT, {refetchQueries:[{query: GET_CLIENT}]})
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
      allowOverflow: true,
      cell: row => {
        return (
          <div className='d-flex'>
            <UncontrolledDropdown>
              <DropdownToggle className='pr-1' tag='span'>
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem className='w-100' onClick={() => { openModalAlert(row.id) }} >
                  <Trash size={15} />
                  <span className='align-middle ml-50'>Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <Edit size={15} onClick={() => handleModal(row)} />
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
    console.log(updatedRow)

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
      console.log(clientLoading)
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
    console.log(newRow)

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
      console.log(addClientLoading)
      if (!addClientLoading) {
        setModal(!modal)
      }
  }

  const handleDeleteRecord = (id) => {
    console.log(id)

    deleteClient({variables: {
        id
      }})
      dataToRender()
      console.log(deleteClientLoading)
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
        <DataTable
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
        />
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
