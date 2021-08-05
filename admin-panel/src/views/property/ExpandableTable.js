
import AppCollapse from '@components/app-collapse'
import {
    Card,
    CardTitle,
    CardBody,
    CardText,
    CardSubtitle,
    CardLink,
    CardImg,
    ListGroup,
    ListGroupItem,
    Button,
    Col
    } from 'reactstrap'

  import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

import { Home, Edit, ChevronDown, Plus, Trash, Eye, EyeOff, Edit3, Upload, Loader, Check } from 'react-feather'

const CollapseDefault = ({data}) => <AppCollapse data={data} type='border' />

const RowContent = ({data: prop, openModalAlert, count}) => (
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
  <div className="d-flex justify-content-center">
  <Button className='mx-2' color='danger' onClick={() => { openModalAlert(prop.property.id) }} size="sm">
    <span className='align-middle mr-50'>Delete</span>
    <Trash size={15} />
  </Button>
  <Button color='primary' className="mx-2" onClick={() => handleModal(row)} size="sm">
  <span className='align-middle mr-50'>Edit</span>
    <Edit size={15} />
  </Button>
  </div>
</div>
)

export const ExpandableTable = ({ data, openModalAlert }) => {
    const property_owneds = data.property_owneds
    const prop_count = property_owneds.length
    const property_owneds_modified = prop_count !== 0 ? property_owneds.map((prop, i) => (
        {
            title: `Property id: ${prop.property.id}`,
            content: (
              <RowContent data={prop} openModalAlert={openModalAlert} count={property_owneds.length}/>
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
      <div className='expandable-content px-2 pt-3'>
        {/* <Col lg="3">
        {prop_count > 0 && <StatsHorizontal icon={<Home size={21} />} color='primary' stats={prop_count} statTitle='Properties' />}
        </Col> */}
        <Card className='col col-5 mb-0 pb-2'>
           <CollapseDefault data={property_owneds_modified} />
        </Card>
      </div>
    )
  }