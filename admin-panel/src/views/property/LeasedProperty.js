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
import Badge from 'reactstrap/lib/Badge'
import { useNiceMutation, useNiceQuery } from '../../utility/Utils'

const GET_CLIENT_PROPS = gql`
query GetClientLeased {
    client(order_by: {id: asc}) {
      id
      email
      full_name
      password
      phone
      account_type
      active
      property_owneds: leases {
        id
        lease_start
        lease_end
        property {
          id
          city
          community
          country
          address
        }
      }
      id
      property_owneds_aggregate: leases_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`
const UNASSIGN = gql`
mutation Unassign($id: Int = 10, $lease_id: Int = 10) {
  delete_lease(where: {property_id: {_eq: $id}, _and: {lease_id: {_eq: $lease_id}}}) {
    affected_rows
  }
}
`

const UPDATE_PROPS = gql`
mutation UpdateProperty($id: Int!, $address: String!, $city: String!, $community: String!, $country: String!) {
  update_property(where: {id: {_eq: $id}}, _set: {address: $address, city: $city, community: $community, country: $country}) {
    affected_rows
  }
}

`
const ADD_PROPS = gql`
mutation AddProperty($community: String!, $country: String!, $city: String!, $address: String!, $type: String = null, $comments: String = null, $uploaded_by: Int = 10000002, $active: smallint = 1) {
  insert_property_one(object: {community: $community, country: $country, city: $city, address: $address, type: $type, comments: $comments, active: $active, uploaded_by: $uploaded_by}) {
    id
  }
}
`

const ADD_PROP_OWNED = gql`
mutation AddPropertyOwned($property_id: Int!, $owner_id: Int!, $uploaded_by: Int = 10000002, $active: smallint = 1) {
  insert_property_owned_one(object: {property_id: $property_id, owner_id: $owner_id, uploaded_by: $uploaded_by, active: $active}) {
    id
  }
}
`

const ADD_LEASE = gql`
mutation AddLease($property_id: Int, $lease_id: Int, $lease_start: timestamp!, $lease_end: timestamp!, $uploaded_by: Int = 10000002, $active: smallint = 1) {
  insert_lease_one(object: {property_id: $property_id, lease_id: $lease_id, lease_start: $lease_start, lease_end: $lease_end, uploaded_by: $uploaded_by, active: $active}) {
    id
  }
}
`
const DELETE_PROPS = gql`mutation DeleteProperty($id: Int = 10) {
  delete_property_by_pk(id: $id) {
    id
  }
}
`

const LeasedProperty = () => {

        // ** States
  const { loading, data, error, refetch: refetchProps } = useNiceQuery(GET_CLIENT_PROPS)
  const [updateProp, {loading: propertyLoading}] = useNiceMutation(UPDATE_PROPS, {refetchQueries:[{query: GET_CLIENT_PROPS}]})
  const [addProp, {loading: addPropertyLoading}] = useNiceMutation(ADD_PROPS, {refetchQueries:[{query: GET_CLIENT_PROPS}]})
  const [unassignProp, {loading: unAssignpropertyLoading}] = useNiceMutation(UNASSIGN, {refetchQueries:[{query: GET_CLIENT_PROPS}]})
  const [addPropOwned, {loading: addPropertyOwnedLoading}] = useNiceMutation(ADD_PROP_OWNED, {refetchQueries:[{query: GET_CLIENT_PROPS}]})
  const [addLease, {loading: addLeaseLoading}] = useNiceMutation(ADD_LEASE, {refetchQueries:[{query: GET_CLIENT_PROPS}]})
  const [deleteProp, {loading: deletePropertyLoading}] = useNiceMutation(DELETE_PROPS, {refetchQueries:[{query: GET_CLIENT_PROPS}]})
  const [modal, setModal] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [filteredData, setFilteredData] = useState([])
  const [searchCountry, setSearchCountry] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [searchCommunity, setSearchCommunity] = useState('')
  const [searchAddress, setSearchAddress] = useState('')
  const [searchPropertyId, setSearchPropertyId] = useState('')
  const [toAddNewRecord, setToAddNewRecord] = useState(false)
  const [row, setRow] = useState(null)
  const [rowId, setRowId] = useState(null)
  const [clientOwnedArray, setclientOwnedArray] = useState([])
  const [clientLeasedArray, setclientLeasedArray] = useState([])
  const [lease_start_date, setLease_start_date] = useState(null)
  const [lease_end_date, setLease_end_date] = useState(null)
  let propertyOwnedData = []
  const clearRecord = () => {
    setSearchName("")
    setSearchEmail("")
    setSearchCountry("")
    setSearchCity("")
    setSearchCommunity("")
    setSearchAddress("")
    setSearchPropertyId("")
  }

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
    setTimeout(() => {
      setToAddNewRecord(false)
      setclientOwnedArray([])
      setclientLeasedArray([])
      setLease_start_date(null)
      setLease_end_date(null)
    }, 200)
  }

