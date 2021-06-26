// ** React Imports
import { Fragment, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { gql, useQuery, useMutation } from "@apollo/client"

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import classnames from 'classnames'
import { toast } from 'react-toastify'
import Flatpickr from 'react-flatpickr'
import { X, Check, Trash } from 'react-feather'
import Select, { components } from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { Button, Modal, ModalHeader, ModalBody, Card, ListGroup, ListGroupItem, FormGroup, Label, CustomInput, Input, Form, Spinner } from 'reactstrap'

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

const REQUEST_CALLOUT = gql`
  mutation AddCallout(
    $property_id: Int
    $date_on_calendar: date
    $notes: String
    $time_on_calendar: time
    $email: String
    $category: String
    $job_type: String
    $status: String
    $picture1: String
    $picture2: String
    $picture3: String
    $picture4: String
    $request_time: timestamp
    $urgency_level: String
  ) {
    insert_scheduler_one(
      object: {
        callout: {
          data: {
            callout_by_email: $email
            property_id: $property_id
            category: $category
            job_type: $job_type
            status: $status
            request_time: $request_time
            urgency_level: $urgency_level
            picture1: $picture1
            picture2: $picture2
            picture3: $picture3
            picture4: $picture4
            active: 1
          }
        }
        date_on_calendar: $date_on_calendar
        time_on_calendar: $time_on_calendar
        notes: $notes
      }
    ) {
      date_on_calendar
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
    selectEvent,
    selectedEvent,
    updateEvent,
    removeEvent
  } = props

  // ** Vars
  // const selectedEvent = store.selectedEvent
  const { register, errors, handleSubmit } = useForm()

  // ** States
  const [url, setUrl] = useState('')
  const [desc, setDesc] = useState('')
  const [title, setTitle] = useState('')
  const [guests, setGuests] = useState({})
  const [allDay, setAllDay] = useState(false)
  const [location, setLocation] = useState('')
  const [endPicker, setEndPicker] = useState(new Date())
  const [startPicker, setStartPicker] = useState(new Date())
  const [value, setValue] = useState([{ value: 'Business', label: 'Business', color: 'primary' }])
  const [requestCalloutApiCall, { loading: requestCalloutLoading, error: mutationError }] = useMutation(
    REQUEST_CALLOUT
  )

  // ** Select Options
  const options = [
    { value: 'Business', label: 'Business', color: 'primary' },
    { value: 'Personal', label: 'Personal', color: 'danger' },
    { value: 'Family', label: 'Family', color: 'warning' },
    { value: 'Holiday', label: 'Holiday', color: 'success' },
    { value: 'ETC', label: 'ETC', color: 'info' }
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
    // const obj = {
    //   title,
    //   start: startPicker,
    //   end: endPicker,
    //   allDay,
    //   display: 'block',
    //   extendedProps: {
    //     calendar: value[0].label,
    //     url: url.length ? url : undefined,
    //     guests: guests.length ? guests : undefined,
    //     location: location.length ? location : undefined,
    //     desc: desc.length ? desc : undefined
    //   }
    // }
    // dispatch(addEvent(obj))
    // console.log(obj)
    // console.log({
    //     property_id: 1,
    //     email: 'salmanhanif@gmail.com',
    //     notes: '1',
    //     time_on_calendar : startPicker.toTimeString().substr(0, 8), 
    //     date_on_calendar : startPicker.toISOString().substring(0, 10), 
    //     category: value[0].label, 
    //     job_type: value[0].label, 
    //     status: "Requested",
    //     request_time: new Date().toLocaleDateString(),
    //     urgency_level: "Medium"})
    requestCalloutApiCall({
      variables: {
        property_id: 1,
        email: 'salmanhanif@gmail.com',
        notes: "1",
        time_on_calendar : startPicker.toTimeString().substr(0, 8), 
        date_on_calendar : startPicker.toISOString().substring(0, 10), 
        category: "Uncategorized", 
        job_type: value[0].label, 
        status: "Requested",
        request_time: new Date().toLocaleDateString(),
        urgency_level: "Medium"
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

  // ** Reset Input Values on Close
  const handleResetInputValues = () => {
    selectEvent({})
    setTitle('')
    setAllDay(false)
    setUrl('')
    setLocation('')
    setDesc('')
    setGuests({})
    setValue([{ value: 'Business', label: 'Business', color: 'primary' }])
    setStartPicker(new Date())
    setEndPicker(new Date())
  }

  // ** Set sidebar fields
  const handleSelectedEvent = () => {
    if (Object.keys(selectedEvent ?? {}).length) {
      const calendar = selectedEvent?.extendedProps?.calendar

      const resolveLabel = () => {
        if (calendar?.length) {
          return { label: calendar, value: calendar, color: calendarsColor[calendar] }
        } else {
          return { value: 'Business', label: 'Business', color: 'primary' }
        }
      }
      setTitle(selectedEvent.title || title)
      setAllDay(selectedEvent.allDay || allDay)
      setUrl(selectedEvent.url || url)
      setLocation(selectedEvent.extendedProps.location || location)
      setDesc(selectedEvent.extendedProps.description || desc)
      setGuests(selectedEvent.extendedProps.guests || guests)
      setStartPicker(new Date(selectedEvent.start))
      // setEndPicker(selectedEvent.allDay ? new Date(selectedEvent.start) : new Date(selectedEvent.end))
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
      title,
      allDay,
      start: startPicker,
      end: endPicker,
      url,
      extendedProps: {
        location,
        description: desc,
        guests,
        calendar: value[0].label
      }
    }

    const propsToUpdate = ['id', 'title', 'url']
    const extendedPropsToUpdate = ['calendar', 'guests', 'location', 'description']

    updateEvent(eventToUpdate)
    updateEventInCalendar(eventToUpdate, propsToUpdate, extendedPropsToUpdate)
    handleAddEventSidebar()
    toast.success(<ToastComponent title='Event Updated' color='success' icon={<Check />} />, {
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false
    })
  }

  // ** (UI) removeEventInCalendar
  const removeEventInCalendar = eventId => {
    calendarApi.getEventById(eventId).remove()
  }
  const handleDeleteEvent = () => {
    removeEvent(selectedEvent.id)
    removeEventInCalendar(selectedEvent.id)
    handleAddEventSidebar()
    toast.error(<ToastComponent title='Event Removed' color='danger' icon={<Trash />} />, {
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
      id: selectedEvent?.extendedProps?.callout_id
    },
    skip: !selectedEvent?.extendedProps?.callout_id
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
       <ModalBody className='flex-grow-1 pb-sm-0 pb-3'>
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
        {/* {loading && <Spinner />}
        {!loading && <Card className='mb-4'>
          <ListGroup flush>
            <ListGroupItem>
              <Swiper {...params}>
                {data?.callout_by_pk?.postpics?.map(pic => <SwiperSlide><img width="200" src={pic?.picture_location} /></SwiperSlide>)}
              </Swiper>
            </ListGroupItem>
            <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
            <ListGroupItem>Vestibulum at eros</ListGroupItem>
          </ListGroup>
        </Card>} */}
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
           <FormGroup className='d-flex'>
            <EventActions />
          </FormGroup>
           </Form>
       </ModalBody>
    </Modal>
  )
  // return (
  //   <Modal
  //     isOpen={open}
  //     toggle={handleAddEventSidebar}
  //     // className='sidebar-lg'
  //     contentClassName='p-0'
  //     onOpened={handleSelectedEvent}
  //     onClosed={handleResetInputValues}
  //     // modalClassName='modal-slide-in event-sidebar'
  //   >
  //     <ModalHeader className='mb-1' toggle={handleAddEventSidebar} close={CloseBtn} tag='div'>
  //       <h5 className='modal-title'>
  //         {selectedEvent && selectedEvent.title && selectedEvent.title.length ? 'Update' : 'Add'} Event
  //       </h5>
  //     </ModalHeader>
  //     <ModalBody className='flex-grow-1 pb-sm-0 pb-3'>
  //       <Form
  //         onSubmit={handleSubmit(data => {
  //           if (isObjEmpty(errors)) {
  //             if (isObjEmpty(selectedEvent) || (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)) {
  //               handleAddEvent()
  //             } else {
  //               handleUpdateEvent()
  //             }
  //             handleAddEventSidebar()
  //           }
  //         })}
  //       >
  //         <FormGroup>
  //           <Label for='title'>
  //             Title <span className='text-danger'>*</span>
  //           </Label>
  //           <Input
  //             id='title'
  //             name='title'
  //             placeholder='Title'
  //             value={title}
  //             onChange={e => setTitle(e.target.value)}
  //             innerRef={register({ register: true, validate: value => value !== '' })}
  //             className={classnames({
  //               'is-invalid': errors.title
  //             })}
  //           />
  //         </FormGroup>

  //         <FormGroup>
  //           <Label for='label'>Label</Label>
  //           <Select
  //             id='label'
  //             value={value}
  //             options={options}
  //             theme={selectThemeColors}
  //             className='react-select'
  //             classNamePrefix='select'
  //             isClearable={false}
  //             onChange={data => setValue([data])}
  //             components={{
  //               Option: OptionComponent
  //             }}
  //           />
  //         </FormGroup>

  //         <FormGroup>
  //           <Label for='startDate'>Start Date</Label>
  //           <Flatpickr
  //             required
  //             id='startDate'
  //             // tag={Flatpickr}
  //             name='startDate'
  //             className='form-control'
  //             onChange={date => setStartPicker(date[0])}
  //             value={startPicker}
  //             options={{
  //               enableTime: allDay === false,
  //               dateFormat: 'Y-m-d H:i'
  //             }}
  //           />
  //         </FormGroup>

  //         <FormGroup>
  //           <Label for='endDate'>End Date</Label>
  //           <Flatpickr
  //             required
  //             id='endDate'
  //             // tag={Flatpickr}
  //             name='endDate'
  //             className='form-control'
  //             onChange={date => setEndPicker(date[0])}
  //             value={endPicker}
  //             options={{
  //               enableTime: allDay === false,
  //               dateFormat: 'Y-m-d H:i'
  //             }}
  //           />
  //         </FormGroup>

  //         <FormGroup>
  //           <CustomInput
  //             type='switch'
  //             id='allDay'
  //             name='customSwitch'
  //             label='All Day'
  //             checked={allDay}
  //             onChange={e => setAllDay(e.target.checked)}
  //             inline
  //           />
  //         </FormGroup>

  //         <FormGroup>
  //           <Label for='eventURL'>Event URL</Label>
  //           <Input
  //             type='url'
  //             id='eventURL'
  //             value={url}
  //             onChange={e => setUrl(e.target.value)}
  //             placeholder='https://www.google.com'
  //           />
  //         </FormGroup>

  //         <FormGroup>
  //           <Label for='guests'>Guests</Label>
  //           <Select
  //             isMulti
  //             id='guests'
  //             className='react-select'
  //             classNamePrefix='select'
  //             isClearable={false}
  //             options={guestsOptions}
  //             theme={selectThemeColors}
  //             value={guests.length ? [...guests] : null}
  //             onChange={data => setGuests([...data])}
  //             components={{
  //               Option: GuestsComponent
  //             }}
  //           />
  //         </FormGroup>

  //         <FormGroup>
  //           <Label for='location'>Location</Label>
  //           <Input id='location' value={location} onChange={e => setLocation(e.target.value)} placeholder='Office' />
  //         </FormGroup>

  //         <FormGroup>
  //           <Label for='description'>Description</Label>
  //           <Input
  //             type='textarea'
  //             name='text'
  //             id='description'
  //             rows='3'
  //             value={desc}
  //             onChange={e => setDesc(e.target.value)}
  //             placeholder='Description'
  //           />
  //         </FormGroup>
  //         <FormGroup className='d-flex'>
  //           <EventActions />
  //         </FormGroup>
  //       </Form>
  //     </ModalBody>
  //   </Modal>
  // )
}

export default AddEventSidebar
