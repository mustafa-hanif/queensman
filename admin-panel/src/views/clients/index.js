// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Tables
// import TableExpandable from './TableExpandable'
import TableZeroConfig from './TableZeroConfig'
// import TableWithButtons from './TableWithButtons'
// import TableMultilingual from './TableMultilingual'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
<<<<<<< HEAD
=======
import { gql, useLazyQuery, useQuery } from "@apollo/client"

const GET_CLIENT = gql`
query GetClient {
  client {
    email
    full_name
    password
  phone
  account_type
  active
    
  }
}
`
function Clients() {
  const [isOpen, setIsOpen] = useState(false)
 
  const togglePopup = () => {
    setIsOpen(!isOpen)
  }
 
  const { loading, error, data } = useQuery(GET_CLIENT)

  if (loading) return 'Loading...'
  if (error) return `Error!-+ ${error.message}`
>>>>>>> d06259588d5957af35786c146399aef3a1a3efb9

const Tables = () => {
  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle='Clients' breadCrumbParent='Home' breadCrumbActive='Clients List' />
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
