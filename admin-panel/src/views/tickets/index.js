// ** React Imports
import { Fragment } from 'react'


// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Tables
// import TableExpandable from './TableExpandable'
import TableZeroConfig from './TableZeroConfig'
// import TableWithButtons from './TableWithButtons'
// import TableMultilingual from './TableMultilingual'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Tables = () => {
  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          <TableZeroConfig />
        </Col>
        {/* <Col sm='12'>
          <TableWithButtons />
        </Col>
        <Col sm='12'>
          <TableExpandable />
        </Col>
        <Col sm='12'>
          <TableMultilingual />
        </Col> */}
      </Row>
    </Fragment>
  )
}

export default Tables
