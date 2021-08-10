import { useState } from 'react'
import AppCollapse from '@components/app-collapse'
import { TabContent, TabPane, Nav, NavItem, NavLink, ListGroup, ListGroupItem, Card, Col, Row, Button  } from 'reactstrap'
import Rooms from './Rooms'

const TabsVerticalLeft = ({item, allProperty}) => {
  const [active, setActive] = useState("1")
  const [loading, setLoading] = useState(true)
  console.log(item)
  console.log(allProperty)
  if (allProperty?.client) {
    item = {...item, ...allProperty}
  }
  console.log(item)
  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const RowContent = ({data: prop}) => (
    <div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>ID: </h5> 
      <h6 className='mb-1 ml-1'>{prop.id}</h6>
    </div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Full Name: </h5>
      <h6 className='mb-1 ml-1'>{prop.full_name}</h6>
    </div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Account Type: </h5>
      <h6 className='mb-1 ml-1'>{prop.account_type}</h6>
    </div>
  </div>
  )

  const CollapseDefault = ({data}) => <AppCollapse data={data} type='border' />
  

  const client = item?.client //array
  const inventory_rooms = item?.inventory_rooms //array
  const property = item?.property
  const approve = item?.approved === 0 ? "Unapproved" : "Approved"
  const client_modified = allProperty?.client ? client.map((prop, i) => (
    {
        title: `Client email: ${prop.email}`,
        content: (
          <RowContent data={prop} count={client.length}/>
        )
      }
)) : [
    {
    title: `No data Available`,
    content: (
      <div>
    </div>
    )
  }
]

  const ItemValue = ({item, itemKey}) => (
    <ListGroupItem>
    <span style={{fontWeight: "bold"}}>
      {itemKey.split("_").map(value => value.charAt(0).toUpperCase() + value.slice(1)).join(" ")}: </span> 
      {item[itemKey] ? item[itemKey] : "N/A"}
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
            Client Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Property Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
          >
            Inventory Rooms
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
        <h1 className="mb-1">Client Details</h1>
        <CollapseDefault data={client_modified} />
        </TabPane>
        <TabPane tabId='2'>
        <h1 className="mb-1">Property Details</h1>
        <ListGroup flush>
            {property && Object.keys(property).map(itemKey => {
              if ((!["__typename"].includes(itemKey))) {     
                  return (
                    <ItemValue item={property} itemKey={itemKey} />
                )                        
              }
              })}
            </ListGroup>
        </TabPane>
        <TabPane tabId='3'>
          <div className="d-flex align-items-center mb-1">
          <h1 className="mr-2 mb-0">Inventory Rooms</h1>
          {approve === "Approved" ? <Button
          color="info"
          // outline
          className="btn"
          size="lg"
          onClick={() => {
            // handleDeletePlan(row);
          }}
          >
          <span className="align-middle ml-25">Approve</span>
        </Button> : <Button color="danger" className="btn" size="lg"
            onClick={() => {
              // handleDeletePlan(row);
            }}
            >
            <span className="align-middle ml-25">Unapprove</span>
          </Button>
        }
          
          </div>
          <h6>Approved Status: {approve}</h6>
          <h6>Room count: {inventory_rooms.length}</h6>
        <Row className='m-2'>
        {inventory_rooms && inventory_rooms.length === 0 ? <div>No Rooms</div> : inventory_rooms.map((items, i) => (
          <Col md={`${inventory_rooms.length > 2 ? '4' : ''}`}>
          <Rooms inventory_articles={items.inventory_articles} inventory_pictures={items.inventory_pictures} title={items.room} index={(i + 1)}/>
          </Col>
        ))}
        </Row>
        <div>
        </div>
        {/* <ListGroup flush>
            {client && Object.keys(client).map(itemKey => {
              if ((![""].includes(itemKey))) {     
                  return (
                    <ItemValue item={client} itemKey={itemKey} />
                )                        
              }
              })}
            </ListGroup> */}
        </TabPane>
      </TabContent>
    </div>
  )
}
export default TabsVerticalLeft
