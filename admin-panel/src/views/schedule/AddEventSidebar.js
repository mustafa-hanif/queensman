// ** React Imports
import { Fragment, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Cleave from 'cleave.js/react'
import { gql, useLazyQuery, useQuery } from "@apollo/client"

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import classnames from 'classnames'
import { toast } from 'react-toastify'
import Flatpickr from 'react-flatpickr'
import { X, Check, Trash } from 'react-feather'
import Select, { components } from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { Button, Modal, ModalHeader, ModalBody, Card, ListGroup, ListGroupItem, FormGroup, Label, CustomInput, Input, Form, Spinner, Badge, CardBody, CardHeader, CardTitle, Row, Col  } from 'reactstrap'
import AutoComplete from '@components/autocomplete'

// ** Utils
import { selectThemeColors, isObjEmpty } from '@utils'

// ** Avatar Images
import img1 from '@src/assets/images/avatars/1-small.png'
import img2 from '@src/assets/images/avatars/3-small.png'
import img3 from '@src/assets/images/avatars/5-small.png'
import img4 from '@src/assets/images/avatars/7-small.png'
import img5 from '@src/assets/images/avatars/9-small.png'
import img6 from '@src/assets/images/avatars/11-small.png'

// ** Styles Imports
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'

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

const params = {
  slidesPerView: 5,
  spaceBetween: 50,
  pagination: {
    clickable: true
  },
  breakpoints: {
    1024: {
      slidesPerView: 4,
      spaceBetween: 40
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 30
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    320: {
      slidesPerView: 1,
      spaceBetween: 10
    }
  }
}

const AddEventSidebar = props => {
  // ** Props
  const {
    open,
    handleAddEventSidebar,
    calendarsColor,
    calendarApi,
    refetchEvents,
    addEvent,
    requestCalloutApiCall,
    selectEvent,
    selectedEvent,
    updateEvent,
    removeEvent
  } = props

  // ** Vars
  // const selectedEvent = store.selectedEvent
  const { register, errors, handleSubmit } = useForm()

  // ** States
  const [contentLoading, setContentLoading] = useState(true)

  const [url, setUrl] = useState(selectedEvent.url || '')
  const [desc, setDesc] = useState(selectedEvent.extendedProps?.description || '')
  const [title, setTitle] = useState(selectedEvent.title || false)
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
  const [jobTickets, setJobTickets] = useState([])

  // const [workerId, setWorkerId] = useState(1)
  const [value, setValue] = useState([{value: selectedEvent.category}] || [{ value: 'Water Leakage', label: 'Water Leakage', color: 'primary' }])
  const { clientLoading, data: allClients, clientError } = useQuery(GET_CLIENT, {
    skip: !open
  })
  const [getProperty, { propertyLoading, data: allProperty, propertyError }] = useLazyQuery(GET_PROPERTY, {
    variables: { ownerId:clientId }
  })
  const { workerLoading, data: allWorkers, workerError } = useQuery(GET_WORKER, {
    skip: !open
  })
  // ** Select Options
  const options = [
    {value:"Water Leakage", label: "Water Leakage", color: 'primary'},
    {value:"Pumps problem (pressure low)", label: "Pumps problem (pressure low)", color: 'primary'},
    {value:"Drains blockage- WCs", label: "Drains blockage- WCs", color: 'primary'},
    {value:"Drains Blockage – Sinks, floor traps", label: "Drains Blockage – Sinks, floor traps", color: 'primary'},
    {value:"AC Services Request", label: "AC Services Request", color: 'primary'},
    {value:"AC not cooling", label: "AC not cooling", color: 'primary'},
    {value:"AC Thermostat not functioning", label: "AC Thermostat not functioning", color: 'primary'}
  ]
  
  const jobTypeOptions = [
    {value:"Water Leakage", label: "Water Leakage", color: 'primary'},
    {value:"Pumps problem (pressure low)", label: "Pumps problem (pressure low)", color: 'primary'}
  ]
  
  const guestsOptions = [
    { value: 'Donna Frank', label: 'Donna Frank', avatar: img1 },
    { value: 'Jane Foster', label: 'Jane Foster', avatar: img2 },
    { value: 'Gabrielle Robertson', label: 'Gabrielle Robertson', avatar: img3 },
    { value: 'Lori Spears', label: 'Lori Spears', avatar: img4 },
    { value: 'Sandy Vega', label: 'Sandy Vega', avatar: img5 },
    { value: 'Cheryl May', label: 'Cheryl May', avatar: img6 }
  ]

  // ** Custom select components
  const OptionComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <span className={`bullet bullet-${data.color} bullet-sm mr-50`}></span>
        {data.label}
      </components.Option>
    )
  }

  const GuestsComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <div className='d-flex flex-wrap align-items-center'>
          <Avatar className='my-0 mr-1' size='sm' img={data.avatar} />
          <div>{data.label}</div>
        </div>
      </components.Option>
    )
  }

  // ** Adds New Event
  const handleAddEvent = () => {
    requestCalloutApiCall({
      variables: {
        property_id: propertyId,
        email: clientEmail,
        notes: title,
        time_on_calendar : startPicker.toTimeString().substr(0, 8), 
        date_on_calendar : startPicker.toISOString().substring(0, 10),
        end_date_on_calendar: endPicker.toISOString().substring(0, 10),
        end_time_on_calendar : endPicker.toTimeString().substr(0, 8), 
        // category: value[0].value, 
        category: "Uncategorized", 
        job_type: value[0].value, 
        status: "Requested",
        request_time: new Date().toLocaleDateString(),
        urgency_level: "Medium"
        // ...pictures,
      }
    })
      .catch((err) => console.log({ err }))
      console.log({
        property_id: propertyId,
        email: clientEmail,
        notes: title,
        time_on_calendar : startPicker.toTimeString().substr(0, 8), 
        date_on_calendar : startPicker.toISOString().substring(0, 10),
        end_date_on_calendar: endPicker.toISOString().substring(0, 10),
        end_time_on_calendar : endPicker.toTimeString().substr(0, 8), 
        // category: value[0].value, 
        category: "Uncategorized", 
        job_type: value[0].value, 
        status: "Requested",
        request_time: new Date().toLocaleDateString(),
        urgency_level: "Medium"
        // ...pictures,
      })
    refetchEvents()
    handleAddEventSidebar()
    toast.success(<ToastComponent title='Event Added' color='success' icon={<Check />} />, {
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false
    })
  }

  const handleJobAddEvent = () => {
    setJobTickets([...jobTickets, {name: "", description: "", notes: [""], pictures: [""], type: "", worker_email: null}])
  }

  // ** Reset Input Values on Close
  const handleResetInputValues = () => {
    selectEvent({})
    setContentLoading(true)  
    setTitle('')
    setAllDay(false)
    setUrl('')
    setLocation('')
    setDesc('')
    setGuests({})
    setValue([{ value: 'Water Leakage', label: 'Water Leakage', color: 'primary' }])
    setClientName('')
    setPropertyName('')
    setWorkerName('')
    setStartPicker(new Date())
    setJobTickets([])
    setEndPicker(new Date())
  }

  // ** Set sidebar fields
  const handleSelectedEvent = () => {
  
  // console.log(allClients)
  // console.log(allProperty?.property_owned.map(a => a.property))
    console.log(selectedEvent)
    if (Object.keys(selectedEvent ?? {}).length) {
      setTimeout(() => {
        setContentLoading(false)  
      }, 100)
      const calendar = selectedEvent?.extendedProps?.calendar

      const resolveLabel = () => {
        if (calendar?.length) {
          return { label: calendar, value: calendar, color: calendarsColor[calendar] }
        } else {
          return { value: 'Water Leakage', label: 'Water Leakage', color: 'primary' }
        }
      }
      setTitle(selectedEvent.title.split('by')[0])
      setWorkerName(selectedEvent.extendedProps.workerName)
      setClientName(selectedEvent.extendedProps.clientName)
      setClientEmail(selectedEvent.extendedProps.clientEmail)
      setPropertyName(selectedEvent.extendedProps.propertyName || propertyName)
      setValue([selectedEvent.category])
      setAllDay(selectedEvent.allDay || allDay)
      setUrl(selectedEvent.url || url)
      setLocation(selectedEvent.extendedProps.location || location)
      setDesc(selectedEvent.extendedProps.description || desc)
      setGuests(selectedEvent.extendedProps.guests || guests)
      setStartPicker(new Date(selectedEvent.start))
      setEndPicker(new Date(selectedEvent.end))
      setJobTickets(selectedEvent.extendedProps?.job_tickets || jobTickets)
      setValue([resolveLabel()])
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
    const eventToUpdate = {
      id: selectedEvent.id,
      callout_id: selectedEvent?.extendedProps?.callout_id,
      title: title.split('by')[0],
      start: startPicker,
      end: endPicker,
      extendedProps: {
        clientName,
        clientEmail,
        category: 'Uncategorized',
        propertyName,
        workerName,
        propertyId
      }
    }
    const propsToUpdate = ['start', 'title', 'callout_id']
    const extendedPropsToUpdate = ['clientName', 'category', 'propertyName', 'workerName', 'propertyId', 'clientEmail']

    updateEvent(eventToUpdate)
    updateEventInCalendar(eventToUpdate, propsToUpdate, extendedPropsToUpdate)
    handleAddEventSidebar()
    toast.success(<ToastComponent title='Event Updated' color='success' icon={<Check />} />, {
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false
    })
  }
  
  const handleJobUpdateEvent = (id) => {

  }

  const handleWorkChange = (index, full_name, id, e) => {
    const jobTicket = [...jobTickets]
    jobTicket[index].worker.full_name = full_name
    jobTicket[index].worker.id = id
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
    // removeEvent(selectedEvent.id, selectedEvent?.extendedProps?.callout_id)
    // removeEventInCalendar(selectedEvent.id)
    // jobTickets.splice(index - 1, 1);
    console.log(jobTickets.filter((job, i) => i !== index))
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
            Add
          </Button.Ripple>
          <Button.Ripple color='secondary' type='reset' onClick={handleAddEventSidebar} outline>
            Cancel
          </Button.Ripple>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Button.Ripple
            className='mr-1'
            color='primary'
            onClick={handleUpdateEvent}
          >
            Update
          </Button.Ripple>
          <Button.Ripple color='danger' onClick={handleDeleteEvent} outline>
            Delete
          </Button.Ripple>
        </Fragment>
      )
    }
  }
  const { loading, data, error, refetch } = useQuery(GET_CALLOUT, {
    variables: {
      id: selectedEvent?.callout_id
    },
    skip: !selectedEvent?.callout_id
  })
  // console.log(selectedEvent?.extendedProps?.callout_id)
  if (!loading) {
    // console.log(data?.extendedProps)
  }
  if (error) {
    console.log(selectedEvent)
  }

  // ** Close BTN
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleAddEventSidebar} />
  return (
    <Modal
      isOpen={open}
      onOpened={handleSelectedEvent}
      onClosed={handleResetInputValues}
      toggle={handleAddEventSidebar}
    >
      <ModalHeader className='mb-1' toggle={handleAddEventSidebar} close={CloseBtn} tag='div'>
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
             <Label for='title'>
               Title <span className='text-danger'>*</span>
             </Label>
            <Input
               id='title'
               name='title'
               placeholder='Title'
               value={title}
               onChange={e => setTitle(e.target.value)}
               innerRef={register({ register: true, validate: value => value !== '' })}
               className={classnames({
                 'is-invalid': errors.title
               })}
             />
           </FormGroup>

           <FormGroup>
             <Label for='label'>Label</Label>
             <Select
               id='label'
               value={value}
               options={options}
               theme={selectThemeColors}
               className='react-select'
               classNamePrefix='select'
               isClearable={false}
               onChange={data => setValue([data])}
               components={{
                 Option: OptionComponent
               }}
             />
           </FormGroup>


           <FormGroup>
           <Label for='label'>Client Name</Label>
           {allClients?.client && !clientLoading ? (
           <AutoComplete
           suggestions={allClients.client}
           className='form-control'
           filterKey='full_name'
           placeholder="Search client name"
           value={clientName}
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
                console.log(allProperty)
                
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
           {allProperty?.property_owned && !propertyLoading ? (
           <AutoComplete
           suggestions={allProperty.property_owned.map(a => a.property)}
           className='form-control'
           filterKey='address'
           value={propertyName}
           defaultSuggestions={true}
           placeholder="Search Propery Name"
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
           {allWorkers?.worker && !workerLoading ? (
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
                // setWorkerId(suggestion.id)                
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
             <Label for='startDate'>Start Date</Label>
             <Flatpickr
               required
               id='startDate'
                //tag={Flatpickr}
               name='startDate'
               className='form-control'
               onChange={date => setStartPicker(date[0])}
               value={startPicker}
               options={{
                 enableTime: allDay === false,
                 dateFormat: 'Y-m-d H:i'
               }}
             />
           </FormGroup>
           <FormGroup>
             <Label for='endDate'>End Date</Label>
             <Flatpickr
             style={{backgroundColor: '#efefef'}}
              //  required
               id='endDate'
                //tag={Flatpickr}
               name='endDate'
               className='form-control'
              //  onChange={date => setEndPicker(date[0])}
               value={endPicker}
               disabled
               options={{
                 enableTime: allDay === false,
                 dateFormat: 'Y-m-d H:i'
               }}
             />
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
                <Label for='worker-name'>Worker Name</Label>
                {allWorkers?.worker && !workerLoading ? (
           <AutoComplete
           suggestions={allWorkers.worker}
           className='form-control'
           filterKey='full_name'
           name="full_name"
           placeholder="Search Worker Name"
           value={job?.worker?.full_name}
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
                handleWorkChange(index, suggestion.full_name, suggestion.id)          
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
            </Col>
            <Col sm='12'>
              <FormGroup className='mb-2'>
                <Label for='jobtype'>Job Type</Label>
                <Select
               id='jobtype'
               value={job.type}
               options={jobTypeOptions}
               theme={selectThemeColors}
               className='react-select'
               classNamePrefix='select'
               isClearable={false}
               onChange={data => setValue([data])}
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
            onClick={handleJobUpdateEvent}
          >
            Update
          </Button.Ripple>
          <Button.Ripple color='danger' onClick={() => handleJobDeleteEvent(index)} outline>
            Delete
          </Button.Ripple>
        </Fragment>
            </FormGroup>
            </Col>
          </Row>
      </CardBody>
    </Card>
               ))}
           <FormGroup>
           <Button.Ripple
               className='mr-1'
               color='info'
               onClick={handleJobAddEvent}
             >
               Add New Job Ticket
             </Button.Ripple>
           </FormGroup>
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
