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
import CustomInput from 'reactstrap/lib/CustomInput'

const AddNewModal = ({ open, changeLeader, setChangeLeader, handleModal, row, setRow, closeModal, handleUpdate}) => {

    // ** Custom close btn
    // const { colors } = useContext(ThemeColors)
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={closeModal} />   

  const emergencyOptions = [
    { value: true, label: 'Emergency'},
    { value: false, label: 'Not Urgent' }
  ]

  const handleSelectedChange = (e, name) => {
    const rowValue = {...row}
    rowValue[name] = e.value.toLowercase()
    setRow(rowValue)
}

  const handleSubmit = () => {
      handleUpdate(row)
  }

  const color = row?.teams?.[0]?.team_color ?? row?.teams_member?.team_color
  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className='sidebar-sm'
      modalClassName='modal-center'
      contentClassName='pt-0'
    >
      <ModalHeader className='' toggle={handleModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>Edit Team Member</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
      {<h3>Make team member a leader for team <span style={{color: row?.teams_member?.team_color}}>{row?.teams_member?.team_color}</span></h3>}
      <h4 className="text-danger">Please note the current team leader will then become a team member</h4>
      <FormGroup>
        <CustomInput inline className='custom-control-Primary' type='checkbox' id='blocked' onClick={ () => setChangeLeader(true) } label='Make team leader?' checked={changeLeader} />
      </FormGroup>    
      <Button className='mr-1' color='primary' onClick={handleSubmit} >
        Update
      </Button>
      <Button color='secondary' onClick={closeModal} outline>
        Cancel
      </Button>
    </ModalBody>
    </Modal>
  )
}

export default AddNewModal
