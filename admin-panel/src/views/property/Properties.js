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
    zIndex: 10
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
import AddNewModalAssignProp from './AddNewModalAssignProp'
import ButtonGroup from 'reactstrap/lib/ButtonGroup'
import { months } from 'moment'
import Badge from 'reactstrap/lib/Badge'
import Spinner from 'reactstrap/lib/Spinner'

const GET_PROPS = gql`
query GetProperties {
    property(order_by: {id: asc}) {
      id
      city
      country
      community
      address
      active
    }
  }
`
const GET_CLIENT_PROPS = gql`
query GetClientOwned {
  client(order_by: {id: asc}) {
    id
    email
    full_name
    password
    phone
    account_type
    active
    property_owneds {
      property_id
    }
    leases {
      property_id
    }
  }
}`

const ASSIGN_OWNED_PROPERTY = gql`
mutation AssignOwnedProperty($owner_id: Int!, $property_id: Int!) {
  insert_property_owned(objects: {owner_id: $owner_id, property_id: $property_id, uploaded_by: 10000002, active: "1"}) {
    affected_rows
  }
}
`
const ASSIGN_LEASED_PROPERTY = gql`
mutation AddLeasedProperty($property_id: Int = 10, $lease_start: timestamp!, $lease_end: timestamp!, $owner_id: Int!) {
  insert_lease(objects: {property_id: $property_id, lease_start: $lease_start, lease_end: $lease_end, uploaded_by: 10000002, active: "1", lease_id: $owner_id}) {
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

const DataTableAdvSearch = () => {

        // ** States
  const { loading, data, error, refetch: refetchProperties } = useQuery(GET_PROPS)
  const { loading: clientLoading, data: clientData, error: clientError, refetch: refetchClient } = useQuery(GET_CLIENT_PROPS)
  const [updateProp, {loading: propertyLoading}] = useMutation(UPDATE_PROPS)
  const [addProp, {loading: addPropertyLoading}] = useMutation(ADD_PROPS)
  const [addPropOwned, {loading: addPropertyOwnedLoading}] = useMutation(ADD_PROP_OWNED)
  const [addLease, {loading: addLeaseLoading}] = useMutation(ADD_LEASE)
  const [deleteProp, {loading: deletePropertyLoading}] = useMutation(DELETE_PROPS)
  const [assignOwnedProperty, {loading: assignOwnedPropertyLoading}] = useMutation(ASSIGN_OWNED_PROPERTY)
  const [assignLeasedProperty, {loading: assignLeasedPropertyLoading}] = useMutation(ASSIGN_LEASED_PROPERTY)
  const [modal, setModal] = useState(false)
  const [searchCity, setSearchCity] = useState('')
  const [searchCommunity, setSearchCommunity] = useState('')
  const [searchAddress, setSearchAddress] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [filteredData, setFilteredData] = useState([])
  const [searchCountry, setSearchCountry] = useState('')
  const [toAddNewRecord, setToAddNewRecord] = useState(false)
  const [toAssignNewRecord, setToAssignRecord] = useState(false)
  const [row, setRow] = useState(null)
  const [rowId, setRowId] = useState(null)
  const [clientOwnedArray, setclientOwnedArray] = useState([])
  const [clientLeasedArray, setclientLeasedArray] = useState([])
  const [lease_start_date, setLease_start_date] = useState(null)
  const [lease_end_date, setLease_end_date] = useState(null)
  const [dataLoading, setDataLoading] = useState(false)
  const [loaderButton, setLoaderButton] = useState(false)

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
        setToAssignRecord(false)
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
        setToAssignRecord(false)
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
      name: 'ID',
      selector: 'id',
      sortable: true,
      minWidth: '10px'
    },
    {
      name: 'City',
      selector: 'city',
      sortable: true,
      minWidth: '50px'
    },
    {
      name: 'Country',
      selector: 'country',
      sortable: true,
      wrap: true,
      minWidth: '200px'
    },
    {
      name: 'Community',
      selector: 'community',
      sortable: true,
      wrap: true,
      minWidth: '50px'
    },
    {
      name: 'Address',
      selector: 'address',
      sortable: true,
      wrap: true,
      minWidth: '400px'
    },
    {
      name: "Active/Inactive",
      selector: "active",
      sortable: true,
      minWidth: "150px",
      cell: row => {
        return (
          <Badge color={row?.active === 1 ? 'light-success' :  'light-danger'} pill>
            {row?.active === 1 ? "Active" : "Inactive"}
          </Badge>
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
              {/* <Button color='primary' className="btn-icon" size="sm">
                <Edit size={15} onClick={() => handleModal(row)} />
              </Button> */}
            </ButtonGroup>

          </div>

        )
      }
    }
  ]

//   ** Table data to render
  const dataToRender = () => {
    if (
      searchCity.length ||
      searchAddress.length ||
      searchCountry.length || 
      searchCommunity.length
    ) {
      return filteredData
    } else {
      return data?.property
    }
  }

  const handleUpdate = (updatedRow) => {
    updateProp({variables: {
        id: updatedRow.id,
        city: updatedRow.city,
        community: updatedRow.community,
        address: updatedRow.address,
        country: updatedRow.country
        }})
      dataToRender()
      if (!propertyLoading) {
        // setModal(!modal)
      }
  }

  const addPropertyRecord = (row = false) => {
    console.log(row)
    if (row) {
      setRow(row)
      setToAddNewRecord(false)
      setToAssignRecord(true)
      setTimeout(() => {
        setModal(!modal) 
      }, 200)
    } else {
      setToAssignRecord(false)
      setToAddNewRecord(true)
      setRow({
          active: 1
      })
      setTimeout(() => {
        setModal(!modal) 
      }, 200)
    }
  }

  const handleAssignClient = async (row, clientOwnedArray, clientLeasedArray, lease_start, lease_end) => {
    console.log(row, clientOwnedArray, clientLeasedArray)
    setDataLoading(true)
    try {
      if (clientLeasedArray.length > 0) {
        console.log("leased")
        for (let i = 0; i < clientLeasedArray.length; i++) {
          const owner_id = clientLeasedArray[i].value
            await assignLeasedProperty({variables: {
              property_id: row.id,
              owner_id,
              lease_start,
              lease_end
            }})
        }
        toast.success(
          <ToastComponent title="Property Assigned" color="success" icon={<Check />} />,
          {
            autoClose: 2000,
            hideProgressBar: true,
            closeButton: false
          }
        )
        dataToRender()
        if (!assignOwnedPropertyLoading) {
          setModal(!modal)
        }
      } 
      if (clientOwnedArray.length > 0) {
        console.log("owned")
        for (let i = 0; i < clientOwnedArray.length; i++) {
          const owner_id = clientOwnedArray[i].value
            await assignOwnedProperty({variables: {
              property_id: row.id,
              owner_id
            }})
        }
        setDataLoading(false)
        toast.success(
          <ToastComponent title="Property Assigned" color="success" icon={<Check />} />,
          {
            autoClose: 2000,
            hideProgressBar: true,
            closeButton: false
          }
        )
        dataToRender()
        if (!assignOwnedPropertyLoading) {
          setModal(!modal)
        }
      }
      refetchProperties()
      refetchClient()
    } catch (e) {
      console.log(e)
      setDataLoading(false)
      toast.error(
        <ToastComponent title="Unable to assign" color="danger" icon={<XCircle />} />,
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        }
      )
    }
  }
  const handleAddRecord = async (newRow, clientOwnedArray, clientLeasedArray, lease_start, lease_end) => {
    console.log(newRow, clientOwnedArray, clientLeasedArray)
    setDataLoading(true)
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
      setDataLoading(false)
      toast.success(<ToastComponent title='Property Added' color='success' icon={<Check />} />, {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      })
      refetchProperties()
      refetchClient()
      dataToRender()
      if (!addPropertyLoading) {
        setModal(!modal)
      }
    } catch (error) {
      console.log(error)
      setDataLoading(false)
      return toast.error(<ToastComponent title='Error' color='danger' icon={<Info />} />, {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      })
    }
  }

  const handleDeleteRecord = async (id) => {
    setDataLoading(true)
    try {
      await deleteProp({variables: {
        id
      }})
      toast.error(<ToastComponent title='Property Deleted' color='danger' icon={<Info />} />, {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      })
      setDataLoading(false)
      refetchProperties()
    } catch (e) {
      setDataLoading(false)
      console.log(e?.message)
      if (e?.message === 'Foreign key violation. update or delete on table "property" violates foreign key constraint "property_owned_property_id_fkey" on table "property_owned"') {
        toast.error(<ToastComponent title="This propert is assgined to a client. Please unassign it first" color='danger' icon={<Info />} />, {
          autoClose: 10000,
          hideProgressBar: true,
          closeButton: false
        })  
      } else {
        toast.error(<ToastComponent title="An error occured" color='danger' icon={<Info />} />, {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        })
      }
      
    }
    
      dataToRender()
      if (!deletePropertyLoading) {
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

  // ** Function to handle City filter
  const handleCityFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchAddress.length || searchCountry.length || searchCommunity.length) {
        return filteredData
      } else {
        return data?.property
      }
    }

    setSearchCity(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.city?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.city?.toLowerCase().includes(value.toLowerCase())

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

  // ** Function to handle Address filter
  const handleAddressFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchCity.length || searchCountry.length || searchCommunity.length) {
        return filteredData
      } else {
        return data?.property
      }
    }

    setSearchAddress(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.address?.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.address?.toLowerCase().includes(value.toLowerCase())

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

    // ** Function to handle country filter
    const handleCountryFilter = e => {
      const value = e.target.value
      let updatedData = []
      const dataToFilter = () => {
          if (searchAddress.length || searchCity.length || searchCommunity.length) {
          return filteredData
        } else {
          return data?.property
        }
      }
  
      setSearchCountry(value)
      if (value.length) {
        updatedData = dataToFilter().filter(item => {
          const startsWith = item.country?.toLowerCase().startsWith(value.toLowerCase())
  
          const includes = item.country?.toLowerCase().includes(value.toLowerCase())
  
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

    // ** Function to handle Community filter
    const handleCommunityFilter = e => {
      const value = e.target.value
      let updatedData = []
      const dataToFilter = () => {
          if (searchAddress.length || searchCity.length || searchCountry.length) {
          return filteredData
        } else {
          return data?.property
        }
      }
  
      setSearchCommunity(value)
      if (value.length) {
        updatedData = dataToFilter().filter(item => {
          const startsWith = item.community?.toLowerCase().startsWith(value.toLowerCase())
  
          const includes = item.community?.toLowerCase().includes(value.toLowerCase())
  
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

  const clearRecord = () => {
    setSearchCity("")
    setSearchAddress("")
    setSearchAddress("")
    setSearchCommunity("")
  }
  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Search Properties</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            { (searchCity || searchAddress || searchCountry || searchCommunity) && <Button className='ml-2' color='danger' outline onClick={() => clearRecord()}>
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
            <Col lg='3' md='6'>
              <FormGroup>
                <Label for='city'>City:</Label>
                <Input id='city' placeholder='Search City here' value={searchCity} onChange={handleCityFilter} />
              </FormGroup>
            </Col>
            <Col lg='3' md='6'>
              <FormGroup>
                <Label for='address'>Address:</Label>
                <Input
                  type='address'
                  id='address'
                  placeholder='Search Address here'
                  value={searchAddress}
                  onChange={handleAddressFilter}
                />
              </FormGroup>
            </Col>
            <Col lg='3' md='6'>
              <FormGroup>
                <Label for='country'>Country:</Label>
                <Input
                  type='country'
                  id='country'
                  placeholder='Search Country here'
                  value={searchCountry}
                  onChange={handleCountryFilter}
                />
              </FormGroup>
            </Col>
            <Col lg='3' md='6'>
              <FormGroup>
                <Label for='community'>Community:</Label>
                <Input
                  type='community'
                  id='community'
                  placeholder='Search Community here'
                  value={searchCommunity}
                  onChange={handleCommunityFilter}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
        {!loading && !addPropertyLoading ? <DataTable
          noHeader
          pagination
          columns={advSearchColumns}
          paginationPerPage={7}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
          paginationDefaultPage={currentPage + 1}
          // paginationComponent={CustomPagination}
          data={dataToRender()}
          onRowClicked={(row) => addPropertyRecord(row)}
          pointerOnHover
          highlightOnHover
        /> : <h4 className="d-flex text-center align-items-center justify-content-center mb-5" style={{minHeight: "400px"}}>Loading Property information</h4>}
       
      </Card>
      {dataLoading ? <Overlay loading={dataLoading} setLoading={setDataLoading} loaderButton={loaderButton} setLoaderButton={setLoaderButton}/> : <AddNewModalAssignProp 
      open={modal} 
      data={clientData?.client}
      handleModal={handleModal} 
      handleAddRecord={handleAddRecord} 
      toAddNewRecord={toAddNewRecord} 
      toAssignNewRecord={toAssignNewRecord} 
      handleAssignClient={handleAssignClient}
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
      />}
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
