// ** React Imports
import { useState } from 'react'
import { toast } from "react-toastify"
import Avatar from "@components/avatar"
const bcrypt = require('bcryptjs')
// ** Third Party Components
import moment from 'moment'
import Flatpickr from 'react-flatpickr'
import { useForm } from 'react-hook-form'
import { User, XCircle, Check, Mail, Lock, X, Key, Phone, Code, Info, Calendar } from 'react-feather'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Label,
  Row,
  Col,
  ModalFooter
} from 'reactstrap'

import { selectThemeColors } from '@utils'
import Select from 'react-select'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { gql, useMutation } from '@apollo/client'

const updatePasswordGql = gql`mutation UpdatePassword($email: citext = "", $password_hash: String = "") {
  update_auth_accounts(where: {email: {_eq: $email}}, _set: {password_hash: $password_hash}) {
    returning {
      email
    }
  }
}
`

// ** Toast Component
const ToastComponent = ({ title, icon, color }) => (
  <div className="toastify-header pb-0">
    <div className="title-wrapper">
      <Avatar size="sm" color={color} icon={icon} />
      <h6 className="toast-title">{title}</h6>
    </div>
  </div>
)

const AddNewModal = ({ open, handleModal, row, setRow, closeModal, handleUpdate, toAddNewRecord, handleAddRecord, updateActive }) => {
  const [updatePassword, { data, loading, error }] = useMutation(updatePasswordGql, { onCompleted: () => {
    toast.success(
      <ToastComponent title="Password Changed" color="success" icon={<Check />} />,
      {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      }
    )
  },
onError: () => {
    toast.error(
      <ToastComponent title="Could not change password" color="danger" icon={<XCircle />} />,
      {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      }
    )
  }})
  const [contract_start_date, set_contract_start_date] = useState(new Date())
  const [contract_end_date, set_contract_end_date] = useState(new Date())
  const [redirectModal, setRedirectModal] = useState(false)
  const [modal, setModal] = useState(false)
  const [newPassword, setNewPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [changeActive, setChangeActive] = useState(false)
  const [active, setActive] = useState(null)
  const options = [
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' }
  ]

  const accountTypeOptions = [
    { value: 'Investor', label: 'Investor' },
    { value: 'Residential Lessee', label: 'Residential Lessee' },
    { value: 'None', label: 'None' }
  ]


  const handleChange = (e) => {
    const rowValue = { ...row }
    rowValue[e.target.name] = e.target.value
    setRow(rowValue)
  }

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

  const handleSelectedChange = (e, name) => {
    if (name === "active") {
      setChangeActive(true)
      setActive(e.value)
    }
    const rowValue = { ...row }
    rowValue[name] = e.value
    setRow(rowValue)
  }

  // ** Function to handle Modal toggle
  const openModal = () => {
    setModal(!modal)
  }

  const toggleModal = () => {
    setModal(!modal)
  }

  const noRedirect = () => {
    handleAddRecord(row)
    setNewPassword(null)
    setConfirmPassword(null)
    setChangeActive(false)
    setRedirectModal(false)
  }

  const yesRedirect = () => {
    handleAddRecord(row, true)
    setNewPassword(null)
    setConfirmPassword(null)
    setChangeActive(false)
    setRedirectModal(false)
  }

  const onSubmit = () => {
    // setRow(row)
    if (changeActive) {
      updateActive(active, row)
    }
    if (toAddNewRecord) {
      setRedirectModal(true)
    } else {
      handleUpdate(row, confirmPassword)
      setRow(null)
      setNewPassword(null)
      setConfirmPassword(null)
      setChangeActive(false)
    }
  }

  const { register, errors, handleSubmit } = useForm()

  return (
    <div>
      <Modal
        isOpen={open}
        toggle={handleModal}
        className='modal-dialog-centered modal-xl'
        // modalClassName='modal-slide-in'
        contentClassName='pt-0'
      >
        <ModalHeader className='mb-3' toggle={handleModal} tag='div'>
          <h5 className='modal-title'>{toAddNewRecord ? 'New Record' : 'Update Record'}</h5>
        </ModalHeader>
        <ModalBody className='flex-grow-1'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col>
                <FormGroup>
                  <Label for='id'>ID</Label>
                  <InputGroup>
                    <InputGroupAddon addonType='prepend'>
                    </InputGroupAddon>
                    <Input id='ID' placeholder='id' name="id" value={row?.id} disabled />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for='full-name'>Full Name</Label>
                  <InputGroup>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <User size={15} />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id='full-name' placeholder='Aman Alvi' name="full_name" value={row?.full_name} onChange={handleChange}
                      innerRef={register({ required: true })}
                      invalid={errors.full_name && true} />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for='account-type'>Account Type</Label>
                  <Select
                    onChange={(e) => handleSelectedChange(e, 'account_type')}
                    theme={selectThemeColors}
                    className='react-select'
                    classNamePrefix='select'
                    defaultValue={{ value: row?.account_type ? row?.account_type : "None", label: row?.account_type ? row?.account_type : "None" }}
                    options={accountTypeOptions}
                    isClearable={false}
                  />
                </FormGroup>
              </Col>
            </Row>
            {/* Second Row */}
            <Row>
              <Col sm="8">
                <FormGroup>
                  <Label for='email'>Email</Label>
                  <InputGroup>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <Mail size={15} />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type='email' name="email" id='email' placeholder='brucewayne@email.com' value={row?.email} onChange={handleChange}
                      innerRef={register({ required: true })}
                      invalid={errors.email && true}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <Label for='sec_email'>Secondary Email</Label>
                  <InputGroup>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <Mail size={15} />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type='sec_email' name="sec_email" id='sec_email' placeholder='brucewayne@email.com' value={row?.sec_email} onChange={handleChange} />
                  </InputGroup>
                </FormGroup>
              </Col>
              {/* <Col>
        <FormGroup>
        <Label for='gender'>Gender</Label>
        <InputGroup>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>
              <Key size={15} />
            </InputGroupText>
          </InputGroupAddon>
          <Input id='gender' placeholder='Gender' name="gender" value={row?.gender} onChange={handleChange} 
           innerRef={register({ required: true })}
           invalid={errors.gender && true}/>
        </InputGroup>
      </FormGroup> 
        </Col> */}
            </Row>
            {/* Third 3rd Row */}
            <Row>
              <Col sm="8">
                <FormGroup>
                  <Label for='phone'>Phone</Label>
                  <InputGroup>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <Phone size={15} />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id='phone' placeholder='Phone' name="phone" value={row?.phone} onChange={handleChange}
                      innerRef={register({ required: true })}
                      invalid={errors.phone && true} />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <Label for='sec_phone'>Secondary Phone</Label>
                  <InputGroup>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <Phone size={15} />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id='sec_phone' placeholder='Secondary Phone' name="sec_phone" type="number" value={row?.sec_phone} onChange={handleChange} />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
            {/* Fourth 4th Row */}
            <Row>
              <Col>
                {/* <FormGroup>
        <Label for='occupation'>Occupation</Label>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Briefcase size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id='occupation' placeholder='Occupation' name="occupation" value={row?.occupation} onChange={handleChange}/>
          </InputGroup>
        </FormGroup> */}
              </Col>
              <Col>
                {/* <FormGroup>
        <Label for='organization'>Organization</Label>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Briefcase size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id='organization' placeholder='Organization' name="organization" value={row?.organization} onChange={handleChange}/>
          </InputGroup>
        </FormGroup> */}
              </Col>
              <Col>
                {/* <FormGroup>
        <Label for='age_range'>Age Range</Label>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Code size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id='age_range' placeholder='Age Range' name="age_range" value={row?.age_range} onChange={handleChange}/>
          </InputGroup>
        </FormGroup> */}
              </Col>
            </Row>
            {/* Fifth 5th row */}
            <Row>
              <Col>
                {/* <FormGroup>
        <Label for='family_size'>Family Size</Label>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Info size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id='family_size' placeholder='Family Size' name="family_size" value={row?.family_size} onChange={handleChange}/>
          </InputGroup>
        </FormGroup> */}
              </Col>
              <Col>
                {/* <FormGroup>
        <Label for='ages_of_children'>Ages of children</Label>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Info size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id='ages_of_children' placeholder='Ages of children' name="ages_of_children" value={row?.ages_of_children} onChange={handleChange}/>
          </InputGroup>
        </FormGroup> */}
              </Col>
              <Col>
                {/* <FormGroup>
        <Label for='earning_bracket'>Earning Bracket</Label>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Info size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id='earning_bracket' placeholder='Earning Bracket' name="earning_bracket" value={row?.earning_bracket} onChange={handleChange}/>
          </InputGroup>
        </FormGroup> */}
              </Col>
            </Row>
            {/* Sixth 6th row */}
            <Row>
              <Col>
                {/* <FormGroup>
        <Label for='nationality'>Nationality</Label>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Info size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id='nationality' placeholder='Nationality' name="nationality" value={row?.nationality} onChange={handleChange}/>
          </InputGroup>
        </FormGroup> */}
              </Col>
              <Col>
                {/* <FormGroup>
        <Label for='years_expatriate'>Years Expatriate</Label>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Info size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id='years_expatriate' placeholder='Years Expriate' name="years_expatriate" value={row?.years_expatriate} onChange={handleChange}/>
          </InputGroup>
        </FormGroup> */}
              </Col>
              <Col>
                {/* <FormGroup>
        <Label for='years_native'>Years Native</Label>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Info size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id='years_native' placeholder='Years Native' name="years_native" value={row?.earning_bracket} onChange={handleChange}/>
          </InputGroup>
        </FormGroup> */}
              </Col>
            </Row>
            {/* Seventh 7th row */}
            <Row>
              <Col>
                <FormGroup>
                  <Label for='reffered_by'>Referred By</Label>
                  <InputGroup>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <Info size={15} />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id='reffered_by' placeholder='Referred By' name="reffered_by" value={row?.reffered_by} onChange={handleChange} />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col>
                {/* <FormGroup>
        <Label for='other_properties'>Other Properties</Label>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Info size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id='other_properties' placeholder='Other Properties' name="other_properties" value={row?.other_properties} onChange={handleChange}/>
          </InputGroup>
        </FormGroup> */}
              </Col>
              <Col>
              </Col>
            </Row>
            {/* 8th Row */}
            <Row>
              <Col>
                <FormGroup>
                  <Label for='contract_start_date'>Contract Start Date</Label>
                  <InputGroup>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <Calendar size={15} />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Flatpickr
                      required
                      id='contract_start_date'
                      //tag={Flatpickr}
                      name='contract_start_date'
                      className='form-control'
                      onChange={(date, dateStr, instance) => {
                        const e = { target: { name: instance.input.name, value: dateStr } }
                        handleChange(e)
                      }}
                      value={row?.contract_start_date}
                      options={{
                        dateFormat: 'Y-m-d'
                      }}
                      placeholder='Contract Start Date'
                    />
                    {/* <Input id='contract_start_date' placeholder='Contract Start Date' name="contract_start_date" value={row?.contract_start_date} onChange={handleChange}/> */}
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for='contract_end_date'>Contract End Date</Label>
                  <InputGroup>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <Calendar size={15} />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Flatpickr
                      required
                      id='contract_end_date'
                      //tag={Flatpickr}
                      name='contract_end_date'
                      className='form-control'
                      onChange={(date, dateStr, instance) => {
                        const e = { target: { name: instance.input.name, value: dateStr } }
                        handleChange(e)
                      }}
                      value={row?.contract_end_date}
                      options={{
                        dateFormat: 'Y-m-d'
                      }}
                      placeholder='Contract End Date'
                    />
                    {/* <Input id='contract_end_date' placeholder='Contract End Date' name="contract_end_date" value={row?.contract_end_date} onChange={handleChange}/> */}
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for='sign_up_time'>Sign up time</Label>
                  <InputGroup>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <Calendar size={15} />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id='sign_up_time' placeholder='Sign up time' name="sign_up_time" value={moment(row?.sign_up_time).format('MMMM Do YYYY, h:mm:ss a')} disabled />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                {!toAddNewRecord && <FormGroup>
                  <Button color='info' outline className="" onClick={() => openModal()}>Change Password</Button>
                </FormGroup>}
              </Col>
              <Col>
              </Col>
              <Col>
              </Col>
            </Row>


            <FormGroup>
              <Label for='active'>Active</Label>
              <Select
                onChange={(e) => handleSelectedChange(e, 'active')}
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                defaultValue={{ value: row?.active, label: row?.active ? "Active" : "Inactive" }}
                options={options}
                isClearable={false}
                innerRef={register({ required: true })}
                invalid={errors.active && true}
              />
            </FormGroup>
            <div className="row justify-content-center">
              <Button className='mr-1' color='primary' type="submit" >
                {toAddNewRecord ? 'Submit' : 'Update'}
              </Button>
              <Button color='secondary' onClick={closeModal} outline>
                Close
              </Button>
            </div>
          </Form>
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
      <div className="modal-warning" >
        <Modal
          isOpen={redirectModal}
          toggle={() => setRedirectModal(!redirectModal)}
          className='modal-dialog-centered'
          modalClassName="modal-warning"

        >
          <ModalHeader toggle={() => setRedirectModal(!redirectModal)}>Warning</ModalHeader>
          <ModalBody>
            Do you want to add property as well?
          </ModalBody>
          <ModalFooter>
            <Button color="warning" onClick={() => yesRedirect() }>
              Yes
            </Button>
            <Button onClick={() => noRedirect() }>
              No
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  )
}

export default AddNewModal
