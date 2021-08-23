
import AppCollapse from '@components/app-collapse'
import {
    Card,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    Input,
    Label,
    CustomInput
    } from 'reactstrap'

  import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
  import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client"

import { Home, Edit, ChevronDown, Plus, Trash, Eye, EyeOff, Edit3, Upload, Loader, Check, Info } from 'react-feather'
import { useState } from 'react'
import ModalFooter from 'reactstrap/lib/ModalFooter'
import TabsVerticalLeft from './TabsVerticalLeft'
import Spinner from 'reactstrap/lib/Spinner'

const GET_PROPERTIES = gql`
query GetProperties($id: Int = 1) {
  property_owned(where: {property_id: {_eq: $id}}) {
    client {
      id
      full_name
      phone
      email
      account_type
      active
    }
  }
  lease(where: {property_id: {_eq: $id}}) {
    client {
      id
      full_name
      phone
      email
      account_type
      active
    }
  }
  management_report(where: {property_id: {_eq: $id}}) {
    id
    report_location
    report_upload_date
  }
  market_report(where: {property_id: {_eq: $id}}) {
    id
    report_location
    report_upload_date
  }
  monthly_services_report(where: {property_id: {_eq: $id}}) {
    id
    report_location
    report_upload_date
  }
  material_warranty_report(where: {property_id: {_eq: $id}}) {
    id
    report_location
    report_upload_date
  }
}
`

//Overlay component
const Overlay = ({setLoaderButton, loaderButton, setLoading}) => {
  return (
<div style={{
    position: "fixed",
    display: "block",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10
}}>
  <div style={{
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)"
  }}>
      <Spinner color='primary' />
      {loaderButton && <div className="d-flex flex-column align-items-center mt-2">
        <h6 className="text-primary">Hmmm it is taking longer than expected</h6>
        <Button color='secondary' className="mt-2" onClick={ () => { setLoaderButton(false); setLoading(false) }}>Go back</Button>
        </div>}
    </div>
  </div>
  )
}

const CollapseDefault = ({data}) => <AppCollapse data={data} type='border' />

const RowContent = ({data: prop, openModalAlert, count, setModalDetails, handleDetailsModal, loading, setLoading}) => {
  const [getProps, { loading: propertyLoading, data: propertyData, error }] = useLazyQuery(GET_PROPERTIES)
  const [open2, setopen2] = useState(false)
  const handlePropertyDetailsModal = () => {
    setopen2(!open2)
  }
return (
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
  {/* <Button className='mx-2' color='danger' onClick={() => { openModalAlert(prop.property.id) }} size="sm">
    <span className='align-middle mr-50'>Delete</span>
    <Trash size={15} />
  </Button> */}
  <Button color='primary' className="mx-2" onClick={() => { setModalDetails(prop.property); handleDetailsModal() }} size="sm">
  <span className='align-middle mr-50'>Edit</span>
    <Edit size={15} />
  </Button>
  <Button color='info' className="mx-2" onClick={() => { getProps({variables: {id: prop.property.id}}); handlePropertyDetailsModal() }} size="sm">
  <span className='align-middle mr-50'>View Details</span>
    <Info size={15} />
  </Button>
  </div>
  <div className='vertically-centered-modal'>
    <Modal isOpen={open2} toggle={handlePropertyDetailsModal} className='modal-dialog-centered modal-xl'>
      <ModalHeader className="d-flex justify-content-center" toggle={handlePropertyDetailsModal}>Property Details</ModalHeader>
      <ModalBody>
        <TabsVerticalLeft data={propertyData} propertyLoading={propertyLoading} property_id={prop.property.id} GET_PROPERTIES={GET_PROPERTIES}/>
      </ModalBody>
      <ModalFooter>
      <Button color='secondary' onClick={handlePropertyDetailsModal} outline>
        Cancel
      </Button>
      </ModalFooter>
    </Modal>
  </div>
</div>
)
}

export const ExpandableTable = ({ data, openModalAlert, handleUpdate }) => {
  const [open, setopen] = useState(false)
  const [modalDetails, setModalDetails] = useState(null)
  const [assigned, setAssigned] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loaderButton, setLoaderButton] = useState(false)

  const handleDetailsModal = () => {
    setopen(!open)
  }

  const handleChange = (e) => {
    const rowValue = {...modalDetails}
    rowValue[e.target.name] = e.target.value
    setModalDetails(rowValue)
  }

  const handleSubmit = async () => {
      setLoading(true)
      await handleUpdate(modalDetails, assigned, data)
      setLoading(false)
      handleDetailsModal()
      setModalDetails(null)
  }
    const property_owneds = data.property_owneds
    const prop_count = property_owneds.length
    const property_owneds_modified = prop_count !== 0 ? property_owneds.map((prop, i) => (
        {
            title: `Property id: ${prop.property.id} Address: ${prop.property.address}`,
            content: (
              <RowContent data={prop} openModalAlert={openModalAlert} count={property_owneds.length} setModalDetails={setModalDetails} handleDetailsModal={handleDetailsModal} loading={loading} setLoading={setLoading} loaderButton={loaderButton} setLoaderButton={setLoaderButton} />
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
    return (
      <div className='expandable-content px-2 pt-3'>        
        {/* <Col lg="3">
        {prop_count > 0 && <StatsHorizontal icon={<Home size={21} />} color='primary' stats={prop_count} statTitle='Properties' />}
        </Col> */}
        <Card>
           <CollapseDefault data={property_owneds_modified} />
        </Card>
        {loading ? <Overlay loading={loading} setLoading={setLoading} loaderButton={loaderButton} setLoaderButton={setLoaderButton} /> : <Modal
      isOpen={open}
      toggle={handleDetailsModal}
      className='sidebar-sm'
      modalClassName='modal-slide-in'
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-3' toggle={handleDetailsModal} tag='div'>
        <h5 className='modal-title'>Edit Property</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
      <FormGroup>
        <Label for='id'>Property Id</Label>
          <Input id='id' placeholder='ID' name="id" value={modalDetails?.id} disabled />
      </FormGroup>
      <FormGroup>
        <Label for='country'>Country</Label>
          <Input type='country' name="country" id='country' placeholder='country' value={modalDetails?.country} onChange={handleChange}/>
      </FormGroup>
      <FormGroup>
        <Label for='city'>City</Label>
          <Input type='city' name="city" id='city' placeholder='City' value={modalDetails?.city} onChange={handleChange}/>
      </FormGroup> 
      <FormGroup>
        <Label for='community'>Community</Label>
          <Input type='community' name="community" id='community' placeholder='community' value={modalDetails?.community} onChange={handleChange}/>
      </FormGroup>
      <FormGroup>
        <Label for='address'>Address</Label>
          <Input type='address' name="address" id='address' placeholder='address' value={modalDetails?.address} onChange={handleChange}/>
      </FormGroup>
      <FormGroup>
        <CustomInput inline className='custom-control-Primary' type='checkbox' id='blocked'  onChange={() => setAssigned(!assigned)} label='Unassign this property?' checked={assigned} />
      </FormGroup>
      <Button className='mr-1' color='primary' onClick={handleSubmit} >
        Update
      </Button>
      <Button color='secondary' onClick={handleDetailsModal} outline>
        Cancel
      </Button>
    </ModalBody>
    </Modal>}
      </div>
    )
  }