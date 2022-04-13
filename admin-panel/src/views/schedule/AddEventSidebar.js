// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { gql } from "@apollo/client"

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import classnames from 'classnames'
import { toast } from 'react-toastify'
import Flatpickr from 'react-flatpickr'
import { X, Check, Trash, Info, Upload } from 'react-feather'
import Select, { components } from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { Media, Button, Modal, ModalHeader, ModalBody, Card, ListGroup, ListGroupItem, FormGroup, Label, CustomInput, Input, Form, ModalFooter, Badge, CardBody, CardHeader, CardTitle, Row, Col } from 'reactstrap'
import AutoComplete from '@components/autocomplete'

// ** Utils
import { selectThemeColors, isObjEmpty } from '@utils'


// ** Styles Imports
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useNiceLazyQuery, useNiceMutation, useNiceQuery } from '../../utility/Utils'
import { HASURA } from '../../_config'
import { storage } from '../../utility/nhost'

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

const MySwal = withReactContent(Swal)

const GET_CALLOUT = gql`
  query GetCallout($id: Int!) {
    callout_by_pk(id: $id) {
      pre_pics {
        picture_location
      }
      postpics {
        picture_location
      }
      job_worker {
        worker {
          email
          full_name
          phone
        }
      }
      job_notes {
        note
      }
    }
  }
`

const GET_CLIENT = gql`
query GetClient {
  client(where: {active: {_eq: "1"}}) {
    full_name
    email
    id
    active
  }
}
`

const GET_WORKER = gql`
query GetWorker {
  worker {
    full_name
    id
    email
  }
}
`

const UPDATE_JOB_TICKET = gql`
mutation UpdateJob($id: Int!, $name: String, $worker_id: Int!, $worker_email: String, $client_email: String, $type: String, $description: String) {
  update_job_tickets_by_pk(pk_columns: {id: $id}, _set: {name: $name, worker_id: $worker_id, worker_email: $worker_email, client_email: $client_email, type: $type, description: $description}) {
    id
  }
}
`

const ADD_JOB_TICKET = gql`
mutation InsertJobTickets($name: String, $description: String, $type: String,  $callout_id: Int!, $scheduler_id: Int!, $worker_id: Int!, $worker_email: String!, $client_email: String!) {
  insert_job_tickets(objects: {name: $name, description: $description, type: $type, callout_id: $callout_id, scheduler_id: $scheduler_id, worker_id: $worker_id, worker_email: $worker_email, client_email: $client_email, status: "Open"}) {
    affected_rows
  }
}
`

const DELETE_JOB_TICKET = gql`
mutation deleteJobTicket($id: Int!) {
  delete_job_tickets_by_pk(id: $id) {
    id
  }
}
`

const GET_PROPERTY = gql`
query GetProperty($ownerId: Int) {
  property_owned(where: {owner_id: {_eq: $ownerId}}) {
    property {
      address
      id
    }
  }
}
`

const ADD_PICTURE = gql`
mutation AddPicutre($id: Int!, $picture1: String = null, $picture2: String = null, $picture3: String = null, $picture4: String = null) {
  update_callout_by_pk(pk_columns: {id: $id}, _set: {picture1: $picture1, picture2: $picture2, picture3: $picture3, picture4: $picture4}) {
    picture1
    picture2
    picture3
    picture4
  }
}`

