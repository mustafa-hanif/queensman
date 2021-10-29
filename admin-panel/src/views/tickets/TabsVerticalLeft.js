import { useState } from 'react'
import AppCollapse from '@components/app-collapse'
import moment from "moment"
import { TabContent, TabPane, Nav, NavItem, NavLink, ListGroup, ListGroupItem, Card  } from 'reactstrap'

const TabsVerticalLeft = ({item}) => {
  const [active, setActive] = useState('1')

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const RowContent = ({data: jobHistory}) => (
    <div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Status Update: </h5> 
      <h6 className='mb-1 ml-1'>{jobHistory?.status_update}</h6>
    </div>
    {jobHistory?.location && <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Location: </h5>
      <h6 className='mb-1 ml-1'><a target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${JSON.parse(jobHistory?.location).coords?.latitude}%2C${JSON.parse(jobHistory?.location).coords?.longitude}`}>Click here to view location</a></h6>
    </div>}
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Updated At: </h5>
      <h6 className='mb-1 ml-1'>{moment(jobHistory?.time).format('MMMM Do YYYY, h:mm:ss a')}</h6>
    </div>
  </div>
  )

  const CollapseDefault = ({ data }) => (
    <AppCollapse data={data} type="border" />
  )


  const CalloutPicture = ({picture}) => {
    return <div style={{width: "250px", margin:4}}>
     {picture ? <a href={picture} target="_blank"><img src={picture} style={{width: "100%", height: "250px", objectFit: "cover",  borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10}}/></a> : <div style={{width: "100px", height: "100px", borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10, display: "flex", justifyContent: "center", alignItems: "center"}}><p style={{fontSize: "12px", fontWeight: "bold", margin: 0}}>NO PICTURE</p></div>}
     </div>
  }

  const client = item?.callout?.client
  const callout = item?.callout
  const { job } = callout
  const job_history = callout?.job_history
  const schedule = item?.callout?.schedulers[0]
  const {id, notes, name, callout_id, description, type, worker_email, status, created_at, start_time, end_time } = item
  const job_ticket = {id, notes, name, callout_id, description, type, worker_email, status, created_at, start_time, end_time }

  const job_history_count = job_history.length
  const job_history_modified =
  job_history_count !== 0 ? job_history.map((jobHistory, i) => ({
    title: `History id: ${jobHistory.id}`,
    content: <RowContent data={jobHistory} count={job_history_count} />
  })) : [
    {
      title: `No data Available`,
      content: <div></div>
    }
  ]


  const ItemValue = ({item, itemKey}) => (
    <ListGroupItem>
    <span style={{fontWeight: "bold"}}>
      {itemKey.split("_").map(value => value.charAt(0).toUpperCase() + value.slice(1)).join(" ")}: </span> 
      { (itemKey === "request_time" || itemKey === "created_at" || itemKey === "start_time" || itemKey === "end_time") ? moment(item[itemKey]).format('MMMM Do YYYY, h:mm:ss a') : item[itemKey] ? item[itemKey] : "N/A"}
    </ListGroupItem>
  )
  return (
    <div className='nav-vertical'>
      <Nav tabs className='nav-left'>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            Ticket Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Client Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
          >
            Job Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '4'}
            onClick={() => {
              toggle('4')
            }}
          >
            Scheduled Time
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '5'}
            onClick={() => {
              toggle('5')
            }}
          >
            Job History
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
        <h1>Job Ticket Details</h1>
            <ListGroup flush>
            {job_ticket && Object.keys(job_ticket).map(itemKey => {
              if ((![""].includes(itemKey))) {
                if ((["notes"].includes(itemKey)) && job_ticket["notes"]?.length > 0 && job_ticket["notes"] !== "{}") {
                  <ListGroupItem>Notes: </ListGroupItem>
                  return job_ticket?.["notes"].map(note => (
                  <ListGroupItem>
                    <span style={{fontWeight: "bold"}}>Notes: </span>From: {note?.from}; Message: {note?.message}
                  </ListGroupItem>
                  ))
                } else {
                  return (
                    <ItemValue item={job_ticket} itemKey={itemKey} />
                )
                }
                  
              }
              })}
              <ListGroupItem>
                <span style={{fontWeight: "bold"}}>Time taken to complete the job: </span>{job_ticket['status'] === "Closed" && moment(job_ticket["end_time"]).diff(moment(job_ticket["start_time"]), "minutes")} Minutes
              </ListGroupItem>
            </ListGroup>
        </TabPane>
        <TabPane tabId='2'>
        <h1>Client Details</h1>
            <ListGroup flush>
               {client && Object.keys(client).map(itemKey => {
              if (!(["__typename"].includes(itemKey))) {
                  return (
                    <ItemValue item={client} itemKey={itemKey} />
                  )
              }
              })}
            </ListGroup>
        </TabPane>
        <TabPane tabId='3'>
        <h1>Job Details</h1>
            <ListGroup flush>
            {callout && Object.keys(callout).map(itemKey => {
              if (!(["client", "property", "job", "schedulers", "job_history", "job_type_rel", "__typename"].includes(itemKey))) {
                if ((["picture1", "picture2", "picture3", "picture4"].includes(itemKey))) {
                  return (
                    <CalloutPicture key={itemKey} picture={callout[itemKey]} />
                  )
                }
                if (itemKey === "pre_pics") {
                  return (
                    <div>
                      <p style={{fontWeight: "bold", fontSize: 18, margin: 0, marginTop: 10}}>Pre job pictures: </p>
                    {callout[itemKey].map(prePic => <CalloutPicture key={prePic?.picture_location} picture={prePic?.picture_location} />)}
                    </div>
                  )
                }
                if (itemKey === "postpics") {
                  return (
                    <div>
                      <p style={{fontWeight: "bold", fontSize: 18, margin: 0, marginTop: 10}}>Post job pictures: </p>
                    {callout[itemKey].map(prePic => <CalloutPicture key={prePic?.picture_location} picture={prePic?.picture_location} />)}
                    </div>
                  )
                }
                if ((["video"].includes(itemKey))) {
                  return (
                    <div>
                      <p style={{fontWeight: "bold", fontSize: 18, margin: 0, marginTop: 10}}>Video: </p>
                      {callout[itemKey] === "" ? <p>No video</p> : <video width="250" controls src={callout[itemKey]} />}
                   </div>
                  )
                }
                  return (
                    <ItemValue item={callout} itemKey={itemKey} />
                  )
              }
              })}
              <div>
                <p style={{fontWeight: "bold", fontSize: 18, margin: 0, marginTop: 10}}>Feedback for all the tickets in this job</p>  
                   
              {job.length > 0 ? job?.map(_job => {
                if (_job?.feedback) {
                  return <div>
                  <p style={{fontWeight: "bold", fontSize: 14, margin: 0, marginTop: 10}}>Solution: </p>
                  {_job?.solution}

                  <p style={{fontWeight: "bold", fontSize: 14, margin: 0, marginTop: 10}}>Feedback: </p>
                  {_job?.feedback}

                  <p style={{fontWeight: "bold", fontSize: 14, margin: 0, marginTop: 10}}>Rating (X/5): </p>
                  {_job?.rating} / 5
                  </div>
                }
                return null
              }) : <div>No feedback</div>}
              </div>
            </ListGroup>
        </TabPane>
        <TabPane tabId='4'>
        <h1>Schedule Details</h1>
            <ListGroup flush>
            {schedule && Object.keys(schedule).map(itemKey => {
              if (!(["__typename"].includes(itemKey))) {
                  return (
                    <ItemValue item={schedule} itemKey={itemKey} />
                  )
              }
              })}
            </ListGroup>
        </TabPane>
        <TabPane tabId='5'>
          <h1>Job History</h1>
      <CollapseDefault data={job_history_modified} />
        </TabPane>
      </TabContent>
    </div>
  )
}
export default TabsVerticalLeft
