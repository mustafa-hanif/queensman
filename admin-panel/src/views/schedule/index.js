// ** React Imports
import { Fragment, useState, useEffect, useRef } from 'react'
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client"

// ** Third Party Components
import classnames from 'classnames'
import { Row, Col } from 'reactstrap'

// ** Calendar App Component Imports
import Calendar from './Calendar'
// import SidebarLeft from './SidebarLeft'
import AddEventSidebar from './AddEventSidebar'

// ** Custom Hooks
import { useRTL } from '@hooks/useRTL'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchEvents,
  // updateEvent,
  updateFilter,
  updateAllFilters,
  // selectEvent,
  addEvent
  // removeEvent
} from './store/actions/index'

// ** Styles
import '@styles/react/apps/app-calendar.scss'

// ** CalendarColors
const calendarsColor = {
  Business: 'primary',
  Holiday: 'success',
  Personal: 'danger',
  Family: 'warning',
  ETC: 'info'
}

const GET_SCHEDULE = gql`
query GetSchedule($_gte: date!, $_lte: date!) {
  scheduler(where: {date_on_calendar: {_gte: $_gte, _lte: $_lte}}) {
    id
    start: date_on_calendar
    startTime: time_on_calendar
    end: end_date_on_calendar
    endTime: end_time_on_calendar
    notes
    worker {
      full_name
    }
    callout_id
    callout {
      property {
        address
        id
      }
      client_callout_email {
        email
        full_name
      }
      category
      video
      job_type
    }    
    job_tickets {
      name
      description
      id
      notes
      pictures
      type
      worker {
        full_name
        id
        color_code
      }
    }
  }
}
`

const UPDATE_CALLOUT = gql`
mutation UpdateCallout($notes: String, $callout_id: Int, $callout_by_email: String, $category: String, $job_type: String, $scheduler_id: Int) {
  update_scheduler(where: {id: {_eq: $scheduler_id}}, _set: {notes: $notes}) {
    affected_rows
  }
  update_callout(where: {id: {_eq: $callout_id}}, _set: {callout_by_email: $callout_by_email, category: $category, job_type: $job_type}) {
    affected_rows
  }
}
`

const UPDATE_CALLOUT_DRAG = gql`
mutation UpdateCalloutDrag($scheduler_id: Int, $date_on_calendar: date, $time_on_calendar: time) {
  update_scheduler(where: {id: {_eq: $scheduler_id}}, _set: {date_on_calendar: $date_on_calendar, time_on_calendar: $time_on_calendar}) {
    affected_rows
  }
}
`

const DELETE_CALLOUT = gql`
mutation DeleteCallout($callout_id: Int, $scheduler_id: Int) {
  delete_scheduler(where: {id: {_eq: $scheduler_id}}) {
    affected_rows
  }
  delete_callout(where: {id: {_eq: $callout_id}}) {
    affected_rows
  }
}
`

const REQUEST_CALLOUT = gql`
  mutation AddCallout(
    $property_id: Int
    $date_on_calendar: date
    $end_date_on_calendar: date
    $time_on_calendar: time
    $end_time_on_calendar: time
    $notes: String
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
        end_date_on_calendar: $end_date_on_calendar
        end_time_on_calendar : $end_time_on_calendar 
        notes: $notes
      }
    ) {
      date_on_calendar
    }
  }
`