const CHANGE_STATUS = gql`
mutation ChangeStatus($id: Int!, $status: String!) {
  update_callout_by_pk(pk_columns: {id: $id}, _set: {status: $status}) {
    id
  }
}`
const AddEventSidebar = props => {
  // ** Props
  const {
    open,
    handleAddEventSidebar,
    calendarsColor,
    calendarApi,
    refetchEvents,
    requestCalloutApiCall,
    selectEvent,
    selectedEvent,
    updateEvent,
    removeEvent
  } = props

  useEffect(() => {
   
  }, [])
  // const selectedEvent = store.selectedEvent

  const handleWarning = (error) => {
    return MySwal.fire({
      title: 'Error!',
      text: `Could not change status. Error: ${error?.message}`,
      icon: 'warning',
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    })
  }

  const handleSuccess = () => {
    return MySwal.fire({
      title: 'Success',
      text: 'Status changed successfully!',
      icon: 'success',
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    })
  }

  const { register, errors, handleSubmit } = useForm()

  // ** States
  const [contentLoading, setContentLoading] = useState(true)

  const [url, setUrl] = useState(selectedEvent?.url || '')
  const [desc, setDesc] = useState(selectedEvent?.extendedProps?.description || '')
  const [guests, setGuests] = useState(selectedEvent?.extendedProps?.guests || '')
  const [allDay, setAllDay] = useState(selectedEvent?.allDay || false)
  const [location, setLocation] = useState(selectedEvent?.extendedProps?.location || '')
  const [startPicker, setStartPicker] = useState(new Date(selectedEvent?.start) || '')
  const [endPicker, setEndPicker] = useState(new Date(selectedEvent?.end) || '')
  const [clientName, setClientName] = useState(selectedEvent?.extendedProps?.clientName || '')
  const [clientEmail, setClientEmail] = useState(selectedEvent?.extendedProps?.clientEmail || 'No client')
  const [clientId, setClientId] = useState(selectedEvent?.extendedProps?.clientId)
  const [propertyName, setPropertyName] = useState(selectedEvent?.extendedProps?.propertyName  || '')
  const [propertyId, setPropertyId] = useState(selectedEvent?.extendedProps?.propertyId  || 9999)
  const [workerName, setWorkerName] = useState(selectedEvent?.extendedProps?.workerName || '')
  const [workerId, setWorkerId] = useState(selectedEvent?.extendedProps?.workerId)
  const [blocked, setBlocked] = useState(selectedEvent?.extendedProps?.blocked)
  const [workerEmail, setWorkerEmail] = useState(selectedEvent?.extendedProps?.workerEmail)
  const [jobTickets, setJobTickets] = useState([])
  const [status, setStatus] = useState(selectedEvent?.extendedProps?.status)
  const [picture1, setPicture1] = useState({picture: selectedEvent?.extendedProps?.picture1, uploadPicture: null})
  const [picture2, setPicture2] = useState({picture: selectedEvent?.extendedProps?.picture2, uploadPicture: null})
  const [picture3, setPicture3] = useState({picture: selectedEvent?.extendedProps?.picture3, uploadPicture: null})
  const [picture4, setPicture4] = useState({picture: selectedEvent?.extendedProps?.picture4, uploadPicture: null})
  const [statusChanged, setStatusChanged] = useState(false)
  const [changeStatusIsOpen, setChangeStatusIsOpen] = useState(false)
  const [uploadButton, setUploadButton] = useState(false)

  const { clientLoading, data: allClients, clientError } = useNiceQuery(GET_CLIENT, {
    skip: !open
  })
  const [getProperty, { propertyLoading, data: allProperty, propertyError }] = useNiceLazyQuery(GET_PROPERTY, {
    skip: !open,
    variables: { ownerId:clientId }
  })
  const { workerLoading, data: allWorkers, workerError } = useNiceQuery(GET_WORKER, {
    skip: !open
  })

  const [changeStatus, {loading: statusLoading, data: statusData, error: statusError}] = useNiceMutation(CHANGE_STATUS, { onCompleted: () => {
    handleSuccess()
    setStatusChanged(true)
  },
onError: (e) => {
  handleWarning(e)
  setStatusChanged(true)
  }})
  const [addJobTicket] = useNiceMutation(ADD_JOB_TICKET)
  const [deleteJobTicket] = useNiceMutation(DELETE_JOB_TICKET)

  const [updateJobTicket] = useNiceMutation(UPDATE_JOB_TICKET)

  const [addCalloutPicture] = useNiceMutation(ADD_PICTURE)
  const [calloutJobType, setcalloutJobType] = useState({value: selectedEvent?.extendedProps?.job_type || "Select...", label: selectedEvent?.extendedProps?.job_type || "Select...", id: selectedEvent?.extendedProps?.job_type_id})
  const [calloutJobCategory, setcalloutJobCategory] = useState({value: "Select...", label: "Select..."})
  const [calloutJobTypeOptions, setcalloutJobTypeOptions] = useState(null)
  const [statusOption, setStatusOption] = useState(null)
  //Get All Jobs
  const { loading: jobDataLoading, data: allJobTypes } = useNiceQuery(gql`query JobAll {
    team_expertise {
      id
      value: skill_name
      label: skill_name
      skill_parent_rel {
        value: skill_name
        label: skill_name
        id
      }
    }
  }`, {
    skip: !open
  })
  const jobParent = (allJobTypes?.team_expertise.filter(element => element.value === selectedEvent?.extendedProps?.job_type)[0]) //Get parent value of current job_type  

  const setJobTypes = (id) => {
    console.log(id)
    setcalloutJobTypeOptions(allJobTypes?.team_expertise.filter(element => element?.skill_parent_rel?.id === id))
    setcalloutJobType({value: "Select...", label: "Select...", id: null})
  }
  
  const jobTypeOptions = [
    {value: 'Deferred', label: 'Deferred'},
    {value: 'Material Request', label: 'Material Request'},
    {value: 'Patch Job', label: 'Patch Job'},
    {value: 'Full Job', label: 'Full Job'}
  ]

  const addHours = (date, hours) => {
    return new Date(new Date(date).setHours(new Date(date).getHours() + hours))
 }

 const statusOptions = [
  {value: 'Open', label: 'Open'},
  {value: 'Closed', label: 'Closed'},
  {value: 'In Progress', label: 'In Progress'},
  {value: 'Requested', label: 'Requested'},
  {value: 'Planned', label: 'Planned'}
 ]
 const uploadImage = async (index) => {
   try {
  if (picture1.uploadPicture?.name) await storage.put(`/callout_pics/${picture1.uploadPicture.name}`, picture1.uploadPicture)
  if (picture2.uploadPicture?.name) await storage.put(`/callout_pics/${picture2.uploadPicture.name}`, picture2.uploadPicture)
  if (picture3.uploadPicture?.name) await storage.put(`/callout_pics/${picture3.uploadPicture.name}`, picture3.uploadPicture)
  if (picture4.uploadPicture?.name) await storage.put(`/callout_pics/${picture4.uploadPicture.name}`, picture4.uploadPicture)
  const res = await addCalloutPicture({variables: {
    id: selectedEvent?.extendedProps?.callout_id,
    picture1: picture1.uploadPicture ? `${HASURA}/storage/o/callout_pics/${picture1.uploadPicture.name}` : picture1.picture,
    picture2: picture2.uploadPicture ? `${HASURA}/storage/o/callout_pics/${picture2.uploadPicture.name}` : picture2.picture,
    picture3: picture3.uploadPicture ? `${HASURA}/storage/o/callout_pics/${picture3.uploadPicture.name}` : picture3.picture,
    picture4: picture4.uploadPicture ? `${HASURA}/storage/o/callout_pics/${picture4.uploadPicture.name}` : picture4.picture
  }})
  console.log(res)
  setPicture1({picture:res.data.update_callout_by_pk.picture1, uploadPicture:null })
  setPicture2({picture:res.data.update_callout_by_pk.picture2, uploadPicture:null })
  setPicture3({picture:res.data.update_callout_by_pk.picture3, uploadPicture:null })
  setPicture4({picture:res.data.update_callout_by_pk.picture4, uploadPicture:null })
} catch (e) {
  console.log(e)
}
  
  return toast.success(
    <ToastComponent title="Picture Added" color="success" icon={<Check />} />,
    {
      autoClose: 4000,
      hideProgressBar: false,
      closeButton: false
    }
  )
 }

   // ** Component
   const CalloutPicture = ({picture, index}) => {
     const setPicture = (e, index) => {
      if (index === 0) {
        setPicture1({picture: selectedEvent?.extendedProps?.picture1, uploadPicture: e.target.files[0]})
      } else if (index === 1) {
        setPicture2({picture: selectedEvent?.extendedProps?.picture2, uploadPicture: e.target.files[0]})
      } else if (index === 2) {
        setPicture3({picture: selectedEvent?.extendedProps?.picture3, uploadPicture: e.target.files[0]})
      } else {
        setPicture4({picture: selectedEvent?.extendedProps?.picture4, uploadPicture: e.target.files[0]})
      }
     }
    return <div style={{width: "100px"}}>
     {picture?.picture && picture?.uploadPicture === null ? <a href={picture?.picture } target="_blank">
       <img src={picture?.picture } 
       style={{width: "100%", height: "100px", objectFit: "cover",  borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10}}/>
       </a> : <div><div 
       style={{width: "100px", height: "100px", borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10, display: "flex", justifyContent: "center", alignItems: "center"}}>
         <p style={{fontSize: "12px", fontWeight: "bold", margin: 0}}>NO PICTURE</p>
         </div>{status !== "Closed" && <div>
         <p style={{fontSize: "10px", fontWeight: "bold", marginTop: 5}}>{picture?.uploadPicture?.name}</p>
           <Input type="file" name="file" id="exampleFile" className="mb-1 mt-0" onChange={(e) => { setPicture(e, index); setUploadButton(true) }}/>
         <Button className="mb-1"color='warning' size="sm" onClick={() => uploadImage(index)}>
                  <Upload size={15} />
                    Upload
                </Button></div>}
                </div>}
     </div>
  }

  // ** Custom select components
  const OptionComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <span className={`bullet bullet-${data.color} bullet-sm mr-50`}></span>
        {data.label}
      </components.Option>
    )
  }

  // ** Adds New Event
  const handleAddEvent = () => {
    console.log(calloutJobType)
    requestCalloutApiCall({
      variables: {
        property_id: propertyId,
        email: clientEmail,
        notes: desc,
        time_on_calendar : startPicker.toTimeString().substr(0, 8), 
        date_on_calendar : startPicker.toLocaleDateString(),
        end_date_on_calendar: endPicker.toLocaleDateString(),
        end_time_on_calendar : endPicker.toTimeString().substr(0, 8), 
        // category: value[0].value, 
        category: "Uncategorized", 
        job_type: calloutJobType.value, 
        job_type_id: calloutJobType.id, 
        status: "Open",
        blocked,
        urgency_level: "Medium",
        worker_id: workerId,
        inserted_by: JSON.parse(localStorage.getItem('userData')).user.display_name
        // ...pictures,
      }
    })
      .catch((err) => console.log({ err }))   
    
    refetchEvents()
    handleAddEventSidebar()
    toast.success(<ToastComponent title='Event Added' color='success' icon={<Check />} />, {
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false
    })
  }

  const handleJobAddEvent = () => {
    setJobTickets([...jobTickets, {name: "", description: "", type: "Select...", isSaved: false, newJob: true, worker: {full_name: workerName, id: workerId, email: workerEmail}}])
    
  }

  // ** Reset Input Values on Close
  const handleResetInputValues = () => {
    selectEvent({})
    setContentLoading(true)  
    setAllDay(false)
    setUrl('')
    setLocation('')
    setDesc('')
    setGuests({})
    setcalloutJobType({})
    setcalloutJobCategory({})
    setClientName('')
    setPropertyName('')
    setWorkerName('')
    setWorkerId(null)
    setWorkerEmail('')
    setStartPicker(new Date())
    setJobTickets([])
    setEndPicker(new Date())
    setPicture1(null)
    setPicture2(null)
    setPicture3(null)
    setPicture4(null)
    setStatus(null)
    setStatusChanged(false)
  }

  // ** Set sidebar fields
  const handleSelectedEvent = () => {
    console.log(selectedEvent)
    if (Object.keys(selectedEvent ?? {}).length) {
      setTimeout(() => {
        setContentLoading(false)  
      }, 100)
      const calendar = selectedEvent?.extendedProps?.calendar      
      setWorkerName(selectedEvent?.extendedProps?.workerName)
      setWorkerId(selectedEvent?.extendedProps?.workerId)
      setWorkerEmail(selectedEvent?.extendedProps?.workerEmail)
      setClientName(selectedEvent?.extendedProps?.clientName)
      setClientEmail(selectedEvent?.extendedProps?.clientEmail)
      setPropertyName(selectedEvent?.extendedProps?.propertyName || propertyName)
      setcalloutJobCategory(null)
      setcalloutJobType({value: selectedEvent?.extendedProps?.job_type || "Select...", label: selectedEvent?.extendedProps?.job_type || "Select...", id: selectedEvent?.extendedProps?.job_type_id})
      setAllDay(selectedEvent?.allDay || allDay)
      setUrl(selectedEvent?.url || url)
      setLocation(selectedEvent?.extendedProps?.location || location)
      setDesc(selectedEvent?.extendedProps?.description || desc)
      setGuests(selectedEvent?.extendedProps?.guests || guests)
      setStartPicker(new Date(selectedEvent?.start))
      setEndPicker(new Date(selectedEvent?.end))
      setJobTickets(selectedEvent?.extendedProps?.job_tickets || jobTickets)
      setPicture1({picture: selectedEvent?.extendedProps?.picture1 || picture1, uploadPicture: null})
      setPicture2({picture: selectedEvent?.extendedProps?.picture2 || picture2, uploadPicture: null})
      setPicture3({picture: selectedEvent?.extendedProps?.picture3 || picture3, uploadPicture: null})
      setPicture4({picture: selectedEvent?.extendedProps?.picture4 || picture4, uploadPicture: null})
      setStatus(selectedEvent?.extendedProps?.status || status)
      setBlocked(selectedEvent?.extendedProps?.blocked)
      setStatusChanged(false)
    }
  }

  // ** (UI) updateEventInCalendar
  const updateEventInCalendar = (updatedEventData, propsToUpdate, extendedPropsToUpdate) => {
    const existingEvent = calendarApi.getEventById(updatedEventData.id)

    // ** Set event properties except date related
    // ? Docs: https://fullcalendar.io/docs/Event-setProp
    // ** dateRelatedProps => ['start', 'end', 'allDay']
    // ** eslint-disable-next-line no-plusplus
    for (let index = 0; index < propsToUpdate.length; index++) {
      const propName = propsToUpdate[index]
      existingEvent.setProp(propName, updatedEventData[propName])
    }

    // ** Set date related props
    // ? Docs: https://fullcalendar.io/docs/Event-setDates
    existingEvent.setDates(updatedEventData.start, updatedEventData.end, { allDay: updatedEventData.allDay })

    // ** Set event's extendedProps
    // ? Docs: https://fullcalendar.io/docs/Event-setExtendedProp
    // ** eslint-disable-next-line no-plusplus
    for (let index = 0; index < extendedPropsToUpdate.length; index++) {
      const propName = extendedPropsToUpdate[index]
      existingEvent.setExtendedProp(propName, updatedEventData.extendedProps[propName])
    }
  }

  // ** Updates Event in Store
  const handleUpdateEvent = () => {
    let saved = true
    jobTickets.map(jobs => {
      if (jobs.isSaved === false) {
        saved = false
        toast.error(<ToastComponent title='Job Ticket Not Saved' color='danger' icon={<Info />} />, {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        })
      }
    })
    if (statusChanged) {
      saved = false
    }
    if (saved) {
      const eventToUpdate = {
        id: selectedEvent?.id,
        callout_id: selectedEvent?.extendedProps?.callout_id,
        title: desc,
        startPicker,
        endPicker,
        extendedProps: {
          clientName,
          clientEmail,
          category: 'Uncategorized',
          job_type: calloutJobType.value,
          job_type_id: calloutJobType.id,
          propertyName,
          workerName,
          workerId,
          workerEmail,
          propertyId,
          jobTickets,
          blocked
        }
      }
      const propsToUpdate = ['startPicker', 'endPicker', 'title', 'callout_id']
      const extendedPropsToUpdate = ['clientName', 'category', 'propertyName', 'workerName', 'workerId', 'workerEmail', 'propertyId', 'clientEmail', 'job_type', 'job_type_id', 'jobTickets', 'blocked']
  
      updateEvent(eventToUpdate)
      updateEventInCalendar(eventToUpdate, propsToUpdate, extendedPropsToUpdate)
      handleAddEventSidebar()
      toast.success(<ToastComponent title='Event Updated' color='success' icon={<Check />} />, {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      })
    } else if (statusChanged) {
      console.log("bhai")
      const eventToUpdate = {
        id: selectedEvent?.id,
        callout_id: selectedEvent?.extendedProps?.callout_id,
        status: statusOption.value,
        extendedProps: {
          status: statusChanged
        }
      }
      updateEvent(eventToUpdate)
      handleAddEventSidebar()
    }
  }
  
  const handleJobUpdateEvent = (index) => {
    const jobTicket = jobTickets[index]
    if (selectedEvent?.extendedProps?.callout_id) {
      if (jobTicket?.newJob) {
        addJobTicket({
          variables: {
            name: jobTicket.name,
            description: jobTicket.description,
            type: jobTicket.type,
            callout_id: selectedEvent?.extendedProps?.callout_id,
            scheduler_id: parseInt(selectedEvent?.id),
            worker_id: workerId,
            worker_email: workerEmail,
            client_email: clientEmail
          }
        })
        const jobTicket2 = [...jobTickets]
        jobTicket2[index].isSaved = true
        setJobTickets(jobTicket2)
        toast.success(<ToastComponent title='Job Ticket Saved' color='success' icon={<Check />} />, {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        })
    } else {
   updateJobTicket({variables: {
      id: jobTicket.id,
      name: jobTicket.name,
      worker_id: workerId,
      worker_email: workerEmail,
      type: jobTicket.type,
      description: jobTicket.description,
      client_email: clientEmail
    }})
    toast.success(<ToastComponent title='Job Ticket Updated' color='success' icon={<Check />} />, {
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false
    })
    }
    } else {
      toast.error(<ToastComponent title='Please add schedule first' color='danger' icon={<Trash />} />, {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      })
    }
  }

  const handleWorkChange = (index, full_name, id, email, e) => {
    const jobTicket = [...jobTickets]
    jobTicket[index].worker.full_name = full_name
    jobTicket[index].worker.id = id
    jobTicket[index].worker.email = email
    setJobTickets(jobTicket)
  }

  const handleChange = (index, e) => {
    const jobTicket = [...jobTickets]
    jobTicket[index][e.target.name] = e.target.value
    setJobTickets(jobTicket)
  }
  
  const handleChangeStatus = (id, status) => {
    changeStatus({variables: {
        id,
        status
    }})
  }
  // ** (UI) removeEventInCalendar
  const removeEventInCalendar = eventId => {
    calendarApi.getEventById(eventId).remove()
  }
  const handleDeleteEvent = () => {
    removeEvent(selectedEvent?.id, selectedEvent?.extendedProps?.callout_id)
    removeEventInCalendar(selectedEvent?.id)
    handleAddEventSidebar()
    toast.error(<ToastComponent title='Event Removed' color='danger' icon={<Trash />} />, {
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false
    })
  }

  const handleJobDeleteEvent = (index) => {

    if (!jobTickets[index].isSaved === false || jobTickets[index]?.isSaved === undefined) {
      deleteJobTicket({variables: {
        id: jobTickets[index].id
      }})
    }
    setJobTickets(jobTickets.filter((job, i) => i !== index))
    // handleAddEventSidebar()
    toast.error(<ToastComponent title='Job Ticket Removed' color='danger' icon={<Trash />} />, {
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false
    })
  }

  // ** Event Action buttons
  const EventActions = () => {
    if (!selectedEvent?.title?.length) {
      return (
        <Fragment>
          <Button.Ripple className='mr-1' type='submit' color='primary'>
            Add Callout
          </Button.Ripple>
          <Button.Ripple color='secondary' type='reset' onClick={handleAddEventSidebar} outline>
            Cancel
          </Button.Ripple>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          {status !== "Closed" && 
          <Button.Ripple
            className='mr-1'
            color='primary'
            onClick={handleUpdateEvent}
          >
            Update Callout
          </Button.Ripple>}
          <Button.Ripple color='danger' onClick={handleDeleteEvent} outline>
            Delete Callout
          </Button.Ripple>
        </Fragment>
      )
    }
  }
  const { loading, data, error, refetch } = useNiceQuery(GET_CALLOUT, {
    variables: {
      id: selectedEvent?.callout_id
    },
    skip: !selectedEvent?.callout_id
  })
  
  // ** Close BTN
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleAddEventSidebar} />
  return (
    <Modal
      isOpen={open}
      onOpened={handleSelectedEvent}
      onClosed={handleResetInputValues}
      toggle={handleAddEventSidebar}
      // className='modal-dialog-centered modal-xl'
    >
      <ModalHeader className='mb-1' toggle={handleAddEventSidebar} >
         <h5 className='modal-title'>
           {selectedEvent?.title}
         </h5>
       </ModalHeader>
       {!contentLoading ? <ModalBody className='flex-grow-1 pb-sm-0 pb-3'>
       <Form
          onSubmit={handleSubmit(data => {
            if (isObjEmpty(errors)) {
              if (isObjEmpty(selectedEvent) || (!isObjEmpty(selectedEvent) && !selectedEvent?.title.length)) {
                handleAddEvent()
              } else {
                handleUpdateEvent()
              }
              handleAddEventSidebar()
            }
          })}
        >
          {!!selectedEvent?.title?.length && <div>
             <h4 className="mb-0">Status:</h4>
              {status === "Open" && <Badge color='success' className="mb-1 badge-glow">
                Open
              </Badge>}
              {status === "In Progress" && <Badge color='warning' className="mb-1 badge-glow">
                In Progress
              </Badge>}
               {status === "Requested" && <Badge color='primary' className="mb-1 badge-glow">
                Requested
              </Badge>}
               {status === "Planned" && <Badge color='info' className="mb-1 badge-glow">
                Planned
              </Badge>}
               {status === "Closed" && <Badge color='danger' className="mb-1 badge-glow">
                Closed
              </Badge>}
              <div>
              <Button className="mb-1"color='info' size="sm" onClick={() => setChangeStatusIsOpen(true)}>Force Change Status</Button>  
              </div>
              </div>}
              
             {/* <Select
               id='label'
               defaultValue={ status ? {value: status, label: status} : {value: "Open", label: "Open"}}
               // eslint-disable-next-line eqeqeq
               options={statusOptions}
               theme={selectThemeColors}
               className='react-select'
               classNamePrefix='select'
               isClearable={false}
               onChange={(e) => setStatusOption({value: e.value, label: e.value}) }
               components={{
                 Option: OptionComponent
               }}
             /> */}
           <FormGroup>
             <Label for='desc'>
               Description <span className='text-danger'>*</span>
             </Label>
            <Input
               id='desc'
               name='desc'
               placeholder='Description'
               value={desc}
               onChange={(e) => setDesc(e.target.value)}
               disabled={status === "Closed" && true}
               innerRef={register({ register: true, validate: value => value !== '' })}
               className={classnames({
                 'is-invalid': errors.desc
               })}
             />
           </FormGroup>

           <FormGroup>
             <Label for='label'>Job Category <span className='text-danger'>*</span></Label>
             <Select
               id='label'
               defaultValue={ jobParent ? {value: jobParent?.skill_parent_rel?.value, label: jobParent?.skill_parent_rel?.value, id: jobParent?.id} : calloutJobCategory}
               // eslint-disable-next-line eqeqeq
               options={allJobTypes?.team_expertise.filter(element => element?.skill_parent_rel?.value == null)}
               theme={selectThemeColors}
               isDisabled={status === "Closed" && true}
               className='react-select'
               classNamePrefix='select'
               isClearable={false}
               onChange={(e) => { console.log(e); setcalloutJobCategory({value: e.value, label: e.value, id: e.id}); setJobTypes(e.id) }}
               components={{
                 Option: OptionComponent
               }}
             />
           </FormGroup>

           <FormGroup>
             <Label for='label'>Job Type <span className='text-danger'>*</span></Label>
             <Select
               id='label'
               defaultValue={calloutJobType}
               // eslint-disable-next-line eqeqeq
               options={calloutJobTypeOptions ?? allJobTypes?.team_expertise.filter(element => element?.skill_parent_rel?.value == jobParent?.skill_parent_rel?.value)}
               theme={selectThemeColors}
               isDisabled={status === "Closed" && true}
               className='react-select'
               classNamePrefix='select'
               isClearable={false}
               onChange={(e) => setcalloutJobType({value: e.value, label: e.value, id: e.id})}
               components={{
                 Option: OptionComponent
               }}
             />
           </FormGroup>


           <FormGroup>
           <Label for='label'>Client Name <span className='text-danger'>*</span></Label>
           {status === "Closed" ?    <Input
               id='clientName'
               name='clientName'
               placeholder='clientName'
               value={clientName}
               disabled
             /> : allClients?.client && !clientLoading ? (
           <AutoComplete
           suggestions={allClients.client}
           className='form-control'
           filterKey='full_name'
           placeholder="Search client name"
           value={clientName}
           disabled={status === "Closed" && true}
           customRender={(
            suggestion,
            i,
            filteredData,
            activeSuggestion,
            onSuggestionItemClick,
            onSuggestionItemHover
          ) => (
            <li
              className={classnames('suggestion-item', {
                active: filteredData.indexOf(suggestion) === activeSuggestion
              })}
              key={i}
              onMouseEnter={() => onSuggestionItemHover(filteredData.indexOf(suggestion))
              }
              onClick={e => {
                onSuggestionItemClick(null, e)
                setClientName(suggestion.full_name)
                setClientEmail(suggestion.email)
                setClientId(suggestion.id)
                getProperty()
                
              }}
            >
            <span>{suggestion.full_name}{'     '}</span>
               
               <Badge color='light-secondary'>
                {suggestion.email}
                </Badge>
            </li>
          )}
         />
          ) : <Input type='text' disabled placeholder='Client Name' />}
        </FormGroup>


        <FormGroup>
           <Label for='label'>Property Name <span className='text-danger'>*</span></Label>
           {status === "Closed" ?    <Input
               id='propertyName'
               name='propertyName'
               placeholder='Property Name'
               value={propertyName}
               disabled
             /> :  allProperty?.property_owned && !propertyLoading ? (
           <AutoComplete
           suggestions={allProperty.property_owned.map(a => a.property)}
           className='form-control'
           filterKey='address'
           value={propertyName}
           defaultSuggestions={true}
           placeholder="Search Property Name"
           customRender={(
             suggestion,
             i,
             filteredData,
             activeSuggestion,
             onSuggestionItemClick,
             onSuggestionItemHover
           ) => (
             <li
               className={classnames('suggestion-item', {
                 active: filteredData.indexOf(suggestion) === activeSuggestion
               })}
               key={i}
               onMouseEnter={() => onSuggestionItemHover(filteredData.indexOf(suggestion))
               }
               onClick={e => {
                onSuggestionItemClick(null, e)
                setPropertyName(suggestion.address)
                setPropertyId(suggestion.id)
               }}
             >
               <span>{suggestion.address}</span>
             </li>
           )}
         />
          ) : <Input type='text' disabled placeholder='Property Name' value={propertyName} />}
        </FormGroup>

        <FormGroup>
           <Label for='label'>Worker Name <span className='text-danger'>*</span></Label>
           {status === "Closed" ?    <Input
               id='propertyName'
               name='propertyName'
               placeholder='Property Name'
               value={workerName}
               disabled
             /> : allWorkers?.worker && !workerLoading ? (
           <AutoComplete
           suggestions={allWorkers.worker}
           className='form-control'
           filterKey='full_name'
           placeholder="Search Worker Name"
           value={workerName}
           customRender={(
            suggestion,
            i,
            filteredData,
            activeSuggestion,
            onSuggestionItemClick,
            onSuggestionItemHover
          ) => (
            <li
              className={classnames('suggestion-item', {
                active: filteredData.indexOf(suggestion) === activeSuggestion
              })}
              key={i}
              onMouseEnter={() => onSuggestionItemHover(filteredData.indexOf(suggestion))
              }
              onClick={e => {
                onSuggestionItemClick(null, e)
                setWorkerName(suggestion.full_name)
                setWorkerId(suggestion.id)       
                setWorkerEmail(suggestion.email)    
              }}
            >
            <span>{suggestion.full_name}{'     '}</span>
               
               {/* <Badge color='light-secondary'>
                {suggestion.email}
                </Badge> */}
            </li>
          )}
         />
          ) : <Input type='text' id='disabledInput' disabled placeholder='Worker Name' />}
        </FormGroup>

           <FormGroup>
             <Fragment>
             <Label for='startDate'>Start Date <span className='text-danger'>*</span></Label>
             <Flatpickr
               required={status === "Closed" && true}
               id='startDate'
               //tag={Flatpickr}
               name='startDate'
               disabled={status === "Closed" && true}
               style={{backgroundColor: status === "Closed" && '#efefef'}}
               //  data-enable-time
               className='form-control'
               onChange={date => { setStartPicker(date[0]); setEndPicker(addHours(date[0], 2)); console.log(date[0]) }}
               value={startPicker}
               options={{
                enableTime: true,
                dateFormat: 'Y-m-d H:i',
                time_24hr: false
               }}
             />
             </Fragment>
           </FormGroup>
           <FormGroup>
             <Label for='endDate'>End Date</Label>
             <Flatpickr
             style={{backgroundColor: status === "Closed" && '#efefef'}}
              //  required
               id='endDate'
                //tag={Flatpickr}
               name='endDate'
               className='form-control'
              //  onChange={date => setEndPicker(date[0])}
              disabled={status === "Closed" && true}
               value={endPicker}
               options={{
                 enableTime: true,
                 dateFormat: 'Y-m-d H:i'
               }}
             />
           </FormGroup>
           {status !== "Closed" &&  <FormGroup>
           <CustomInput inline className='custom-control-Primary' type='checkbox' id='blocked'  onChange={() => setBlocked(!blocked)} label='Should we block this slot from any booking?' checked={blocked} />
             {/* <Input type='checkbox' id='blocked' onChange={() => setBlocked(!blocked)} checked={blocked} /> */}
             {/* <Label for='blocked'>Should we block this slot from any booking?</Label> */}
           </FormGroup>}
          
           {!!selectedEvent?.title?.length && <FormGroup style={{display: "flex", justifyContent: "space-between"}}>
             {[picture1, picture2, picture3, picture4].map((picture, i) => (
              <CalloutPicture key={i} picture={picture} index={i} />
             ))}
           </FormGroup>}
           
               {jobTickets && jobTickets.map((job, index) => (
                <Card className='card-payment' key={index} >
      <CardHeader>
        <CardTitle tag='h4'>{job.name}</CardTitle>
      </CardHeader>
      <CardBody>
          <Row>
          <Col sm='12'>
              <FormGroup className='mb-2'>
                <Label for='job-name'>Job Name</Label>
                <Input type="input" placeholder='Job Name' id='job-name' name="name" value={job.name} onChange={(e) => handleChange(index, e)}/>
              </FormGroup>
            </Col>
            
            <Col sm='12'>
              <FormGroup className='mb-2'>
                <Label for='jobtype'>Job Type</Label>
                <Select
               id='jobtype'
               defaultValue={{value:job?.type, label: job?.type}}
               options={jobTypeOptions}
               theme={selectThemeColors}
               className='react-select'
               classNamePrefix='select'
               isClearable={false}
               onChange={(e) => { const jobTicket = [...jobTickets]; jobTicket[index].type = e.value; setJobTickets(jobTicket) }}
               components={{
                 Option: OptionComponent
               }}
             />
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup className='mb-2'>
                <Label for='job-description'>Job Description Name</Label>
                <Input type="text-area" placeholder='Curtis Stone' id='job-description' name="description" value={job.description} onChange={(e) => { const jobTicket = [...jobTickets]; jobTicket[index][e.target.name] = e.target.value; setJobTickets(jobTicket) }}/>
              </FormGroup>
            </Col>
            <Col sm='12'>
            <FormGroup className='d-flex justify-content-center'>
            <Fragment>
          <Button.Ripple
            className='mr-1'
            color='primary'
            onClick={() => handleJobUpdateEvent(index)}
          >
            {job?.newJob ? 'Save Ticket' : 'Update Ticket'}
          </Button.Ripple>
          <Button.Ripple color='danger' onClick={() => handleJobDeleteEvent(index)} outline>
            Delete Ticket
          </Button.Ripple>
        </Fragment>
            </FormGroup>
            </Col>
          </Row>
      </CardBody>
    </Card>
               ))}
               {status !== "Closed" && 
           <FormGroup>
           <Button.Ripple
               className='mr-1'
               color='info'
               onClick={handleJobAddEvent}
             >
               Add New Job Ticket
             </Button.Ripple>
           </FormGroup>}
           {/* <FormGroup>
             <Label for='endDate'>End Date</Label>
             <Flatpickr
               required
               id='endDate'
               // tag={Flatpickr}
               name='endDate'
               className='form-control'
               onChange={date => setEndPicker(date[0])}
               value={endPicker}
               options={{
                 enableTime: allDay === false,
                 dateFormat: 'Y-m-d H:i'
               }}
             />
           </FormGroup> */}
           {selectedEvent?.extendedProps?.videoUrl && <video width="458" controls src={selectedEvent?.extendedProps?.videoUrl} />}
           <FormGroup className='d-flex'>
            <EventActions />
          </FormGroup>
           </Form>
       </ModalBody> : <div style={{height: 300}}></div> }
       <Modal  
       isOpen={changeStatusIsOpen}
       onClosed={handleResetInputValues}
      className='modal-dialog-centered modal-sm'>
         <ModalHeader className='mb-0' toggle={handleAddEventSidebar} >
         <h5 className='modal-title'>
           Change Status
         </h5>
       </ModalHeader>
       <ModalBody className='flex-grow-1 pb-sm-0 pb-3'>
         <FormGroup>
           <Label for="label">Status: </Label>
           <Select
               id='label'
               defaultValue={ status ? {value: status, label: status} : {value: "Open", label: "Open"}}
               // eslint-disable-next-line eqeqeq
               options={statusOptions}
               theme={selectThemeColors}
               className='react-select'
               classNamePrefix='select'
               isClearable={false}
               onChange={(e) => setStatusOption({value: e.value, label: e.value}) }
               components={{
                 Option: OptionComponent
               }}
             />
         </FormGroup>
       </ModalBody>
       <ModalFooter>
       <FormGroup className='d-flex justify-content-center'>
            <Fragment>
          <Button.Ripple
            className='mr-1'
            color='primary'
            onClick={() => { handleChangeStatus(selectedEvent?.extendedProps?.callout_id, statusOption.value) }}
          >
            Save
          </Button.Ripple>
          <Button.Ripple color='danger' onClick={() => { setChangeStatusIsOpen(false); handleUpdateEvent() }} outline>
          {statusChanged ? "Close" : "Cancel"}
          </Button.Ripple>
        </Fragment>
            </FormGroup>
       </ModalFooter>
      </Modal>
    </Modal>
  )
}

export default AddEventSidebar
