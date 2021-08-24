
// ** React Imports
import { Fragment, useState } from 'react'

// ** Third Party Components
import { Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

// ** Tables
import Client from './TableAdvSearch'
import CheckContract from './CheckContract'

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
            Clients
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Check Contract
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className='py-50' activeTab={active}>
        <TabPane tabId='1'>
          <Row>
            <Col sm='12'>
              <Client />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId='2'>
          <Row>
            <Col sm='12'>
              <CheckContract />
            </Col>
          </Row>
        </TabPane>
        </TabContent>
    </Fragment>
  )
}

export default Tables