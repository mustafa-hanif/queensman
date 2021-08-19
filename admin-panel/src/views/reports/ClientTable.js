// ** React Imports
import { Fragment, useState, forwardRef } from 'react'

// ** Add New Modal Component
import AddNewModal from './AddNewModal'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus } from 'react-feather'
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Label,
  Row,
  Col,
  FormGroup
} from 'reactstrap'
import { gql, useMutation, useQuery } from '@apollo/client'
import CardBody from 'reactstrap/lib/CardBody'

const GET_CLIENT = gql`
query GetClientOwned {
  client(order_by: {id: asc}) {
    id
    email
    full_name
    password
    phone
    account_type
    active 
  }
}
`

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef(({ onClick, ...rest }, ref) => (
  <div className='custom-control custom-checkbox'>
    <input type='checkbox' className='custom-control-input' ref={ref} {...rest} />
    <label className='custom-control-label' onClick={onClick} />
  </div>
))

const ClientTable = () => {
  // ** States
  const { loading, data, error } = useQuery(GET_CLIENT)
  const [currentPage, setCurrentPage] = useState(0)
  const [filteredData, setFilteredData] = useState([])
  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')

  // ** Function to handle Pagination
  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

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
    }
  ]

  // ** Table data to render
  const dataToRender = () => {
    if (
      searchName.length ||
      searchEmail.length
    ) {
      return filteredData
    } else {
      return data?.client
    }
  }

  // ** Function to handle name filter
  const handleNameFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchEmail.length || searchName.length) {
        return filteredData
      } else {
        return data?.client
      }
    }

    setSearchName(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.name?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.name?.toLowerCase().includes(value.toLowerCase())

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
      if (searchEmail.length || searchName.length) {
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

  // ** Custom Pagination
  // const CustomPagination = () => (
  //   <ReactPaginate
  //     previousLabel=''
  //     nextLabel=''
  //     forcePage={currentPage}
  //     onPageChange={page => handlePagination(page)}
  //     pageCount={searchValue.length ? filteredData.length / 7 : data.length / 7 || 1}
  //     breakLabel='...'
  //     pageRangeDisplayed={2}
  //     marginPagesDisplayed={2}
  //     activeClassName='active'
  //     pageClassName='page-item'
  //     breakClassName='page-item'
  //     breakLinkClassName='page-link'
  //     nextLinkClassName='page-link'
  //     nextClassName='page-item next'
  //     previousClassName='page-item prev'
  //     previousLinkClassName='page-link'
  //     pageLinkClassName='page-link'
  //     breakClassName='page-item'
  //     breakLinkClassName='page-link'
  //     containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
  //   />
  // )


  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Reports</CardTitle>
        </CardHeader>
        <CardBody>
        <Row form className='mt-1 mb-50'>
          <Col lg='4' md='6'>
            <FormGroup>
              <Label for='name'>Name:</Label>
              <Input id='name' placeholder='Enter Name' value={searchName} onChange={handleNameFilter} />
            </FormGroup>
          </Col>
          <Col lg='4' md='6'>
            <FormGroup>
              <Label for='name'>Email:</Label>
              <Input id='name' placeholder='Enter Email' value={searchEmail} onChange={handleEmailFilter} />
            </FormGroup>
          </Col>
        </Row>
        </CardBody>
      
        {!loading ? <DataTable
          noHeader
          pagination
          columns={advSearchColumns}
          paginationPerPage={7}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
          paginationDefaultPage={currentPage + 1}
          // paginationComponent={CustomPagination}
          data={dataToRender()}
          
        /> : <div className="d-flex text-center align-items-center justify-content-center mb-5">Loading Client Information</div>}
      </Card>
    </Fragment>
  )
}

export default ClientTable
