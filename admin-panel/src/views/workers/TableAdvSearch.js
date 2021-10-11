// ** React Imports
import { useState, Fragment, forwardRef, useContext } from 'react'
import { auth } from "../../utility/nhost"


// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
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
    worker(order_by: {id: desc}) {
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

const CLEAR_EMERGENCY_WORKER = gql`
  mutation UpdateWorker($emergencyId: Int!) {
    clear_emergency: update_worker_by_pk(pk_columns: {id: $emergencyId}, _set: {isEmergency: false}) {
      email
    }
  }
`

const UPDATE_WORKER = gql`
mutation UpdateWorker($id: Int!, $description: String, $full_name: String, $isEmergency: Boolean, $phone: String, $team_id: Int, $active: smallint) {
   update_worker_by_pk(pk_columns: {id: $id}, _set: {description: $description, full_name: $full_name, phone: $phone, team_id: $team_id, isEmergency: $isEmergency, active: $active}) {
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
}`

const REMOVE_FROM_TEAM_COLOR = gql`
mutation RemoveFromTeamColor($_eq: String = "") {
  update_teams(where: {team_color: {_eq: $_eq}}, _set: {team_color: null}) {
    affected_rows
  }
}
`

const UPDATE_TEAM_COLOR = gql`
mutation UpdateTeamColor($team_leader: Int!, $team_color: String!) {
  update_teams(where: {team_leader: {_eq: $team_leader}}, _set: {team_color: $team_color}) {
    affected_rows
  }
}
`

const UPDATE_TEAM_ID_IN_WORKER = gql`
mutation updateTeamIdinWorker($team_id: Int!, $id: Int!) {
  update_worker_by_pk(pk_columns: {id: $id}, _set: {team_id: $team_id}) {
    id
  }
}
`
const DataTableAdvSearch = () => {

        // ** States
  const { loading, data, error, refetch: refectchWorker } = useNiceQuery(GET_WORKER, {fetchPolicy: 'network-only', nextFetchPolicy: 'network-only'})
  const { teamsLoading, data: teamsData, error: teamsError } = useNiceQuery(GET_TEAMS)
  const [clearEmergency, {loading: emergencyworkerLoading}] = useNiceMutation(CLEAR_EMERGENCY_WORKER, {refetchQueries:[{query: GET_WORKER}]})
  const [updateWorker, {loading: workerLoading}] = useNiceMutation(UPDATE_WORKER)
  const [updateTeamColor, {loading: updateTeamColorLoading}] = useNiceMutation(UPDATE_TEAM_COLOR, {refetchQueries:[{query: GET_WORKER}]})
  const [addWorker, {loading: addWorkerLoading}] = useNiceMutation(ADD_WORKER, {refetchQueries:[{query: GET_WORKER}]})
  const [deleteWorker, {loading: deleteWorkerLoading}] = useNiceMutation(DELETE_WORKER, {refetchQueries:[{query: GET_WORKER}]})
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
  const [changeColor, setChangedColor] = useState(false)

  const [modalAlert, setModalAlert] = useState(null)
  const [modalAlertDetails, setModalAlertDetails] = useState(null)

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

  // ** Function to handle Modal toggle
  const handleModal = (row) => { 
      setRow(row)
      // setTimeout(() => {
        setModal(!modal) 
      // }, 200)
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
      name: 'Phone',
      selector: 'phone',
      sortable: true,
      wrap: true,
      minWidth: '150px'
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
        name: 'Team',
        selector: 'teams',
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
      name: 'Actions',
      minWidth: '200px',
      allowOverflow: true,
      cell: row => {
        return (
          <div className="d-flex w-100 align-items-center">
            <ButtonGroup size="sm" >
            {/* <Button color='danger' className="btn-icon" size="sm" onClick={() => { openModalAlert(row.id) }}>
            <Trash size={15} />
            </Button> */}
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
      return data?.worker
    }
  }
  
  const handleUpdate = async (updatedRow) => {
    console.log(updatedRow)
    console.log(changeColor)
    try {
    if (changeColor[0]) { //If color is provided
      if ((!updatedRow.team_id) || (updatedRow.team_id && updatedRow.teams.length === 0)) { //If worker has no team id assigned OR worker has team assigned and is not a team leader
        //Update team_id of current worker)
        await updateWorker({variables: {
          active: updatedRow.active,
          description: updatedRow.description,
          full_name: updatedRow.full_name,
          id: updatedRow.id,
          isEmergency: updatedRow.isEmergency,
          team_id: changeColor[1],
          phone: updatedRow.phone
        }})
      } else { //Worker is team_leader
        const worker = data?.worker.filter(value => value.teams?.[0]?.team_color === changeColor[0]) //Get worker who already has the color
        if (worker?.[0]) { //If such worker exsists
          setModalAlertDetails([worker[0], changeColor[0], updatedRow]) // [existing worker, colorToChange, current worker details row]
          openModalAlert()
        }
      }
    }
    if (updatedRow.isEmergency) {
      console.log("hello")
      const emergencyId = data?.worker.filter(value => value.isEmergency === true)?.[0]?.id
      console.log(emergencyId)
      if (emergencyId) {
        console.log({emergencyId})
        await clearEmergency({ variables: {emergencyId} })
      }
      console.log("HGi")
      console.log({
        active: updatedRow.active,
        description: updatedRow.description,
        full_name: updatedRow.full_name,
        id: updatedRow.id,
        team_id: updatedRow.team_id,
        isEmergency: updatedRow.isEmergency,
        phone: updatedRow.phone
      })
        await updateWorker({variables: {
          active: updatedRow.active,
          description: updatedRow.description,
          full_name: updatedRow.full_name,
          id: updatedRow.id,
          team_id: updatedRow.team_id,
          isEmergency: updatedRow.isEmergency,
          phone: updatedRow.phone
        }})
    } else if (!changeColor[0] && (row.active || row.description || row.full_name || row.phone)) {
      console.log("ast")
      await updateWorker({variables: {
        active: updatedRow.active,
        description: updatedRow.description,
        full_name: updatedRow.full_name,
        id: updatedRow.id,
        team_id: updatedRow.team_id,
        isEmergency: updatedRow.isEmergency,
        phone: updatedRow.phone
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
    refectchWorker()
    // dataToRender()
    setRow(null)
  } catch (e) {
console.log(e)
  }
  
    if (!workerLoading) {
        
      setModal(!modal)
    }
  }

  const addWorkerRecord = () => {
    setToAddNewRecord(true)
    setRow({ active: 1 })
    setTimeout(() => {
      setModal(!modal) 
    }, 200)
  }

  const handleAddRecord = async (newRow) => {
    try {
      await auth.register({
        email: newRow.email.toLowerCase(),
        password: "0000", // newRow.password,
        options: { userData: { display_name: newRow.full_name } }
      })
      console.log("Worker registerd")
      await addWorker({variables: {
        active: newRow?.active,
        description: newRow?.description,
        email: newRow?.email.toLowerCase(),
        full_name: newRow?.full_name,
        isEmergency: false,
        team_id: changeColor[1],
        role: newRow?.role,
        phone: newRow?.phone,
        password: newRow?.password
      }})
      console.log("Worker added")
      toast.success(
        <ToastComponent title="Worker Registered" color="success" icon={<Check />} />,
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        }
      )
      dataToRender()
      if (!addWorkerLoading) {
        setModal(!modal)
      }
    } catch (e) {
      console.log(e.message)
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

  const handleChangeTeamColor = async (existingWorker, team_color, updatedRow) => {
    try {
      // const res = await removeFromTeamColor({variables: {
      //   _eq: team_color //set team color to run of existing worker
      // }})
      console.log(updatedRow)
      console.log(existingWorker)
      const res3 = await updateTeamColor({variables: {
        team_color: updatedRow.teams[0].team_color, //existing color
        team_leader: existingWorker.id //existing worker id
      }})
      const res2 = await updateTeamColor({variables: {
        team_color, //new color
        team_leader: updatedRow.id //new worker id
      }})
      setModalAlertDetails(null)
      setChangedColor(null)
      setModalAlert(null)
      toast.success(
        <ToastComponent title="Team changed" color="success" icon={<Check />} />,
        {
          autoClose: 5000,
          hideProgressBar: true,
          closeButton: false
        }
      )
    } catch (e) {
      console.log(e)
      toast.error(
        <ToastComponent title="Error" color="danger" icon={<XCircle />} />,
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        }
      )
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
       
      </Card>
      <AddNewModal 
      open={modal} 
      handleModal={handleModal} 
      handleAddRecord={handleAddRecord} 
      toAddNewRecord={toAddNewRecord} 
      closeModal={closeModal} 
      changeColor={changeColor}
      setChangedColor={setChangedColor}
      row={row} 
      teamsData={teamsData}
      setRow={setRow} 
      handleUpdate={handleUpdate}
      />
      <div className='theme-modal-warning'>
        <Modal
          isOpen={modalAlert}
          className='modal-dialog-centered'
          modalClassName="modal-warning"
        >
          <ModalHeader>Change team color</ModalHeader>
          <ModalBody>
          {workerLoading || updateTeamColorLoading ? <Spinner color="primary" /> : <p>
            This Team color already belongs to a team: <br />
            Team Leader: {modalAlertDetails?.[0].full_name}<br />
            Email: {modalAlertDetails?.[0].email}<br />
            Color: {modalAlertDetails?.[0].teams?.[0]?.team_color }
            </p>
         }
          </ModalBody>
          <ModalFooter>
            <Button color="warning" onClick={() => { handleChangeTeamColor(modalAlertDetails?.[0], modalAlertDetails?.[1], modalAlertDetails?.[2]) }} >
              Change
            </Button>
            <Button color='secondary' onClick={closeAlertModal} outline>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Fragment>
  )
}

export default DataTableAdvSearch
