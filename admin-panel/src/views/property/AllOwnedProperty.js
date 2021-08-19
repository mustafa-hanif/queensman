// ** React Imports
import { useState, Fragment, forwardRef, useContext } from 'react'


// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ExpandableTable } from './ExpandableTable'
import { toast } from 'react-toastify'
import { MoreVertical, Edit, ChevronDown, Plus, Trash, Eye, EyeOff, Edit3, Upload, Loader, Check, Info, XCircle } from 'react-feather'
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

const GET_PROPERTIES = gql`
query MyQuery {
  property_owned(order_by: {id: asc}) {
    id
    client {
      id
      full_name
      email
      account_type
      active
      property_owneds_aggregate {
        aggregate {
          count
        }
      }
    }
    property {
      id
      country
      city
      community
      address
    }
  }
}
`

const DataTableAdvSearch = () => {

        // ** States
  const { loading, data, error } = useQuery(GET_PROPERTIES)
  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [filteredData, setFilteredData] = useState([])
  const [searchCountry, setSearchCountry] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [searchCommunity, setSearchCommunity] = useState('')
  const [searchAddress, setSearchAddress] = useState('')
  const [searchPropertyId, setSearchPropertyId] = useState('')

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
      name: 'Client Name',
      selector: 'client.full_name',
      sortable: true,
      wrap: true,
      minWidth: '150px'
    },
    {
      name: 'Email',
      selector: 'client.email',
      sortable: true,
      wrap: true,
      minWidth: '300px'
    },
    {
      name: 'Property ID',
      selector: 'property.id',
      sortable: true,
      wrap: true,
      minWidth: '10px'
    },
    {
      name: 'Country',
      selector: 'property.country',
      sortable: true,
      wrap: true,
      minWidth: '200px'
    },
    {
      name: 'City',
      selector: 'property.city',
      sortable: true,
      wrap: true,
      minWidth: '100px'
    },
    {
      name: 'Community',
      selector: 'property.community',
      sortable: true,
      wrap: true,
      minWidth: '100px'
    },
    {
      name: 'Address',
      selector: 'property.address',
      sortable: true,
      wrap: true,
      minWidth: '350px'
    },
    {
        name: 'Properties',
        selector: 'client.property_owneds_aggregate.aggregate.count',
        sortable: true,
        minWidth: '100px',
        center: true,
        cell: row => {
            return (
                <>
                <Badge color={'light-info mx-auto '} pill>{row.client.property_owneds_aggregate.aggregate.count}</Badge>
                </>
            )
        }
      }
  ]

