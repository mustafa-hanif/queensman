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
      <h6 className='mb-1 ml-1'>{prop.property.address}</h6>
    </div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Country: </h5>
      <h6 className='mb-1 ml-1'>{prop.property.country}</h6>
    </div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>City: </h5>
      <h6 className='mb-1 ml-1'>{prop.property.city}</h6>
    </div>
  </div>
  )

  const CollapseDefault = ({data}) => <AppCollapse data={data} type='border' />

  const property_owneds = item.property_owneds
    const prop_count = property_owneds.length
    const property_owneds_modified = prop_count !== 0 ? property_owneds.map((prop, i) => (
        {
            title: `Property id: ${prop.property.id} Adddress: ${prop.property.address}`,
            content: (
              <RowContent data={prop} count={property_owneds.length}/>
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
    console.log(property_owneds_modified)


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
            Owned Properties
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
          >
            Leased Properties
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
            <h1>Details</h1>
            <h5>Client Details</h5>
            <ListGroup flush>
              {Object.keys(item).map(itemKey => {
              if (!(["property_owneds", "hasPlan"].includes(itemKey))) {
                  return (
                      <ListGroupItem>
                          {itemKey.split("_").map(value => value.charAt(0).toUpperCase() + value.slice(1)).join(" ")}: {item[itemKey] ? item[itemKey] : "N/A"}
                      </ListGroupItem>
                  )
              }
              })}
            </ListGroup>
        </TabPane>
        <TabPane tabId='2'>
        <h1>Owned Properties</h1>
        <div className='expandable-content px-2 pt-3'>
        {/* <Col lg="3">
        {prop_count > 0 && <StatsHorizontal icon={<Home size={21} />} color='primary' stats={prop_count} statTitle='Properties' />}
        </Col> */}
        {/* <Card className='col col-5 mb-0 pb-2'> */}
           <CollapseDefault data={property_owneds_modified} />
          {/* </Card> */}
      </div>
        </TabPane>
        <TabPane tabId='3'>
        <h1>Leased Properties</h1>
          <p>
          No owned property(s) found.
          </p>
        </TabPane>
      </TabContent>
    </div>
  )
}
export default TabsVerticalLeft
