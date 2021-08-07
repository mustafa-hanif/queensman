import { useState } from 'react'
import AppCollapse from '@components/app-collapse'
import { TabContent, TabPane, Nav, NavItem, NavLink, ListGroup, ListGroupItem, Card  } from 'reactstrap'

const TabsVerticalLeft = ({item}) => {
  const [active, setActive] = useState('1')

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const RowContent = ({data: prop}) => (
    <div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Address: </h5> 
      <h6 className='mb-1 ml-1'>{prop.address}</h6>
    </div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Country: </h5>
      <h6 className='mb-1 ml-1'>{prop.country}</h6>
    </div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>City: </h5>
      <h6 className='mb-1 ml-1'>{prop.city}</h6>
    </div>
  </div>
  )

  // const CollapseDefault = ({data}) => <AppCollapse data={data} type='border' />

  const CalloutPicture = ({picture}) => {
    return <div style={{width: "250px", margin:4}}>
     {picture ? <a href={picture} target="_blank"><img src={picture} style={{width: "100%", height: "250px", objectFit: "cover",  borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10}}/></a> : <div style={{width: "100px", height: "100px", borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10, display: "flex", justifyContent: "center", alignItems: "center"}}><p style={{fontSize: "12px", fontWeight: "bold", margin: 0}}>NO PICTURE</p></div>}
     </div>
  }

  const client = item?.callout?.client
  const callout = item?.callout
  const schedule = item?.callout?.schedulers[0]
  const {id, notes, name, callout_id, description, type, worker_email, status } = item
  const job_ticket = {id, notes, name, callout_id, description, type, worker_email, status}
  // const property_owneds = item.callout.property
  //   const prop_count = property_owneds.length
  //   const property_owneds_modified = prop_count !== 0 ? {
  //           title: `Property id: ${property_owneds.id} Adddress: ${property_owneds.address}`,
  //           content: (
  //             <RowContent data={property_owneds} count={property_owneds.length}/>
  //           )
  //         } : [
  //       {
  //       title: `No data Available`,
  //       content: (
  //         <div>
  //       </div>
  //       )
  //     }
  //   ]

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
                    <ListGroupItem>
                        <span style={{fontWeight: "bold"}}>{itemKey.split("_").map(value => value.charAt(0).toUpperCase() + value.slice(1)).join(" ")}:</span> {job_ticket[itemKey] ? job_ticket[itemKey] : "N/A"}
                    </ListGroupItem>
                )
                }
                  
              }
              })}
            </ListGroup>
        </TabPane>
        <TabPane tabId='2'>
        <h1>Client Details</h1>
            <ListGroup flush>
               {client && Object.keys(client).map(itemKey => {
              if (!(["__typename"].includes(itemKey))) {
                  return (
                      <ListGroupItem>
                          <span style={{fontWeight: "bold"}}>{itemKey.split("_").map(value => value.charAt(0).toUpperCase() + value.slice(1)).join(" ")}:</span> {client[itemKey] ? client[itemKey] : "N/A"}
                      </ListGroupItem>
                  )
              }
              })}
            </ListGroup>
        </TabPane>
        <TabPane tabId='3'>
        <h1>Job Details</h1>
            <ListGroup flush>
            {callout && Object.keys(callout).map(itemKey => {
              if (!(["client", "property", "job", "schedulers", "__typename"].includes(itemKey))) {
                if ((["picture1", "picture2", "picture3", "picture4"].includes(itemKey))) {
                  return (
                    <CalloutPicture picture={callout[itemKey]} />
                  )
                }
                if ((["video"].includes(itemKey))) {
                  return (
                    <div>
                      <p style={{fontWeight: "bold", fontSize: 18, margin: 0, marginTop: 10}}>Video: </p>
                   <video width="250" controls src={callout[itemKey]} />
                   </div>
                  )
                }
                  return (
                      <ListGroupItem>
                          <span style={{fontWeight: "bold"}}>{itemKey.split("_").map(value => value.charAt(0).toUpperCase() + value.slice(1)).join(" ")}:</span> {callout[itemKey] ? callout[itemKey] : "N/A"}
                      </ListGroupItem>
                  )
              }
              })}
            </ListGroup>
        </TabPane>
        <TabPane tabId='4'>
        <h1>Schedule Details</h1>
            <ListGroup flush>
            {schedule && Object.keys(schedule).map(itemKey => {
              if (!(["__typename"].includes(itemKey))) {
                  return (
                      <ListGroupItem>
                          <span style={{fontWeight: "bold"}}>{itemKey.split("_").map(value => value.charAt(0).toUpperCase() + value.slice(1)).join(" ")}:</span> {schedule[itemKey] ? schedule[itemKey] : "N/A"}
                      </ListGroupItem>
                  )
              }
              })}
            </ListGroup>
        </TabPane>
      </TabContent>
    </div>
  )
}
export default TabsVerticalLeft