//   ** Table data to render
  const dataToRender = () => {
    if (
      searchName.length ||
      searchEmail.length ||
      searchCountry.length ||
      searchCity.length ||
      searchCommunity.length ||
      searchAddress.length ||
      searchPropertyId.length
    ) {
      return filteredData
    } else {
      return data?.property_owned
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
        if (searchEmail.length || searchName.length || searchCountry.length || searchCity.length || searchCommunity.length || searchAddress.length || searchPropertyId.length)  {
        return filteredData
      } else {
        return data?.property_owned
      }
    }

    setSearchName(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.client.full_name?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.client.full_name?.toLowerCase().includes(value.toLowerCase())

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
        if (searchEmail.length || searchName.length || searchCountry.length || searchCity.length || searchCommunity.length || searchAddress.length || searchPropertyId.length) {
        return filteredData
      } else {
        return data?.property_owned
      }
    }

    setSearchEmail(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.client.email?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.client.email?.toLowerCase().includes(value.toLowerCase())

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

    // ** Function to handle country filter
    const handleCountryFilter = e => {
      const value = e.target.value
      let updatedData = []
      const dataToFilter = () => {
          if (searchEmail.length || searchName.length || searchCountry.length || searchCity.length || searchCommunity.length || searchAddress.length || searchPropertyId.length) {
          return filteredData
        } else {
          return data?.property_owned
        }
      }
  
      setSearchCountry(value)
      if (value.length) {
        updatedData = dataToFilter().filter(item => {
          const startsWith = item.property.country?.toLowerCase().startsWith(value.toLowerCase())
          const includes = item.property.country?.toLowerCase().includes(value.toLowerCase())
  
          if (startsWith) {
              return startsWith
            } else if (!startsWith && includes) {
              return includes
            } else return null
        })
        setFilteredData([...updatedData])
        setSearchCountry(value)
      }
    }

     // ** Function to handle City filter
     const handleCityFilter = e => {
      const value = e.target.value
      let updatedData = []
      const dataToFilter = () => {
          if (searchEmail.length || searchName.length || searchCountry.length || searchCity.length || searchCommunity.length || searchAddress.length || searchPropertyId.length) {
          return filteredData
        } else {
          return data?.property_owned
        }
      }
  
      setSearchCity(value)
      if (value.length) {
        updatedData = dataToFilter().filter(item => {
          const startsWith = item.property.city?.toLowerCase().startsWith(value.toLowerCase())
          const includes = item.property.city?.toLowerCase().includes(value.toLowerCase())
          if (startsWith) {
              return startsWith
            } else if (!startsWith && includes) {
              return includes
            } else return null
        })
        setFilteredData([...updatedData])
        setSearchCity(value)
      }
    }

     // ** Function to handle Community filter
     const handleCommunityFilter = e => {
      const value = e.target.value
      let updatedData = []
      const dataToFilter = () => {
          if (searchEmail.length || searchName.length || searchCountry.length || searchCity.length || searchCommunity.length || searchAddress.length || searchPropertyId.length) {
          return filteredData
        } else {
          return data?.property_owned
        }
      }
  
      setSearchCommunity(value)
      if (value.length) {
        updatedData = dataToFilter().filter(item => {
          const startsWith = item.property.community?.toLowerCase().startsWith(value.toLowerCase())
          const includes = item.property.community?.toLowerCase().includes(value.toLowerCase())
          if (startsWith) {
              return startsWith
            } else if (!startsWith && includes) {
              return includes
            } else return null
        })
        setFilteredData([...updatedData])
        setSearchCommunity(value)
      }
    }

     // ** Function to handle Addresss filter
     const handleAddressFilter = e => {
      const value = e.target.value
      let updatedData = []
      const dataToFilter = () => {
          if (searchEmail.length || searchName.length || searchCountry.length || searchCity.length || searchCommunity.length || searchAddress.length || searchPropertyId.length) {
          return filteredData
        } else {
          return data?.property_owned
        }
      }
  
      setSearchAddress(value)
      if (value.length) {
        updatedData = dataToFilter().filter(item => {
          const startsWith = item.property.address?.toLowerCase().startsWith(value.toLowerCase())
          const includes = item.property.address?.toLowerCase().includes(value.toLowerCase())
          if (startsWith) {
              return startsWith
            } else if (!startsWith && includes) {
              return includes
            } else return null
        })
        setFilteredData([...updatedData])
        setSearchAddress(value)
      }
    }

    // ** Function to handle propery id filter
    const handlePropertyIdFilter = e => {
      const value = e.target.value
      let updatedData = []
      const dataToFilter = () => {
          if (searchEmail.length || searchName.length || searchCountry.length || searchCity.length || searchCommunity.length || searchAddress.length || searchPropertyId.length) {
          return filteredData
        } else {
          return data?.property_owned
        }
      }
  
      setSearchPropertyId(value)
      if (value.length) {
        updatedData = dataToFilter().filter(item => {
          const startsWith = item.property.id?.toString().startsWith(value)
          const includes = item.property.id?.toString().includes(value)
          if (startsWith) {
              return startsWith
            } else if (!startsWith && includes) {
              return includes
            } else return null
        })
        setFilteredData([...updatedData])
        setSearchPropertyId(value)
      }
    }

    const clearRecord = () => {
      setSearchName("")
      setSearchEmail("")
      setSearchCountry("")
      setSearchCity("")
      setSearchCommunity("")
      setSearchAddress("")
      setSearchPropertyId("")
    }

  return (
    <Fragment>
      <Card>
      <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Search Owned Properties</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            { (searchName || searchEmail || searchCountry || searchCity || searchCommunity || searchAddress || searchPropertyId) && <Button className='ml-2' color='danger' outline onClick={() => clearRecord()}>
              <XCircle size={15} />
              <span className='align-middle ml-50'>Clear filter</span>
            </Button>}
          </div>
        </CardHeader>
        <CardBody>
          <Row form className='mt-1 mb-50'>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='name'>Name:</Label>
                <Input id='name' placeholder='Search Client Name' value={searchName} onChange={handleNameFilter} />
              </FormGroup>
            </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='email'>Email:</Label>
                <Input
                  id='email'
                  placeholder='Search Client Email'
                  value={searchEmail}
                  onChange={handleEmailFilter}
                />
              </FormGroup>
            </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='propId'>Property ID:</Label>
                <Input
                  id='propId'
                  placeholder='Search Property ID'
                  value={searchPropertyId}
                  onChange={handlePropertyIdFilter}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row form className="mt-1 mb-50">
          <Col lg='3' md='6'>
              <FormGroup>
                <Label for='country'>Country:</Label>
                <Input
                  id='country'
                  placeholder='Search Country'
                  value={searchCountry}
                  onChange={handleCountryFilter}
                />
              </FormGroup>
            </Col>
            <Col lg='3' md='6'>
              <FormGroup>
                <Label for='city'>City:</Label>
                <Input
                  id='city'
                  placeholder='Search City'
                  value={searchCity}
                  onChange={handleCityFilter}
                />
              </FormGroup>
            </Col>
            <Col lg='3' md='6'>
              <FormGroup>
                <Label for='community'>Community:</Label>
                <Input
                  id='community'
                  placeholder='Search Community'
                  value={searchCommunity}
                  onChange={handleCommunityFilter}
                />
              </FormGroup>
            </Col>
            <Col lg='3' md='6'>
              <FormGroup>
                <Label for='address'>Address:</Label>
                <Input
                  id='address'
                  placeholder='Search Address'
                  value={searchAddress}
                  onChange={handleAddressFilter}
                />
              </FormGroup>
            </Col>
            </Row>
        </CardBody>
        {!loading ? <DataTable
          noHeader
          pagination
          // selectableRows
          columns={advSearchColumns}
          paginationPerPage={7}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
          paginationDefaultPage={currentPage + 1}
          // paginationComponent={CustomPagination}
          data={dataToRender()}
          // selectableRowsComponent={BootstrapCheckbox}
        /> : <h4 className="d-flex text-center align-items-center justify-content-center mb-5">Loading Property information</h4>}
       
      </Card>

    </Fragment>
  )
}

export default DataTableAdvSearch
