
// ** React Imports
import React, { Fragment, useState } from 'react'

// ** Third Party Components
import { Row, Col, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'

// ** Tables
import AllProperty from './AllProperty'
import OwnedProperty from './OwnedProperty'
import LeasedProperty from './LeasedProperty'
import Properties from './Properties'


const Tables = () => {
  const [active, setActive] = useState('1')

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  return (
    <Fragment>
      <Nav tabs>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            All
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Owned
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
          >
            Leased
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '4'}
            onClick={() => {
              toggle('4')
            }}
          >
            Assign Property
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className='py-50' activeTab={active}>
        <TabPane tabId='1'>
        <Row>
        <Col sm='12'>
         <AllProperty />
        </Col>
      </Row>
        </TabPane>
        <TabPane tabId='2'>
        <Row>
        <Col sm='12'>
          <OwnedProperty />
        </Col>
      </Row>
        </TabPane>
        <TabPane tabId='3'>
        <Row>
        <Col sm='12'>
          <LeasedProperty />
        </Col>
      </Row>
        </TabPane>
        <TabPane tabId='4'>
        <Row>
        <Col sm='12'>
          <Properties />
        </Col>
      </Row>
        </TabPane>
      </TabContent>
    </Fragment>
  )
}

export default Tables