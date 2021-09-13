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
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Updated By: </h5>
      <h6 className='mb-1 ml-1'>{jobHistory?.updated_by}</h6>
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

  const RowContentWorker = ({data: jobWorker}) => (
    <div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Name: </h5> 
      <h6 className='mb-1 ml-1'>{jobWorker?.full_name}</h6>
    </div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Email: </h5>
      <h6 className='mb-1 ml-1'>{jobWorker?.email}</h6>
    </div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Team ID: </h5>
      <h6 className='mb-1 ml-1'>{jobWorker?.team_id}</h6>
    </div>
  </div>
  )

  const CollapseDefault = ({ data }) => (
    <AppCollapse data={data} type="border" />
  )

  const PrePostImage = ({picture}) => {
    return <div style={{width: "250px", margin:4}}>
     <a href={picture.picture_location} target="_blank"><img src={picture.picture_location} style={{width: "100%", height: "250px", objectFit: "cover",  borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10, marginBottom: 2}}/></a>
     <p className="font-weight-bolder mb-0" style={{fontSize: 15, textAlign: "left", lineHeight: 1.5}}>Upload time: </p>
     <p className="" style={{fontSize: 15, textAlign: "left", lineHeight: 1.5}}>{moment(picture?.upload_time).format('MMMM Do YYYY, h:mm:ss a')}</p>
     </div>
  }

  const CalloutPicture = ({picture}) => {
    return <div style={{width: "250px", margin:4}}>
     {picture ? <a href={picture} target="_blank"><img src={picture} style={{width: "100%", height: "250px", objectFit: "cover",  borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10}}/></a> : <div style={{width: "100px", height: "100px", borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10, display: "flex", justifyContent: "center", alignItems: "center"}}><p style={{fontSize: "12px", fontWeight: "bold", margin: 0}}>NO PICTURE</p></div>}
     
     </div>
  }

  const client = item?.client_callout_email
  const property = item?.property
  const callout = item
  const pre_images = item?.pre_pics
  const post_images = item?.postpics
  const job_history = item?.job_history
  const job = item?.callout_job
  const job_worker = item?.job_worker
  const schedule = item?.schedulers[0]
  // const {id, notes, name, callout_id, description, type, worker_email, status, request_time } = item
  // const job_ticket = {id, notes, name, callout_id, description, type, worker_email, status, request_time }
  // console.log(job_ticket)
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

    const job_worker_count = job_worker.length
    const job_worker_modified =
    job_worker_count !== 0 ? job_worker.map((jobWorker, i) => ({
      title: `Worker id: ${jobWorker.worker.id}`,
      content: <RowContentWorker data={jobWorker.worker} count={job_worker_count} />
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
      { (itemKey === "request_time") ? moment(item[itemKey]).format('MMMM Do YYYY, h:mm:ss a') : item[itemKey] ? item[itemKey] : "N/A"}
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
            Callout Details
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
            Job Worker
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '4'}
            onClick={() => {
              toggle('4')
            }}
          >
            Property Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '5'}
            onClick={() => {
              toggle('5')
            }}
          >
            Scheduled Time
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '6'}
            onClick={() => {
              toggle('6')
            }}
          >
            Pre Images
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '7'}
            onClick={() => {
              toggle('7')
            }}
          >
            Post Images
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '8'}
            onClick={() => {
              toggle('8')
            }}
          >
            Job History
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
      <TabPane tabId='1'>
        <h1>Callout Details <span className="font-medium-2">({callout.status})</span></h1>
            <ListGroup flush>
            {callout && Object.keys(callout).map(itemKey => {
              if (!(["callout_job", "client_callout_email", "job_history", "job_worker", "property", "postpics", "pre_pics", "__typename", "schedulers"].includes(itemKey))) {
                if ((["picture1", "picture2", "picture3", "picture4"].includes(itemKey))) {
                  return (
                    <CalloutPicture key={itemKey} picture={callout[itemKey]} />
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
          <p style={{fontWeight: "bold", fontSize: 18, margin: 0, marginTop: 20}}>Feedback for all the tickets in this job</p>  
              
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
        <h1>Job Worker Details</h1>
        <CollapseDefault data={job_worker_modified} />
        </TabPane>
        <TabPane tabId='4'>
        <h1>Property Details</h1>
            <ListGroup flush>
               {property && Object.keys(property).map(itemKey => {
              if (!(["__typename"].includes(itemKey))) {
                  return (
                    <ItemValue item={property} itemKey={itemKey} />
                  )
              }
              })}
            </ListGroup>
        </TabPane>
        <TabPane tabId='5'>
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
        <TabPane tabId='6'>
        <h1>Pre Images</h1>
            {pre_images.length > 0 ? pre_images.map((preImage, i) => (
              <PrePostImage key={i} picture={preImage} />
            )) : <div>No images</div>}
        </TabPane>
        <TabPane tabId='7'>
        <h1>Post Images</h1>
        {post_images.length > 0 ? post_images.map((postImages, i) => (
              <PrePostImage key={i} picture={postImages} />
            )) : <div>No images</div>}
        </TabPane>
        <TabPane tabId='8'>
        <h1>Job History Details</h1>
        <CollapseDefault data={job_history_modified} />
        </TabPane>
      </TabContent>
    </div>
  )
}
export default TabsVerticalLeft