const CalendarComponent = () => {
  // ** Variables
  // const dispatch = useDispatch()
  // const store = useSelector(state => {
  //   return state.calendar
  // })

  const [updateCallOut] = useMutation(UPDATE_CALLOUT,  {
    refetchQueries: [
      { 
        query: GET_SCHEDULE,
        variables: {
          _gte: new Date().toISOString().split('T')[0],
          _lte: new Date().toISOString().split('T')[0]
        } 
      }
    ]
  })
  const [updateCallOutDrag] = useMutation(UPDATE_CALLOUT_DRAG)
  const [deleteCallout] = useMutation(DELETE_CALLOUT)

  const selectedDates = useRef({
    _gte: new Date().toISOString().split('T')[0],
    _lte: new Date().toISOString().split('T')[0]
  }) //, setSelectedDates] = useState({
    
  const [selectedEvent, selectEvent] = useState({})

  const updateEvent = (eventToUpdate) => {
    updateCallOut({variables: {
      notes: eventToUpdate.title, 
      callout_id: eventToUpdate.callout_id, 
      callout_by_email: eventToUpdate.extendedProps.clientEmail, 
      category: eventToUpdate.extendedProps.category, 
      job_type: eventToUpdate.extendedProps.job_type, 
      scheduler_id: eventToUpdate.id
    }})
  }
  const updateEventDrag = (eventToUpdate) => {
    updateCallOutDrag({variables: {
      date_on_calendar: eventToUpdate.startStr.split('T')[0],
      time_on_calendar:eventToUpdate.startStr.split('T')[1].substr(0, 8),
      scheduler_id: eventToUpdate.id
    }})
  }

  const removeEvent = (id, callout_id) => {
    deleteCallout({variables: {
      callout_id, 
      scheduler_id: id
    }})
  }

  // ** states
  const [addSidebarOpen, setAddSidebarOpen] = useState(false),
    [leftSidebarOpen, setLeftSidebarOpen] = useState(false),
    [calendarApi, setCalendarApi] = useState(null)

  // ** Hooks
  const [isRtl, setIsRtl] = useRTL()

  // ** AddEventSidebar Toggle Function
  const handleAddEventSidebar = () => setAddSidebarOpen(!addSidebarOpen)

  // ** LeftSidebar Toggle Function
  const toggleSidebar = val => setLeftSidebarOpen(val)

  // ** Blank Event Object
  const blankEvent = {
    title: '',
    start: '',
    end: '',
    allDay: false,
    url: '',
    extendedProps: {
      calendar: '',
      guests: [],
      location: '',
      description: ''
    }
  }

  
  const _gte = selectedDates.current._gte
  const _lte = selectedDates.current._lte
  
  const [getSchedule, { loading, data }] = useLazyQuery(GET_SCHEDULE, {
    variables: {
      _gte,
      _lte
    }
  })

  const [requestCalloutApiCall, { loading: requestCalloutLoading, error: mutationError }] = useMutation(
    REQUEST_CALLOUT,
    {
      refetchQueries: [
        { 
          query: GET_SCHEDULE,
          variables: {
            _gte,
            _lte
          } 
        }
      ]
    }
  )


  // ** refetchEvents
  const refetchEvents = () => {
    if (calendarApi !== null) {
      calendarApi.refetchEvents()
      // getSchedule({ variables: {
      //   _gte,
      //   _lte
      // }})
    }
  }
  // ** Fetch Events On Mount
  useEffect(() => {
  //  console.log(data)
    // dispatch(fetchEvents(store.selectedCalendars))
  }, [])

  const datesSet = (info) => {
    // console.log(info)
    selectedDates.current = {
      _gte: info.start, //new Date(info.start).toISOString().substring(0, 10),
      _lte: info.end // new Date(info.end).toISOString().substring(0, 10)
    }
    getSchedule({ variables: {
      _gte: info.start,
      _lte: info.end
    }})
    // console.log(data)
  }
    // const data2 = [...data?.scheduler ?? [], data?.job_tickets ?? ]
    // console.log(data)

  return (
    <Fragment>
      <div className='app-calendar overflow-hidden border'>
        <Row noGutters>        
          <Col className='position-relative'>
            <Calendar
              loading={loading || requestCalloutLoading}
              isRtl={isRtl}
              // store={store}
              events={data?.scheduler ?? []}
              // dispatch={dispatch}
              datesSet={datesSet}
              blankEvent={blankEvent}
              calendarApi={calendarApi}
              selectEvent={selectEvent}
              selectedEvent={selectedEvent}
              updateEvent={updateEvent}
              toggleSidebar={toggleSidebar}
              calendarsColor={calendarsColor}
              setCalendarApi={setCalendarApi}
              updateEventDrag={updateEventDrag}
              handleAddEventSidebar={handleAddEventSidebar}
            />
          </Col>
          <div
            className={classnames('body-content-overlay', {
              show: leftSidebarOpen === true
            })}
            onClick={() => toggleSidebar(false)}
          ></div>
        </Row>
      </div>
      <AddEventSidebar
        //store={store}
        addEvent={addEvent}
        // dispatch={dispatch}
        requestCalloutApiCall={requestCalloutApiCall}
        open={addSidebarOpen}
        selectedEvent={selectedEvent}
        selectEvent={selectEvent}
        updateEvent={updateEvent}
        removeEvent={removeEvent}
        calendarApi={calendarApi}
        refetchEvents={refetchEvents}
        calendarsColor={calendarsColor}
        handleAddEventSidebar={handleAddEventSidebar}
      />
    </Fragment>
  )
}

export default CalendarComponent
