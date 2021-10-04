// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Cleave from 'cleave.js/react'
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client"

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import classnames from 'classnames'
import { toast } from 'react-toastify'
import Flatpickr from 'react-flatpickr'
import { X, Check, Trash, Info, Upload } from 'react-feather'
import Select, { components } from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { Media, Button, Modal, ModalHeader, ModalBody, Card, ListGroup, ListGroupItem, FormGroup, Label, CustomInput, Input, Form, Spinner, Badge, CardBody, CardHeader, CardTitle, Row, Col  } from 'reactstrap'
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
  client {
    full_name
    email
    id
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

  // const selectedEvent = store.selectedEvent
  const { register, errors, handleSubmit } = useForm()

  // ** States
  const [contentLoading, setContentLoading] = useState(true)

  const [url, setUrl] = useState(selectedEvent.url || '')
  const [desc, setDesc] = useState(selectedEvent.extendedProps?.description || '')
  const [guests, setGuests] = useState(selectedEvent.extendedProps?.guests || '')
  const [allDay, setAllDay] = useState(selectedEvent.allDay || false)
  const [location, setLocation] = useState(selectedEvent.extendedProps?.location || '')
  const [startPicker, setStartPicker] = useState(new Date(selectedEvent.start) || '')
  const [endPicker, setEndPicker] = useState(new Date(selectedEvent.end) || '')
  const [clientName, setClientName] = useState(selectedEvent.extendedProps?.clientName || '')
  const [clientEmail, setClientEmail] = useState(selectedEvent.extendedProps?.clientEmail || 'No client')
  const [clientId, setClientId] = useState(selectedEvent.extendedProps?.clientId)
  const [propertyName, setPropertyName] = useState(selectedEvent.extendedProps?.propertyName  || '')
  const [propertyId, setPropertyId] = useState(selectedEvent.extendedProps?.propertyId  || 9999)
  const [workerName, setWorkerName] = useState(selectedEvent.extendedProps?.workerName || '')
  const [workerId, setWorkerId] = useState(selectedEvent.extendedProps?.workerId)
  const [blocked, setBlocked] = useState(selectedEvent.extendedProps?.blocked)
  const [workerEmail, setWorkerEmail] = useState(selectedEvent.extendedProps?.workerEmail)
  const [jobTickets, setJobTickets] = useState([])
  const [picture1, setPicture1] = useState(selectedEvent.extendedProps?.picture1)
  const [picture2, setPicture2] = useState(selectedEvent.extendedProps?.picture2)
  const [picture3, setPicture3] = useState(selectedEvent.extendedProps?.picture3)
  const [picture4, setPicture4] = useState(selectedEvent.extendedProps?.picture4)

  const [uploadPicture1, setUploadPicture1] = useState(null)
  const [uploadPicture2, setUploadPicture2] = useState(null)
  const [uploadPicture3, setUploadPicture3] = useState(null)
  const [uploadPicture4, setUploadPicture4] = useState(null)
  
  const [image, setImage] = useState(null)
  const [uploadButton, setUploadButton] = useState(false)

  const [calloutJobType, setcalloutJobType] = useState({value: selectedEvent.extendedProps?.job_type || "Select...", label: selectedEvent.extendedProps?.job_type || "Select..."})
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

  const [addJobTicket] = useNiceMutation(ADD_JOB_TICKET)
  const [deleteJobTicket] = useNiceMutation(DELETE_JOB_TICKET)

  const [updateJobTicket] = useNiceMutation(UPDATE_JOB_TICKET)

  const [addCalloutPicture] = useNiceMutation(ADD_PICTURE)
  const [calloutJobCategory, setcalloutJobCategory] = useState({})
  
  //Get id for job_type
  const { data: allJobTypes } = useNiceQuery(gql`query JobAll($skill_name: String!) {
    team_expertise(where: {skill_name: {_eq: $skill_name}}) {
      label: skill_name
      id: skill_parent
    }
  }
  `, {
    skip: !open,
    variables: {skill_name: selectedEvent?.extendedProps?.job_type ?? "Doors/Windows"}
  })

  const [getJobTypes, { jobTypeLoading, data: calloutJobTypeOptions, error: jobTypeError }] = useNiceLazyQuery(gql`query JobTypes($id: Int!) {
    team_expertise(where: {skill_parent: {_eq: $id}}) {
      label: skill_name
      value: skill_name
      id
    }
  }  
  `, {
    skip: !open,
    variables: {id: calloutJobCategory?.id}
  })

  //Get parent job category for the selected job_type 
  const { jobCategoryLoading, data: calloutJobCategoryOptions, error: jobCategoryError } = useNiceQuery(gql`query JobCategory {
    team_expertise(where: {skill_parent: {_is_null: true}}) {
      label: skill_name
      value: skill_name
      id
    }
  }`, {
    skip: !open,
    onCompleted: (data) => {
      console.log(data)
      const jobParent = (data?.team_expertise.filter(value => value.id === allJobTypes?.team_expertise[0]?.id)[0])
      setcalloutJobCategory({value: jobParent?.value, label: jobParent?.label, id: jobParent?.id })
      getJobTypes()
    }
  })
  
  const jobTypeOptions = [
    {value: 'Deferred', label: 'Deferred'},
    {value: 'Material Request', label: 'Material Request'},
    {value: 'Patch Job', label: 'Patch Job'},
    {value: 'Full Job', label: 'Full Job'}
  ]

  const addHours = (date, hours) => {
    return new Date(new Date(date).setHours(new Date(date).getHours() + hours))
 }

 const uploadImage = async (index) => {
   try {
  //    console.log(uploadPicture1, index)
  // console.log(uploadPicture2, index)
  // console.log(uploadPicture3, index)
  // console.log(uploadPicture4, index)
  if (uploadPicture1?.name) await storage.put(`/callout_pics/${uploadPicture1.name}`, uploadPicture1)
  if (uploadPicture2?.name) await storage.put(`/callout_pics/${uploadPicture2.name}`, uploadPicture2)
  if (uploadPicture3?.name) await storage.put(`/callout_pics/${uploadPicture3.name}`, uploadPicture3)
  if (uploadPicture4?.name) await storage.put(`/callout_pics/${uploadPicture4.name}`, uploadPicture4)
  const res = await addCalloutPicture({variables: {
    id: selectedEvent?.extendedProps?.callout_id,
    picture1: uploadPicture1 ? `${HASURA}/storage/o/callout_pics/${uploadPicture1.name}` : picture1,
    picture2: uploadPicture2 ? `${HASURA}/storage/o/callout_pics/${uploadPicture2.name}` : picture2,
    picture3: uploadPicture3 ? `${HASURA}/storage/o/callout_pics/${uploadPicture3.name}` : picture3,
    picture4: uploadPicture4 ? `${HASURA}/storage/o/callout_pics/${uploadPicture4.name}` : picture4
  }})
  console.log(res)
  setPicture1(res.data.update_callout_by_pk.picture1)
  setPicture2(res.data.update_callout_by_pk.picture2)
  setPicture3(res.data.update_callout_by_pk.picture3)
  setPicture4(res.data.update_callout_by_pk.picture4)
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
        setUploadPicture1(e.target.files[0])
      } else if (index === 1) {
        setUploadPicture2(e.target.files[0])
      } else if (index === 2) {
        setUploadPicture3(e.target.files[0])
      } else {
        setUploadPicture4(e.target.files[0])
      }
     }
    return <div style={{width: "100px"}}>
     {picture ? <a href={picture} target="_blank">
       <img src={picture} 
       style={{width: "100%", height: "100px", objectFit: "cover",  borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10}}/>
       </a> : <div><div 
       style={{width: "100px", height: "100px", borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10, display: "flex", justifyContent: "center", alignItems: "center"}}>
         <p style={{fontSize: "12px", fontWeight: "bold", margin: 0}}>NO PICTURE </p>
         </div>{selectedEvent.extendedProps.status !== "Closed" && <div><Input type="file" name="file" id="exampleFile" className="mb-1 mt-1" onChange={(e) => { setPicture(e, index); setUploadButton(true) }}/>
         <Button className="mb-1"color='warning' size="sm" onClick={() => uploadImage(index)}>
                  <Upload size={15} />
                    Upload
                </Button></div>}</div>}
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
  }

  // ** Set sidebar fields
  const handleSelectedEvent = () => {
    console.log(selectedEvent)
    if (Object.keys(selectedEvent ?? {}).length) {
      setTimeout(() => {
        setContentLoading(false)  
      }, 100)
      const calendar = selectedEvent?.extendedProps?.calendar      
      setWorkerName(selectedEvent.extendedProps.workerName)
      setWorkerId(selectedEvent.extendedProps.workerId)
      setWorkerEmail(selectedEvent.extendedProps.workerEmail)
      setClientName(selectedEvent.extendedProps.clientName)
      setClientEmail(selectedEvent.extendedProps.clientEmail)
      setPropertyName(selectedEvent.extendedProps.propertyName || propertyName)
      setcalloutJobType({value: selectedEvent.extendedProps?.job_type || "Select...", label: selectedEvent.extendedProps?.job_type || "Select..."})
      setAllDay(selectedEvent.allDay || allDay)
      setUrl(selectedEvent.url || url)
      setLocation(selectedEvent.extendedProps.location || location)
      setDesc(selectedEvent.extendedProps.description || desc)
      setGuests(selectedEvent.extendedProps.guests || guests)
      setStartPicker(new Date(selectedEvent.start))
      setEndPicker(new Date(selectedEvent.end))
      setJobTickets(selectedEvent.extendedProps?.job_tickets || jobTickets)
      setPicture1(selectedEvent.extendedProps?.picture1 || picture1)
      setPicture2(selectedEvent.extendedProps?.picture2 || picture2)
      setPicture3(selectedEvent.extendedProps?.picture3 || picture3)
      setPicture4(selectedEvent.extendedProps?.picture4 || picture4)
      setBlocked(selectedEvent.extendedProps?.blocked)
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
    
    if (saved) {
      const eventToUpdate = {
        id: selectedEvent.id,
        callout_id: selectedEvent?.extendedProps?.callout_id,
        title: desc,
        startPicker,
        endPicker,
        extendedProps: {
          clientName,
          clientEmail,
          category: 'Uncategorized',
          job_type: calloutJobType.value,
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
      const extendedPropsToUpdate = ['clientName', 'category', 'propertyName', 'workerName', 'workerId', 'workerEmail', 'propertyId', 'clientEmail', 'job_type', 'jobTickets', 'blocked']
  
      updateEvent(eventToUpdate)
      updateEventInCalendar(eventToUpdate, propsToUpdate, extendedPropsToUpdate)
      handleAddEventSidebar()
      toast.success(<ToastComponent title='Event Updated' color='success' icon={<Check />} />, {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      })
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
            scheduler_id: parseInt(selectedEvent.id),
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
  
  // ** (UI) removeEventInCalendar
  const removeEventInCalendar = eventId => {
    calendarApi.getEventById(eventId).remove()
  }
  const handleDeleteEvent = () => {
    removeEvent(selectedEvent.id, selectedEvent?.extendedProps?.callout_id)
    removeEventInCalendar(selectedEvent.id)
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
          {selectedEvent?.extendedProps?.status !== "Closed" && 
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
              if (isObjEmpty(selectedEvent) || (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)) {
                handleAddEvent()
              } else {
                handleUpdateEvent()
              }
              handleAddEventSidebar()
            }
          })}
        >
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
               disabled={selectedEvent?.extendedProps?.status === "Closed" && true}
             />
           </FormGroup>

           <FormGroup>
             <Label for='label'>Job Category</Label>
             <Select
               id='label'
               defaultValue={{value:calloutJobCategory.value, label:calloutJobCategory.label}}
               options={calloutJobCategoryOptions?.team_expertise ?? []}
               theme={selectThemeColors}
               isDisabled={selectedEvent?.extendedProps?.status === "Closed" && true}
               className='react-select'
               classNamePrefix='select'
               isClearable={false}
               onChange={(e) => { setcalloutJobCategory({value: e.value, label: e.value, id: e.id}); getJobTypes(); setcalloutJobType({}) }}
               components={{
                 Option: OptionComponent
               }}
             />
           </FormGroup>

           <FormGroup>
             <Label for='label'>Job Type</Label>
             <Select
               id='label'
               defaultValue={{value:calloutJobType.value, label:calloutJobType.label}}
               options={calloutJobTypeOptions?.team_expertise ?? []}
               theme={selectThemeColors}
               isDisabled={selectedEvent?.extendedProps?.status === "Closed" && true}
               className='react-select'
               classNamePrefix='select'
               isClearable={false}
               onChange={(e) => setcalloutJobType({value: e.value, label: e.value})}
               components={{
                 Option: OptionComponent
               }}
             />
           </FormGroup>


           <FormGroup>
           <Label for='label'>Client Name</Label>
           {selectedEvent?.extendedProps?.status === "Closed" ?    <Input
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
           disabled={selectedEvent?.extendedProps?.status === "Closed" && true}
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
           <Label for='label'>Property Name</Label>
           {selectedEvent?.extendedProps?.status === "Closed" ?    <Input
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
           <Label for='label'>Worker Name</Label>
           {selectedEvent?.extendedProps?.status === "Closed" ?    <Input
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
             <Label for='startDate'>Start Date</Label>
             <Flatpickr
               required={selectedEvent?.extendedProps?.status === "Closed" && true}
               id='startDate'
               //tag={Flatpickr}
               name='startDate'
               disabled={selectedEvent?.extendedProps?.status === "Closed" && true}
               style={{backgroundColor: selectedEvent?.extendedProps?.status === "Closed" && '#efefef'}}
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
             style={{backgroundColor: selectedEvent?.extendedProps?.status === "Closed" && '#efefef'}}
              //  required
               id='endDate'
                //tag={Flatpickr}
               name='endDate'
               className='form-control'
              //  onChange={date => setEndPicker(date[0])}
              disabled={selectedEvent?.extendedProps?.status === "Closed" && true}
               value={endPicker}
               options={{
                 enableTime: true,
                 dateFormat: 'Y-m-d H:i'
               }}
             />
           </FormGroup>
           {selectedEvent?.extendedProps?.status !== "Closed" &&  <FormGroup>
           <CustomInput inline className='custom-control-Primary' type='checkbox' id='blocked'  onChange={() => setBlocked(!blocked)} label='Should we block this slot from any booking?' checked={blocked} />
             {/* <Input type='checkbox' id='blocked' onChange={() => setBlocked(!blocked)} checked={blocked} /> */}
             {/* <Label for='blocked'>Should we block this slot from any booking?</Label> */}
           </FormGroup>}
          
           <FormGroup style={{display: "flex", justifyContent: "space-between"}}>
             {[picture1, picture2, picture3, picture4].map((picture, i) => (
              <CalloutPicture key={i} picture={picture} index={i} />
             ))}
           </FormGroup>
           
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
               {selectedEvent?.extendedProps?.status !== "Closed" && 
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
    </Modal>
  )
}

export default AddEventSidebar
