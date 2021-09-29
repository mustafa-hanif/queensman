// ** React Imports
import { useState, useContext, Fragment} from 'react'
import Avatar from '@components/avatar'

// ** Third Party Components
import { selectThemeColors } from '@utils'
import { toast } from 'react-toastify'
import { ThemeColors } from '@src/utility/context/ThemeColors'
const bcrypt = require('bcryptjs')
// ** Toast Component
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

import Select from 'react-select'
import { User, Briefcase, Mail, Lock, X, Info, Phone, XCircle, Check} from 'react-feather'
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
  Row,
  Col,
  ModalFooter,
  Label
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { gql, useMutation } from '@apollo/client'
import { useNiceMutation } from '../../utility/Utils'

const updatePasswordGql = gql`mutation UpdatePassword($email: citext = "", $password_hash: String = "") {
  update_auth_accounts(where: {email: {_eq: $email}}, _set: {password_hash: $password_hash}) {
    returning {
      email
    }
  }
}
`

const AddNewModal = ({ open, teamsData, changeColor, setChangedColor, handleModal, row, setRow, closeModal, handleUpdate, toAddNewRecord, handleAddRecord}) => {
  const [updatePassword, { data, loading, error }] = useNiceMutation(updatePasswordGql, { onCompleted: () => {
    toast.success(
      <ToastComponent title="Password Changed" color="success" icon={<Check />} />,
      {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      }
    )
  },
onError: (e) => {
  console.log(e)
    toast.error(
      <ToastComponent title="Could not change password" color="danger" icon={<XCircle />} />,
      {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      }
    )
  }})
  const [modal, setModal] = useState(false)
  const [newPassword, setNewPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
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

  const colorOptions = teamsData?.teams?.map(element => {
    return {value: element.team_color, id: element.id, label: element.team_color.charAt(0).toUpperCase() + element.team_color?.slice(1)}
  })

  const changePassword = (e) => {
    if (!newPassword) {
      return alert("Password cannot be empty")
    }
    setModal(!modal)
    updatePassword({
      variables: {
        email: row?.email,
        password_hash: bcrypt.hashSync(newPassword, 8)
      }
    })
    // update password
    // handleChange(e)
  }


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
  }
  // ** Function to handle Modal toggle
  const openModal = () => {
    setModal(!modal)
  }

  const toggleModal = () => {
    setModal(!modal)
  }
  const color = row?.teams?.[0]?.team_color ?? row?.teams_member?.team_color
  return (
    <>
    <Modal
      isOpen={open}
      toggle={handleModal}
      className='sidebar-sm'
      modalClassName='modal-slide-in'
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-2' toggle={handleModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>{toAddNewRecord ? 'New Record' : 'Update Record'}</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
      {row?.teams?.length > 0 && <h3>Current worker is team leader</h3>}
      <FormGroup>
        <Label for='full-name'>Full Name</Label>
        <InputGroup>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input id='full-name' placeholder='Worker Email' name="full_name" value={row?.full_name} onChange={handleChange} />
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
          <Input type='email' name="email" id='email' placeholder='brucewayne@email.com' value={row?.email} onChange={handleChange}  disabled={!toAddNewRecord}/>
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
          <Input id='description' placeholder='Description' name="description" value={row?.description} onChange={handleChange}/>
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
      {row?.teams?.length > 0 && <FormGroup>
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
      </FormGroup> }
      <FormGroup>
        <Label>Team</Label>
            <Select
                onChange={ (e) => setChangedColor([e.value.toLowerCase(), e.id]) }
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                defaultValue={color ? {value: color?.charAt(0).toUpperCase() + color?.slice(1), label: color?.charAt(0).toUpperCase() + color?.slice(1)} : null}
                options={colorOptions}
                isClearable={false}
            />
      </FormGroup>
      {!toAddNewRecord && <FormGroup>
        <Button color='info' outline className="" onClick={() => openModal()}>Change Password</Button>
      </FormGroup>}    
      <Button className='mr-1' color='primary' onClick={handleSubmit} >
        {toAddNewRecord ? 'Submit' : 'Update'}
      </Button>
      <Button color='secondary' onClick={closeModal} outline>
        Cancel
      </Button>
    </ModalBody>
    </Modal>
          <div className="theme-modal-info">
          <Modal
            isOpen={modal}
            toggle={toggleModal}
            className="modal-dialog-centered"
            modalClassName="modal-info"
          >
            <ModalHeader toggle={toggleModal}>Change Password</ModalHeader>
            <ModalBody>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for='password'>Set New Password</Label>
                    <InputGroup>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <Lock size={15} />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input id='newPassword' placeholder='New Password' name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button
                color="info"
                onClick={() => {
                  const e = { target: { value: confirmPassword, name: "password" } }
                  changePassword(e)
                }}
              >
                Save
              </Button>
              <Button color="secondary" onClick={toggleModal} outline>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
        </>
  )
}

export default AddNewModal
