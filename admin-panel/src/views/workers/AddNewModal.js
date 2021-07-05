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

const AddNewModal = ({ open, handleModal, row, setRow, closeModal, handleUpdate, toAddNewRecord, handleAddRecord}) => {

    // ** Custom close btn
    // const { colors } = useContext(ThemeColors)
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={closeModal} />   

  const activeOptions = [
    { value: 1, label: 'Active'},
    { value: 0, label: 'Not Active' }
  ]

  const emergencyOptions = [
    { value: true, label: 'Emergency'},
    { value: false, label: 'Not Urgent' }
  ]

  const colorOptions = [
    {value: '34eb40', label: 'Green'},
    {value: 'c21dd1', label: 'Purple'},
    {value: 'ebcf34', label: 'Yellow'},
    {value: '3440eb', label: 'Dark Blue'},
    {value: 'd11d1d', label: 'Red'},
    {value: 'info', label: 'Light Blue'}
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
    if (toAddNewRecord) {
      handleAddRecord(row)
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
        <h5 className='modal-title'>{toAddNewRecord ? 'New Record' : 'Update Record'}</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
      <FormGroup>
        <Label for='full-name'>Full Name</Label>
        <InputGroup>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input id='full-name' placeholder='Bruce Wayne' name="full_name" value={row?.full_name} onChange={handleChange}/>
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Label for='email'>Email</Label>
        <InputGroup>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>
              <Mail size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input type='email' name="email" id='email' placeholder='brucewayne@email.com' value={row?.email} onChange={handleChange}/>
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
          <Input id='description' placeholder='Web Developer' name="description" value={row?.description} onChange={handleChange}/>
        </InputGroup>
      </FormGroup>   
      <FormGroup>
        <Label for='phone'>Phone</Label>
        <InputGroup>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>
              <Phone size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input id='phone' placeholder='Phone' name="phone" value={row?.phone} onChange={handleChange}/>
        </InputGroup>
      </FormGroup>
      <FormGroup>
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
      </FormGroup>     
      <Button className='mr-1' color='primary' onClick={handleSubmit} >
        {toAddNewRecord ? 'Submit' : 'Update'}
      </Button>
      <Button color='secondary' onClick={closeModal} outline>
        Cancel
      </Button>
    </ModalBody>
    </Modal>
  )
}

export default AddNewModal
