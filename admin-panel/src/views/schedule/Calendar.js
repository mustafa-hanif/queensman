// ** React Import
import { useEffect, useRef, memo, Fragment, useState } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { toast } from 'react-toastify'
import { Card, CardBody, Spinner } from 'reactstrap'
import { Menu, Check } from 'react-feather'

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

const Calendar = props => {
  // ** Refs
  const calendarRef = useRef(null)
  // ** Props
  const {
    events,
    isRtl,
    loading,
    // store,
    datesSet,
    selectedEvent,
    calendarsColor,
    calendarApi,
    setCalendarApi,
    handleAddEventSidebar,
    blankEvent,
    toggleSidebar,
    selectEvent,
    updateEvent
  } = props

  // ** UseEffect checks for CalendarAPI Update
  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current.getApi())
    }
  }, [calendarApi])

  // ** calendarOptions(Props)
  const calendarOptions = {
    events,
    // initialDate: '2020-08-01',
    datesSet,
    selectedEvent,
    eventDataTransform: (eventData => {
      console.log(events)
      const { id, worker, callout_id, start, startTime, title, callout } = eventData
      console.log({
        allDay: false,
        // end: `${start}T${'00:00:00.000Z'}`,
        id,
        title: worker?.full_name ? `${title} by ${worker?.full_name}` : 'No Title',
        start: `${start}T${startTime}`,
        workerName: worker?.full_name || 'No Worker name',
        clientName: callout.client_callout_email?.full_name || 'No Client name',
        category: callout?.category || "Uncategorized",
        propertyName: callout.property?.address || 'No Porperty',
        propertyId: callout.property?.id || 0,
        videoUrl: callout.video,
        // start: new Date(`${start} ${startTime}`).toISOString(),
        // start,
        extendedProps: {
          callout_id
        }
      })
      return {
        allDay: false,
        // end: `${start}T${'00:00:00.000Z'}`,
        id,
        title: worker?.full_name ? `${title} by ${worker?.full_name}` : 'No Title',
        start: `${start}T${startTime}`,
        workerName: worker?.full_name || 'No Worker name',
        clientName: callout.client_callout_email?.full_name || 'No Client name',
        clientEmail:callout.client_callout_email?.email || 'No Client email',
        category: callout?.category || "Uncategorized",
        propertyName: callout.property?.address || 'No Porperty',
        propertyId: callout.property?.id || 0,
        videoUrl: callout.video,
        // start: new Date(`${start} ${startTime}`).toISOString(),
        // start,
        extendedProps: {
          callout_id
        }
      }
    }),
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      start: 'sidebarToggle, prev,next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    /*
      Enable dragging and resizing event
      ? Docs: https://fullcalendar.io/docs/editable
    */
    editable: true,

    /*
      Enable resizing event from start
      ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
    */
    eventResizableFromStart: false,

    /*
      Automatically scroll the scroll-containers during event drag-and-drop and date selecting
      ? Docs: https://fullcalendar.io/docs/dragScroll
    */
    dragScroll: false,

    /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
    dayMaxEvents: 10,

    /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
    navLinks: true,

    // eventClassNames({ event: calendarEvent }) {
    //   // eslint-disable-next-line no-underscore-dangle
    //   const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

    //   return [
    //     // Background Color
    //     `bg-light-${colorName}`
    //   ]
    // },

    eventClick({ event: clickedEvent }) {
      console.log(clickedEvent, 'bonga')
      selectEvent(clickedEvent)
        handleAddEventSidebar()
      

      // * Only grab required field otherwise it goes in infinity loop
      // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
      // event.value = grabEventDataFromEventApi(clickedEvent)

      // eslint-disable-next-line no-use-before-define
      // isAddNewEventSidebarActive.value = true
    },

    customButtons: {
      sidebarToggle: {
        text: <Menu className='d-xl-none d-block' />,
        click() {
          toggleSidebar(true)
        }
      }
    },

    dateClick(info) {
      // console.log(info)
      const ev = blankEvent
      ev.start = info.date
      ev.end = info.date
      selectEvent(ev)
      handleAddEventSidebar()
    },

    /*
      Handle event drop (Also include dragged event)
      ? Docs: https://fullcalendar.io/docs/eventDrop
      ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    */
    eventDrop({ event: droppedEvent }) {
      updateEvent(droppedEvent)
      toast.success(<ToastComponent title='Event Updated' color='success' icon={<Check />} />, {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      })
    },

    /*
      Handle event resize
      ? Docs: https://fullcalendar.io/docs/eventResize
    */
    eventResize({ event: resizedEvent }) {
      updateEvent(resizedEvent)
      toast.success(<ToastComponent title='Event Updated' color='success' icon={<Check />} />, {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      })
    },

    ref: calendarRef,

    // Get direction from app state (store)
    direction: isRtl ? 'rtl' : 'ltr'
  }

  return (
    <Card className='shadow-none border-0 mb-0 rounded-0'>
      <CardBody className='pb-0'>
        {loading && <Spinner />}
        <FullCalendar {...calendarOptions} />{' '}
      </CardBody>
    </Card>
  )
}

export default memo(Calendar)
