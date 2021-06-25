// ** React Imports
import { Fragment, useState, useEffect, useRef } from 'react'
import { gql, useLazyQuery, useQuery } from "@apollo/client"

// ** Third Party Components
import classnames from 'classnames'
import { Row, Col } from 'reactstrap'

// ** Calendar App Component Imports
import Calendar from './Calendar'
import SidebarLeft from './SidebarLeft'
import AddEventSidebar from './AddEventSidebar'

// ** Custom Hooks
import { useRTL } from '@hooks/useRTL'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchEvents,
  updateEvent,
  updateFilter,
  updateAllFilters,
  selectEvent,
  addEvent,
  removeEvent
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
  query MyQuery($_gte: date!, $_lte: date!) {
    scheduler(where: {date_on_calendar: {_gte: $_gte, _lte: $_lte}}) {
      id
      start: date_on_calendar
      startTime: time_on_calendar
      title: notes
      worker {
        full_name
      }
      callout_id
    }
  }
`

const CalendarComponent = () => {
  // ** Variables
  const dispatch = useDispatch()
  const store = useSelector(state => {
    return state.calendar
  })

  const [selectedDates, setSelectedDates] = useState({
    _gte: '2020-08-01',
    _lte: '2020-08-01'
  })
  // const [selectedEvent, selectEvent] = useState({})

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

  // ** refetchEvents
  const refetchEvents = () => {
    if (calendarApi !== null) {
      calendarApi.refetchEvents()
    }
  }

  const _gte = selectedDates._gte
  const _lte = selectedDates._lte
  
  const [getSchedule, { loading, data }] = useLazyQuery(GET_SCHEDULE, {
    variables: {
      _gte,
      _lte
    }
  })
  // ** Fetch Events On Mount
  useEffect(() => {
  //  console.log(data)
    // dispatch(fetchEvents(store.selectedCalendars))
  }, [])

  const datesSet = (info) => {
    console.log(info)
    getSchedule({ variables: {
      _gte: info.startStr,
      _lte: info.endStr
    }})
    // console.log(data)
  }

  return (
    <Fragment>
      <div className='app-calendar overflow-hidden border'>
        <Row noGutters>
          {/* <Col
            id='app-calendar-sidebar'
            className={classnames('col app-calendar-sidebar flex-grow-0 overflow-hidden d-flex flex-column', {
              show: leftSidebarOpen
            })}
          >
            <SidebarLeft
              updateFilter={updateFilter}
              toggleSidebar={toggleSidebar}
              updateAllFilters={updateAllFilters}
              handleAddEventSidebar={handleAddEventSidebar}
            />
          </Col> */}
          <Col className='position-relative'>
            <Calendar
              isRtl={isRtl}
              store={store}
              events={data?.scheduler ?? []}
              dispatch={dispatch}
              datesSet={datesSet}
              blankEvent={blankEvent}
              calendarApi={calendarApi}
              selectEvent={selectEvent}
              updateEvent={updateEvent}
              toggleSidebar={toggleSidebar}
              calendarsColor={calendarsColor}
              setCalendarApi={setCalendarApi}
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
      store={store}
        addEvent={addEvent}
        dispatch={dispatch}
        open={addSidebarOpen}
        // selectedEvent={selectedEvent}
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
