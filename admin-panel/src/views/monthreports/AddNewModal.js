// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import { User, Briefcase, Mail, Calendar, DollarSign, X, Key} from 'react-feather'
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

const AddNewModal = ({ open, handleModal, row, setRow, closeModal, handleUpdate}) => {

    // ** Custom close btn
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={closeModal} />

  const handleChange = (e) => {
    const rowValue = {...row}
    rowValue[e.target.name] = e.target.value
    setRow(rowValue)
  }

  const handleSubmit = () => {
    // setRow(row)
    handleUpdate(row)
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
        <h5 className='modal-title'>New Record</h5>
      </ModalHeader>
      {row ? <ModalBody className='flex-grow-1'>
      <FormGroup>
        <Label for='full-name'>Full Name</Label>
        <InputGroup>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input id='full-name' placeholder='Bruce Wayne' name="full_name" value={row.full_name} onChange={handleChange}/>
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
          <Input type='email' name="email" id='email' placeholder='brucewayne@email.com' value={row.email} onChange={handleChange}/>
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Label for='occupation'>Occupation</Label>
        <InputGroup>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>
              <Briefcase size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input id='occupation' placeholder='Web Developer' name="occupation" value={row.occupation} onChange={handleChange}/>
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Label for='organization'>Organization</Label>
        <InputGroup>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>
              <Briefcase size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input id='organization' placeholder='Etisilat' name="organization" value={row.organization} onChange={handleChange}/>
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Label for='gender'>Gender</Label>
        <InputGroup>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>
              <Key size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input id='gender' placeholder='Male' name="gender" value={row.gender} onChange={handleChange}/>
        </InputGroup>
      </FormGroup>        
      <Button className='mr-1' color='primary' onClick={handleSubmit}>
        Submit
      </Button>
      <Button color='secondary' onClick={closeModal} outline>
        Cancel
      </Button>
    </ModalBody> : <></>}
    </Modal>
  )
}

export default AddNewModal