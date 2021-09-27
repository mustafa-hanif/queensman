// ** React Imports
import { useState, Fragment, forwardRef, useContext } from 'react'


// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { Offline, Online } from "react-detect-offline"
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'
import { MoreVertical, Edit, ChevronDown, Plus, Trash, Eye, EyeOff, Edit3, Upload, Loader, Check, XCircle } from 'react-feather'
import { Card, CardHeader, CardBody, CardTitle, Input, Label, FormGroup, Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap'

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

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { gql, useMutation, useQuery } from '@apollo/client'
import AddNewModal from './AddNewModal'
import ButtonGroup from 'reactstrap/lib/ButtonGroup'
import { months } from 'moment'
import Badge from 'reactstrap/lib/Badge'
import { useNiceMutation, useNiceQuery } from '../../utility/Utils'

const GET_WORKER = gql`
query GetWorker {
  worker(order_by: {id: desc}, where: {team_id: {_is_null: false}}) {
    active
    description
    email
    full_name
    id
    isEmergency
    team_id
    role
    password
    phone
    teams {
      id
      team_leader
      team_color
    }
    teams_member {
      id
      team_leader
      team_color
    }
  }
}
`

const GET_TEAMS = gql`
query MyQuery {
  teams {
    id
    team_color
    team_leader
  }
}`


const REMOVE_TEAM_MEMBER = gql`
mutation RemoveTeamMember($id: Int!) {
  update_worker_by_pk(pk_columns: {id: $id}, _set: {team_id: null}) {
    id
  }
}
`

const UPDATE_TEAM_COLOR = gql`
mutation UpdateTeamColor($team_leader: Int!, $team_color: String!) {
  update_teams(where: {team_color: {_eq: $team_color}}, _set: {team_leader: $team_leader}) {
    affected_rows
  }
}
`
const DataTableAdvSearch = () => {

        // ** States
  const { loading, data, error, refetch: refectchWorker } = useNiceQuery(GET_WORKER, {fetchPolicy: 'network-only', nextFetchPolicy: 'network-only'})
  const { teamsLoading, data: teamsData, error: teamsError } = useNiceQuery(GET_TEAMS)
  const [updateTeamColor, {loading: updateTeamColorLoading}] = useNiceMutation(UPDATE_TEAM_COLOR, {refetchQueries:[{query: GET_WORKER}]})
  const [removeTeamMember, {loading: deleteTeamMemberLoading}] = useNiceMutation(REMOVE_TEAM_MEMBER, {refetchQueries:[{query: GET_WORKER}]})
  const [modal, setModal] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [description, setDescription] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [filteredData, setFilteredData] = useState([])
  const [row, setRow] = useState(null)
  const [changeLeader, setChangeLeader] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [deleteModalDetails, setDeleteModalDetails] = useState(null)

  const closeAlertModal = () => {
      setModalAlertDetails(null)
      setChangedColor(null)
      setModalAlert(false)
  }

  const openModalAlert = () => {
    setModalAlert(true)
  }
  
    const closeModal = () => {
        setModal(!modal)
    }

  // ** Function to open Delete alert modal
  const openDeleteModal = (row) => {
    setDeleteModalDetails(row)
    setDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setDeleteModal(false)
}

  // ** Function to handle Modal toggle
  const handleModal = (row) => { 
      setRow(row)
      // setTimeout(() => {
        setModal(!modal) 
      // }, 200)
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
      wrap: true,
      minWidth: '250px'
    },
    {
      name: 'Full Name',
      selector: 'full_name',
      sortable: true,
      wrap: true,
      minWidth: '200px'
    },
    {
      name: 'Description',
      selector: 'description',
      sortable: true,
      wrap: true,
      minWidth: '200px'
    },
    {
        name: 'Emergency Team',
        selector: 'isEmergency',
        sortable: true,
        wrap: true,
        minWidth: '150px',
        cell: row => {
            return (
                <>
                {row.isEmergency && <Badge color={'light-danger'} pill>Emergency Team</Badge>}
                </>
            )
        }
      },
      {
        name: 'Team Color',
        selector: 'teams.team_color || teams_member.team_color',
        sortable: true,
        wrap: true,
        minWidth: '50px',
        cell: row => {
          const color = row?.teams?.[0]?.team_color ?? row?.teams_member?.team_color
          return (
            color && <Badge pill style={{backgroundColor: color}}>{' '}</Badge>
          )
        }
      },
      {
        name: 'Team Position',
        selector: 'teams[0].team_leader',
        sortable: true,
        wrap: true,
        minWidth: '150px',
        cell: row => {
          const leader = row?.teams?.[0]?.team_leader
          return (
            leader ? <Badge color={'light-success'} pill>Team Leader</Badge> : <Badge color={'light-warning'} pill>Team Member</Badge>
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
            {row?.teams.length === 0 && <Button color='danger' className="btn-icon" size="sm" onClick={() => { openDeleteModal(row) }}>
            <Trash size={15} />
            </Button>}
            {row?.teams.length === 0 && <Button color='primary' className="btn-icon" size="sm">
            <Edit size={15} onClick={() => handleModal(row)} />
            </Button>}
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
      return data?.worker
    }
  }
  
  const handleUpdate = async (updatedRow) => {
    try {
    if (changeLeader) { //If leader is to be changed
      const res3 = await updateTeamColor({variables: {
        team_color: updatedRow.teams_member.team_color, //existing color
        team_leader: updatedRow.id //existing worker id
      }})
    }
    toast.success(
      <ToastComponent title="Worker updated" color="success" icon={<Check />} />,
      {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      }
    )
    setChangeLeader(false)
    refectchWorker()
    // dataToRender()
  } catch (e) {
console.log(e)
  }
  
    if (!loading) {
        
      setModal(!modal)
    }
  }

  // ** Function to handle name filter
  const handleNameFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
        if (searchEmail.length || description.length || searchPhone.length)  {
        return filteredData
      } else {
        return data?.worker
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
        if (searchName.length || description.length || searchPhone.length) {
        return filteredData
      } else {
        return data?.worker
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
        if (searchEmail.length || searchName.length || searchPhone.length) {
        return filteredData
      } else {
        return data?.worker
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
        if (searchEmail.length || searchName.length || description.length) {
        return filteredData
      } else {
        return data?.worker
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
        </CardHeader>
        <CardBody>
          <Row form className='mt-1 mb-50'>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='name'>Name:</Label>
                <Input id='name' placeholder='Search Worker Name' value={searchName} onChange={handleNameFilter} />
              </FormGroup>
            </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='email'>Email:</Label>
                <Input
                  type='email'
                  id='email'
                  placeholder='Search Worker Email'
                  value={searchEmail}
                  onChange={handleEmailFilter}
                />
              </FormGroup>
            </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='occupation'>Description:</Label>
                <Input id='occupation' placeholder='Search Worker Description' value={description} onChange={handleDescriptionFilter} />
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
                <Input id='phone' placeholder='Search Worker Phone' value={searchPhone} onChange={handlePhoneFilter} />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
        <Online>
        {!loading ?  <DataTable
          noHeader
          pagination
          // selectableRows
          columns={advSearchColumns}
          paginationPerPage={7}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
          paginationDefaultPage={currentPage + 1}
          data={dataToRender()}
          onRowClicked={(row) => console.log(row)}
          // selectableRowsComponent={BootstrapCheckbox}
        /> : <h4 className="d-flex text-center align-items-center justify-content-center mb-5">Loading Worker information</h4>}
        </Online>
       <Offline><h2 className="d-flex text-center align-items-center justify-content-center mb-5">WHY R U DISCONNECTED</h2></Offline>
      </Card>
      <AddNewModal 
      open={modal} 
      handleModal={handleModal} 
      closeModal={closeModal} 
      row={row} 
      changeLeader={changeLeader}
      setChangeLeader={setChangeLeader}
      setRow={setRow} 
      handleUpdate={handleUpdate}
      />
      <div className='theme-modal-danger'>
        <Modal
          isOpen={deleteModal}
          className='modal-dialog-centered'
          modalClassName="modal-danger"
        >
          <ModalHeader>Remove Team member from current team?</ModalHeader>
          <ModalBody>
          {deleteTeamMemberLoading ? <Spinner color="primary" /> : <p>
            This member already belongs team : <br />
            Team Id: {deleteModalDetails?.teams_member?.team_leader}<br />
            Color: {deleteModalDetails?.teams_member?.team_color }
            </p>
         }
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={ async () => { await removeTeamMember({variables: {id: deleteModalDetails.id }}); closeDeleteModal() }} >
              Remove
            </Button>
            <Button color='secondary' onClick={closeDeleteModal} outline>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Fragment>
  )
}

export default DataTableAdvSearch
