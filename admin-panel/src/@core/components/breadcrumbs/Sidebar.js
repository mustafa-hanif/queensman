// ** React Import
import { useState } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Utils
import { isObjEmpty } from '@utils'

// ** Third Party Components
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { Button, FormGroup, Label, FormText, Form, Input } from 'reactstrap'

// ** Store & Actions
import { useDispatch } from 'react-redux'

import { gql, useMutation } from '@apollo/client'

const ADD_CLIENT = gql`
mutation AddClient($full_name: String!, $email: String!, $phone: String!) {
  insert_client_one(full_name: $full_name, email: $email, phone: $phone) {  
    full_name
    email
    phone
  }
}
`

const AddClient = ({ open, toggleSidebar }) => {
  let input
  const [insert_client_one, { data }] = useMutation(ADD_CLIENT)

  return (
    <Sidebar
      size='lg'
      open={open}
      title='Add New Client'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
    >
      <Form onSubmit={e => {
          e.preventDefault()
          console.log(input.value)
          insert_client_one({ variables: 
            
            { 
              full_name : input.value,
              email : input.value,
              phone : input.value

            } 
          
          })
        
          input.value = ''
          input.value = ''
          input.value = ''


        }}
      >
        <FormGroup>
          <Label for='full-name'>
            Full Name <span className='text-danger'>*</span>
          </Label>
          <Input
          ref={node => {
            input = node
          }}
        />
        </FormGroup>

        <FormGroup>
          <Label for='full-name'>
            Email <span className='text-danger'>*</span>
          </Label>
          <Input
          ref={node => {
            input = node
          }}
        />
        </FormGroup>

        <FormGroup>
          <Label for='full-name'>
            Phone <span className='text-danger'>*</span>
          </Label>
          <Input
          ref={node => {
            input = node
          }}
        />
        </FormGroup>
       
        <Button type='submit' className='mr-1' color='primary'>
          Submit
        </Button>
        <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  )
}


export default AddClient