// ** Function to handle Modal toggle
const handleModal = (row) => { 
    setRow(row)
    setModal(!modal) 
    setTimeout(() => {
      setToAddNewRecord(false)
      setclientOwnedArray([])
      setclientLeasedArray([])
      setLease_start_date(null)
      setLease_end_date(null)
    }, 200)
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
      name: 'Name',
      selector: 'full_name',
      sortable: true,
      minWidth: '200px'
    },
    {
      name: 'Email',
      selector: 'email',
      sortable: true,
      minWidth: '350px'
    },
    {
        name: 'Properties',
        selector: 'property_owneds_aggregate.aggregate.count',
        sortable: true,
        minWidth: '100px',
        center: true,
        cell: row => {
            return (
                <>
                <Badge color={'light-info mx-auto '} pill>{row.property_owneds_aggregate.aggregate.count}</Badge>
                </>
            )
        }
      }
  ]

  // ** Table data to render
  const dataToRender = () => {
    const count = 1
    let updatedData = []
      updatedData = data?.client.filter(item => {
        const startsWith = item?.property_owneds_aggregate.aggregate.count >= count
        if (startsWith) {
          return startsWith
        } else {
          return null
        }
      })
      propertyOwnedData = updatedData
      if (searchEmail.length || searchName.length || searchCountry.length || searchPropertyId.length || searchCity.length || searchAddress.length || searchCommunity.length) {
        return filteredData
      } else {
        return propertyOwnedData
      }
  }

  const handleUpdate = async (updatedRow, assigned, data) => {
    try {
      if (assigned) {
        await unassignProp({variables: {
          id: updatedRow.id,
          lease_id: data.id 
        }})
      }
      await updateProp({variables: {
          id: updatedRow.id,
          city: updatedRow.city,
          community: updatedRow.community,
          address: updatedRow.address,
          country: updatedRow.country
          }})
          clearRecord()
          refetchProps()
      toast.success(
        <ToastComponent title="Property Updated" color="success" icon={<Check />} />,
        {
          autoClose: 4000,
          hideProgressBar: false,
          closeButton: false
        }
      )
    } catch (e) {
      console.log(e)
      toast.error(
        <ToastComponent title="Error updating property" color="danger" icon={<XCircle />} />,
        {
          autoClose: 4000,
          hideProgressBar: false,
          closeButton: false
        }
      )
    }
    
      dataToRender()
  }


  const addPropertyRecord = () => {
    setToAddNewRecord(true)
    setRow({
        active: 1
    })
    setTimeout(() => {
      setModal(!modal) 
    }, 200)
  }


  const handleAddRecord = async (newRow, clientOwnedArray, clientLeasedArray, lease_start, lease_end) => {
    try {
      const res = await addProp({variables: {
        community: newRow.community,
        country: newRow.country,
        city: newRow.city,
        address: newRow.address
      }})
      console.log("New property added", res)
      for (let i = 0; i < clientOwnedArray.length; i++) {
        const owner_id = clientOwnedArray[i].value
        const res2 = await addPropOwned({variables: {
          property_id: res.data.insert_property_one.id,
          owner_id
        }})
        console.log("Property Owned for client Added", res2)
      }
      
      if (clientLeasedArray.length > 0) {
        for (let i = 0; i < clientOwnedArray.length; i++) {
          const lease_id = clientOwnedArray[i].value
          const res3 = await addLease({variables: {
            property_id: res.data.insert_property_one.id,
            lease_id,
            lease_start,
            lease_end
          }})
          console.log("Property Owned for client Leased Added", res3)
        }
      }
      dataToRender()
      if (!addPropertyLoading) {
        setModal(!modal)
      }
    } catch (error) {
      console.log(error)
      return toast.error(<ToastComponent title='Error' color='danger' icon={<Info />} />, {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      })
    }
  }

  // const handleDeleteRecord = (id) => {
  //   deleteProp({variables: {
  //       id
  //     }})
  //     dataToRender()
  //     if (!deleteWorkerLoading) {
  //       toggleModal()
  //     }
  // }


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
      if (searchEmail.length || searchCountry.length || searchPropertyId.length || searchCity.length || searchAddress.length || searchCommunity.length) {
        return filteredData
      } else {
        return propertyOwnedData
      }
    }

    setSearchName(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item?.full_name?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item?.full_name?.toLowerCase().includes(value.toLowerCase())

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
      if (searchName.length || searchCountry.length || searchPropertyId.length || searchCity.length || searchAddress.length || searchCommunity.length) {
        return filteredData
      } else {
        return propertyOwnedData
      }
    }

    setSearchEmail(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item?.email?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item?.email?.toLowerCase().includes(value.toLowerCase())

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
        if (searchEmail.length || searchName.length || searchPropertyId.length || searchCity.length || searchAddress.length || searchCommunity.length) {
          return filteredData
        } else {
          return propertyOwnedData
        }
      }
  
      setSearchCountry(value)
      if (value.length) {
        updatedData = dataToFilter().filter(item => {
          const startsWith = item?.property_owneds?.some(item2 => item2?.property?.country.toLowerCase().startsWith(value.toLowerCase()) === true)
          const includes = item?.property_owneds?.some(item2 => item2?.property?.country.toLowerCase().includes(value.toLowerCase()) === true)
          console.log(startsWith)
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
        if (searchEmail.length || searchName.length || searchCountry.length || searchPropertyId.length || searchAddress.length || searchCommunity.length) {
          return filteredData
        } else {
          return propertyOwnedData
        }
      }
  
      setSearchCity(value)
      if (value.length) {
        updatedData = dataToFilter().filter(item => {
          const startsWith = item?.property_owneds?.some(item2 => item2?.property?.city.toLowerCase().startsWith(value.toLowerCase()) === true)
          const includes = item?.property_owneds?.some(item2 => item2?.property?.city.toLowerCase().includes(value.toLowerCase()) === true)
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
        if (searchEmail.length || searchName.length || searchCountry.length || searchPropertyId.length || searchCity.length || searchAddress.length) {
          return filteredData
        } else {
          return propertyOwnedData
        }
      }
  
      setSearchCommunity(value)
      if (value.length) {
        updatedData = dataToFilter().filter(item => {
          const startsWith = item?.property_owneds?.some(item2 => item2?.property?.community.toLowerCase().startsWith(value.toLowerCase()) === true)
          const includes = item?.property_owneds?.some(item2 => item2?.property?.community.toLowerCase().includes(value.toLowerCase()) === true)
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
        if (searchEmail.length || searchName.length || searchCountry.length || searchPropertyId.length || searchCity.length || searchCommunity.length) {
          return filteredData
        } else {
          return propertyOwnedData
        }
      }
  
      setSearchAddress(value)
      if (value.length) {
        updatedData = dataToFilter().filter(item => {
          const startsWith = item?.property_owneds?.some(item2 => item2?.property?.address.toLowerCase().startsWith(value.toLowerCase()) === true)
          const includes = item?.property_owneds?.some(item2 => item2?.property?.address.toLowerCase().includes(value.toLowerCase()) === true)
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

    // ** Function to handle ID filter
    const handlePropertyIdFilter = e => {
      const value = e.target.value
      let updatedData = []
      const dataToFilter = () => {
          if (searchEmail.length || searchName.length || searchCountry.length || searchCity.length || searchAddress.length || searchCommunity.length) {
          return filteredData
        } else {
          return propertyOwnedData
        }
      }
  
      setSearchPropertyId(value)
      if (value.length) {
        updatedData = dataToFilter().filter(item => {
          const startsWith = item?.property_owneds?.some(item2 => item2?.property?.id.toString().startsWith(value.toLowerCase()) === true)
          const includes = item?.property_owneds?.some(item2 => item2?.property?.id.toString().includes(value.toLowerCase()) === true)
          console.log(startsWith)
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
            <Button className='ml-2' color='primary' onClick={() => addPropertyRecord()}>
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
        //   paginationComponent={CustomPagination}
          data={dataToRender()}
          expandableRows
          expandableRowsComponent={<ExpandableTable data={dataToRender()} openModalAlert={openModalAlert} handleUpdate={handleUpdate} />}
          expandOnRowClicked
          // selectableRowsComponent={BootstrapCheckbox}
        /> : <h4 className="d-flex text-center align-items-center justify-content-center mb-5">Loading Property information</h4>}
       
      </Card>
      <AddNewModal 
      open={modal} 
      data={data?.client}
      handleModal={handleModal} 
      handleAddRecord={handleAddRecord} 
      toAddNewRecord={toAddNewRecord} 
      closeModal={closeModal} 
      row={row} 
      setRow={setRow} 
      handleUpdate={handleUpdate}
      clientOwnedArray={clientOwnedArray}
      setclientOwnedArray={setclientOwnedArray}
      clientLeasedArray={clientLeasedArray}
      setclientLeasedArray={setclientLeasedArray}
      lease_start_date={lease_start_date}
      setLease_start_date={setLease_start_date}
      lease_end_date={lease_end_date}
      setLease_end_date={setLease_end_date}
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

export default LeasedProperty
