// ** React Imports
import { useState, useContext} from 'react'

// ** Third Party Components
import { selectThemeColors } from '@utils'
import { ThemeColors } from '@src/utility/context/ThemeColors'

import Select from 'react-select'
import { User, Briefcase, Mail, Lock, X, Info, Phone} from 'react-feather'
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
  Label
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

const AddNewModal = ({ open, handleModal, row, setRow, closeModal, handleUpdate, toAddNewJobTicket, handleAddJobTicket}) => {

    // ** Custom close btn
    // const { colors } = useContext(ThemeColors)
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={closeModal} />   

  const options = [
    {value: 'Deffered', label: 'Deffered'},
    {value: 'Material Request', label: 'Material Request'},
    {value: 'Patch Job', label: 'Patch Job'},
    {value: 'Full Job', label: 'Full Job'}
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

  const handleSubmit = () => {
    if (toAddNewJobTicket) {
      handleAddJobTicket(row)
    } else {
      handleUpdate(row)
    }
    setRow(null)
  }


  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className='sidebar-sm'
      modalClassName='modal-slide-in'
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-3' toggle={handleModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>{toAddNewJobTicket ? 'New Record' : 'Update Record'}</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
      <FormGroup>
        <Label for='name'>Full Name</Label>
        <InputGroup>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input id='name' placeholder='Bruce Wayne' name="name" value={row?.name} onChange={handleChange}/>
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Label for='worker_email'>Email</Label>
        <InputGroup>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>
              <Mail size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input type='email' name="worker_email" id='worker_email' placeholder='brucewayne@email.com' value={row?.worker_email} onChange={handleChange}/>
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Label for='description'>Description</Label>
        <InputGroup>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>
              <Briefcase size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input id='description' placeholder='Web Developer' type="textarea" name="description" value={row?.description} onChange={handleChange}/>
        </InputGroup>
      </FormGroup>   
      <FormGroup>
        <Label>Type</Label>
            <Select
                onChange={ (e) => handleSelectedChange(e, 'type')}
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                defaultValue={{value: row?.type, label: row?.type ? row.type : "Deffered"}}
                options={options}
                isClearable={false}
            />
      </FormGroup>
      {/* <FormGroup>
        <Label>Active</Label>
            <Select
                onChange={ (e) => handleSelectedChange(e, 'active')}
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                defaultValue={{value: row?.active, label: row?.active === 1 ? "Active" : "Not Active"}}
                options={activeOptions}
                isClearable={false}
            />
      </FormGroup>
      <FormGroup>
        <Label>Emergency</Label>
            <Select
                onChange={ (e) => handleSelectedChange(e, 'isEmergency')}
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                defaultValue={{value: row?.isEmergency, label: row?.isEmergency ? "Emergency" : "Not Urgent"}}
                options={emergencyOptions}
                isClearable={false}
            />
      </FormGroup>
      <FormGroup>
        <Label>Team</Label>
            <Select
                onChange={ (e) => handleSelectedChange(e, 'color_code')}
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                defaultValue={{value: row?.color_code, label: row?.color_code ? "Blue" : "Green"}}
                options={colorOptions}
                isClearable={false}
            />
      </FormGroup>
      <FormGroup>
        <Label for='password'>Password</Label>
        <InputGroup>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>
              <Lock size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input id='password' placeholder='Password' name="password" value={row?.password} onChange={handleChange}/>
        </InputGroup>
      </FormGroup>      */}
      <Button className='mr-1' color='primary' onClick={handleSubmit} >
        {toAddNewJobTicket ? 'Submit' : 'Update'}
      </Button>
      <Button color='secondary' onClick={closeModal} outline>
        Cancel
      </Button>
    </ModalBody>
    </Modal>
  )
}

export default AddNewModal
