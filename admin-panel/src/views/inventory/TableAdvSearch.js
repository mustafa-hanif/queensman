// ** React Imports
import { useState, Fragment, forwardRef } from 'react'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { MoreVertical, Edit, ChevronDown, Plus, Trash } from 'react-feather'
import { Card, CardHeader, CardBody, CardTitle, Input, Label, FormGroup, Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef(({ onClick, ...rest }, ref) => {
    return (
<div className='custom-control custom-checkbox'>
    <input type='checkbox' className='custom-control-input' ref={ref} {...rest} />
    <label className='custom-control-label' onClick={onClick} />
  </div>
    )
})

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { gql, useMutation, useQuery } from '@apollo/client'
import AddNewModal from './AddNewModal'

const GET_CLIENT = gql`
query GetClient {
    client(order_by: {id: asc}) {
      id
      email
      full_name
      gender
      occupation
      organization
      phone
    }
  }  
`

const UPDATE_CLIENT = gql`
mutation UpdateClient($id: Int!, $email: String, $full_name: String, $gender: String, $occupation: String, $organization: String) {
    update_client_by_pk(pk_columns: {id: $id}, _set: {email: $email, full_name: $full_name, gender: $gender, occupation: $occupation, organization: $organization}) {
      id
    }
  }
  `
const DataTableAdvSearch = () => {

        // ** States
  const { loading, data, error } = useQuery(GET_CLIENT)
  const [updateClient, {loading: clientLoading}] = useMutation(UPDATE_CLIENT, {refetchQueries:[{query: GET_CLIENT}]})
  const [modal, setModal] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [searchOccupation, setSearchOccupation] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [searchEmail, setSearchEmail] = useState('')
  const [searchOrganization, setSearchOrganization] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [searchGender, setSearchGender] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [row, setRow] = useState(null)

    const closeModal = () => {
        setModal(!modal)
    }

  // ** Function to handle Modal toggle
  const handleModal = (row) => { 
      setRow(row)
      setTimeout(() => {
        setModal(!modal) 
      }, 200)
    }

  // ** Function to handle Pagination
  const handlePagination = page => setCurrentPage(page.selected)
  
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
    const newData = data.client.map((client => { 
        if (client.id === updatedRow.id) {
            return updatedRow 
        } else {
            return client
        }       
    }))

    updateClient({variables: {
        id: updatedRow.id,
        email: updatedRow.email, 
        full_name: updatedRow.full_name, 
        occupation: updatedRow.occupation, 
        organization: updatedRow.organization, 
        gender: updatedRow.gender
      }})
      dataToRender()
      console.log(clientLoading)
      if (!clientLoading) {
          
        setModal(!modal)
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
          <CardTitle tag='h4'>Inventory</CardTitle>

        </CardHeader>
        <CardBody>
          <Row form className='mt-1 mb-50'>
            <Col lg='4' md='10'>
              <FormGroup>
                <Label for='name'>Select Client:</Label>
                <Input id='name' placeholder='Client' value={searchName} onChange={handleNameFilter} />
              </FormGroup>
            </Col>
            <Col lg='4' md='10'>
              <FormGroup>
                <Label for='email'>Select Property:</Label>
                <Input
                  type='email'
                  id='email'
                  placeholder='Property'
                  value={searchEmail}
                  onChange={handleEmailFilter}
                />
              </FormGroup>
            </Col>
            
          </Row>
          <Row form className='mt-1 mb-50'>
            <Col lg='4' md='6'>
              <FormGroup>
              <Button.Ripple color='primary'>
            Add The New Inventory Report
          </Button.Ripple>
              </FormGroup>
            </Col>
       
        
          </Row>
        </CardBody>
      
      </Card>
      <AddNewModal open={modal} handleModal={handleModal} closeModal={closeModal} row={row} setRow={setRow} handleUpdate={handleUpdate}/>
    </Fragment>
  )
}

export default DataTableAdvSearch
