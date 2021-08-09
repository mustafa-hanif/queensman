
// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Tables
import TableAdvSearch from './TableAdvSearch'

const Tables = () => {
  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          <TableAdvSearch />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Tables