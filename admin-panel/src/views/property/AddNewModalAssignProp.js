// ** React Imports
import { useState, useContext, Fragment} from 'react'

// ** Third Party Components
import { useForm } from 'react-hook-form'
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import { toast } from 'react-toastify'
import Avatar from '@components/avatar'
import { ThemeColors } from '@src/utility/context/ThemeColors'

import Select from 'react-select'
import { User, Briefcase, Mail, Lock, X, Info, Phone, Calendar} from 'react-feather'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Label,
  Form,
  Row,
  Col
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { element } from 'prop-types'

const ToastComponent = ({ title, icon, color }) => (
  <Fragment>
    <div className='toastify-header pb-0'>
      <div className='title-wrapper'>
        <Avatar size='sm' color={color} icon={icon} />
        <h6 className='toast-title'>{title}</h6>
      </div>
    </div>
  </Fragment>
)

const AddNewModal = ({ 
  toAssignNewRecord, 
  data, 
  open, 
  handleModal, 
  row, 
  setRow, 
  closeModal, 
  handleUpdate, 
  toAddNewRecord, 
  handleAddRecord, 
  handleAssignClient,
  clientOwnedArray,
  setclientOwnedArray,
  clientLeasedArray,
  setclientLeasedArray,
  lease_start_date,
  setLease_start_date,
  lease_end_date,
  setLease_end_date
}) => {

  const clientOptions = data?.map(client => ({value: client.id, label: `${client.full_name} (${client.email})`, ownedPropID: client?.property_owneds?.map(prop => (prop.property_id)), leasedPropID: client?.leases?.map(prop => (prop.property_id))}))
  const activeOptions = [
    { value: 1, label: 'Active'},
    { value: 0, label: 'Not Active' }
  ]

  const emergencyOptions = [
    { value: true, label: 'Emergency'},
    { value: false, label: 'Not Urgent' }
  ]

  const handleChange = (e) => {
      const rowValue = {...row}
      rowValue[e.target.name] = e.target.value
      setRow(rowValue)
  }

  const handleSelectedChange = (e, name) => {
    const rowValue = {...row}
    rowValue[name] = e.value
    setRow(rowValue)
}

const onSubmit = async () => {
  // setRow(row)
  const sameValue = clientOwnedArray.map(element => clientLeasedArray.some(element2 => element2.value === element.value))  
  if (sameValue[0]) {
    return toast.error(<ToastComponent title='Owned and Leased client names cannot be same' color='danger' icon={<Info />} />, {
      autoClose: 10000,
      hideProgressBar: true,
      closeButton: false
    })
  }
  if (toAssignNewRecord && (clientOwnedArray.length === 0 && clientLeasedArray.length === 0)) {
    return toast.error(<ToastComponent title='Client Field cannot be empty' color='danger' icon={<Info />} />, {
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false
    })
  } 
  if (clientOwnedArray.some(element => element.ownedPropID.includes(row.id))) {
    return toast.error(<ToastComponent title='Client already has property' color='danger' icon={<Info />} />, {
      autoClose: 10000,
      hideProgressBar: true,
      closeButton: false
    })
  }
  if (clientLeasedArray.some(element => element.leasedPropID.includes(row.id))) {
    return toast.error(<ToastComponent title='Client already has leased property' color='danger' icon={<Info />} />, {
      autoClose: 10000,
      hideProgressBar: true,
      closeButton: false
    })
  }
    if (toAddNewRecord) {
      await handleAddRecord(row, clientOwnedArray, clientLeasedArray, lease_start_date, lease_end_date)
      setclientOwnedArray([])
      setclientLeasedArray([])
    } else if (toAssignNewRecord) {
      await handleAssignClient(row, clientOwnedArray, clientLeasedArray, lease_start_date, lease_end_date)
      setclientOwnedArray([])
      setclientLeasedArray([])
    } else {
      handleUpdate(row)
    }
    setRow(null)
  
  
}

const { register, errors, handleSubmit } = useForm()


  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className='modal-dialog-centered modal-xl'
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-3' toggle={handleModal} tag='div'>
        <h5 className='modal-title'>{ (toAddNewRecord || toAssignNewRecord) ? 'New Record' : 'Update Record'}</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
        <Col>
      <FormGroup>
        <Label for='id'>ID</Label>
          <Input id='id' placeholder='ID' name="id" value={row?.id} disabled />
      </FormGroup>
      </Col>
      <Col>
      {toAssignNewRecord ? <FormGroup>
        <Label for='country'>Country</Label>
          <Input id='country' placeholder='Enter Country here' name="country" value={row?.country} disabled />
      </FormGroup> : <FormGroup>
        <Label for='country'>Country<span style={{color: "Red"}}> *</span></Label>
          <Input id='country' placeholder='Enter Country here' name="country" value={row?.country} onChange={handleChange}   
          innerRef={register({ required: true })}
          invalid={errors.country && true}/>
      </FormGroup>}
      </Col>
      <Col>
      {toAssignNewRecord ? <FormGroup>
        <Label for='city'>City</Label>
          <Input id='city' placeholder='Enter City here' name="city" value={row?.city} disabled />
      </FormGroup> : <FormGroup>
        <Label for='city'>City<span style={{color: "Red"}}> *</span></Label>
          <Input id='city' placeholder='Enter City here' name="city" value={row?.city} onChange={handleChange}   
          innerRef={register({ required: true })}
          invalid={errors.city && true}/>
      </FormGroup>}
      </Col>
      </Row>
      {/* Second row */}
      <Row>
        <Col>
        {toAssignNewRecord ? <FormGroup>
        <Label for='community'>Community</Label>
          <Input id='community' placeholder='Enter Community here' name="community" value={row?.community} disabled />
      </FormGroup> : <FormGroup>
        <Label for='community'>Community<span style={{color: "Red"}}> *</span></Label>
          <Input community='community' placeholder='Enter Community here' name="community" value={row?.community} onChange={handleChange}
          innerRef={register({ required: true })}
          invalid={errors.community && true}
          />
      </FormGroup>}
      </Col>
      <Col>
      {toAssignNewRecord ? <FormGroup>
        <Label for='address'>Address</Label>
          <Input id='address' placeholder='Enter Address here' name="address" value={row?.address} disabled />
      </FormGroup> : <FormGroup>
        <Label for='address'>Address<span style={{color: "Red"}}> *</span></Label>
          <Input id='address' placeholder='Enter Address here' name="address" value={row?.address} onChange={handleChange}   
          innerRef={register({ required: true })}
          invalid={errors.address && true}/>
      </FormGroup>}
      
      </Col>
      <Col>
      {toAssignNewRecord ? <FormGroup>
        <Label for='type'>Property Type</Label>
          <Input id='type' placeholder='Enter Property Type here' name="type" value={row?.type} disabled />
      </FormGroup> : <FormGroup>
        <Label for='type'>Property Type</Label>
          <Input id='type' placeholder='Enter Property type here' name="type" value={row?.type} onChange={handleChange} />
      </FormGroup>}
      </Col>
      </Row>
      {/* Third Row */}
      <Row>
        <Col>
        {toAssignNewRecord ? <FormGroup>
        <Label for='comments'>Comments</Label>
          <Input id='comments' placeholder='Enter Property comments here' name="comments" value={row?.comments} disabled />
      </FormGroup> : <FormGroup>
        <Label for='comments'>Comments</Label>
          <Input id='comments' placeholder='Enter Property comments here' name="comments" value={row?.comments} onChange={handleChange} />
      </FormGroup>}
      </Col>
      <Col>
      </Col>
      <Col>
      </Col>
      </Row>
      {/* Fourth row */}
      <Row>
      <Col sm="3">
      <FormGroup>
        <Label for='owned'>Property Owned</Label>
          <Input id='owned' placeholder='Owned' name="owned" disabled />
      </FormGroup>
      </Col>
      <Col sm="9">
      {toAssignNewRecord ? <FormGroup>
      <Label>Client Name<span style={{color: "Red"}}> *</span></Label>
          <Select
              isClearable={false}
              theme={selectThemeColors}
              defaultValue={clientOwnedArray}
              isMulti
              name='clientOwned'
              onChange={(e) => setclientOwnedArray(e)}
              options={clientOptions}
              className='react-select'
              classNamePrefix='select'
            />
      </FormGroup> : <FormGroup>
      <Label>Client Name</Label>
          <Select
              isClearable={false}
              theme={selectThemeColors}
              defaultValue={clientOwnedArray}
              isMulti
              name='clientOwned'
              onChange={(e) => setclientOwnedArray(e)}
              options={clientOptions}
              className='react-select'
              classNamePrefix='select'
            />
      </FormGroup>}
      </Col>
      </Row>
      {/* Fifth Row */}
      <Row>
      <Col sm="3">
      <FormGroup>
        <Label for='leased'>Property Leased</Label>
          <Input id='leased' placeholder='Leased' name="leased" onChange={handleChange} disabled />
      </FormGroup>
      </Col>
      <Col sm="9">
      {toAssignNewRecord ? <FormGroup>
      <Label>Client Name<span style={{color: "Red"}}> *</span></Label>
          <Select
              isClearable={false}
              theme={selectThemeColors}
              defaultValue={clientLeasedArray}
              isMulti
              name='clientLeased'
              onChange={(e) => setclientLeasedArray(e)}
              options={clientOptions}
              className='react-select'
              classNamePrefix='select'
            />
      </FormGroup> : <FormGroup>
      <Label>Client Name</Label>
          <Select
              isClearable={false}
              theme={selectThemeColors}
              defaultValue={clientLeasedArray}
              isMulti
              name='clientLeased'
              onChange={(e) => setclientLeasedArray(e)}
              options={clientOptions}
              className='react-select'
              classNamePrefix='select'
            />
      </FormGroup>}
      </Col>
      </Row>
      {/* Sixth Row */}
      {clientLeasedArray.length > 0 ? <Row>
        <Col>
        <FormGroup>
        <Label for='lease_start_date'>Lease Start Date<span style={{color: "Red"}}> *</span></Label>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Calendar size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Flatpickr
               required
               id='lease_start_date'
                //tag={Flatpickr}
               name='lease_start_date'
               className='form-control'
               onChange={(date, dateStr, instance) => {
                setLease_start_date(dateStr)
                
               }}
               value={lease_start_date}
               options={{
                 dateFormat: 'Y-m-d'
               }}
               placeholder='Lease Start Date'
             />
            {/* <Input id='contract_start_date' placeholder='Contract Start Date' name="contract_start_date" value={row?.contract_start_date} onChange={handleChange}/> */}
          </InputGroup>
        </FormGroup>
        </Col>
        <Col>
        <FormGroup>
        <Label for='lease_end_date'>Lease End Date<span style={{color: "Red"}}> *</span></Label>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Calendar size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Flatpickr
               required
               id='lease_end_date'
                //tag={Flatpickr}
               name='lease_end_date'
               className='form-control'
               onChange={(date, dateStr, instance) => {
                setLease_end_date(dateStr)
               }}
               value={lease_end_date}
               options={{
                 dateFormat: 'Y-m-d'
               }}
               placeholder='Contract End Date'
             />
            {/* <Input id='contract_end_date' placeholder='Contract End Date' name="contract_end_date" value={row?.contract_end_date} onChange={handleChange}/> */}
          </InputGroup>
        </FormGroup>
        </Col>
      </Row> : <Row>
        <Col>
        <FormGroup>
        <Label for='lease_start_date'>Lease Start Date</Label>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Calendar size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Flatpickr
               id='lease_start_date'
                //tag={Flatpickr}
               name='lease_start_date'
               className='form-control'
               onChange={(date, dateStr, instance) => {
                setLease_start_date(dateStr)
                
               }}
               value={lease_start_date}
               options={{
                 dateFormat: 'Y-m-d'
               }}
               placeholder='Lease Start Date'
             />
            {/* <Input id='contract_start_date' placeholder='Contract Start Date' name="contract_start_date" value={row?.contract_start_date} onChange={handleChange}/> */}
          </InputGroup>
        </FormGroup>
        </Col>
        <Col>
        <FormGroup>
        <Label for='lease_end_date'>Lease End Date</Label>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Calendar size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Flatpickr
               id='lease_end_date'
                //tag={Flatpickr}
               name='lease_end_date'
               className='form-control'
               onChange={(date, dateStr, instance) => {
                setLease_end_date(dateStr)
               }}
               value={lease_end_date}
               options={{
                 dateFormat: 'Y-m-d'
               }}
               placeholder='Contract End Date'
             />
            {/* <Input id='contract_end_date' placeholder='Contract End Date' name="contract_end_date" value={row?.contract_end_date} onChange={handleChange}/> */}
          </InputGroup>
        </FormGroup>
        </Col>
      </Row> }
      <div className="row justify-content-center">
      <Button className='mr-1' color='primary' type="submit" >
        {(toAddNewRecord || toAssignNewRecord) ? 'Submit' : 'Update'}
      </Button>
      <Button color='secondary' onClick={closeModal} outline>
        Cancel
      </Button>
      </div> 
      </Form>
    </ModalBody>
    </Modal>
  )
}

export default AddNewModal
