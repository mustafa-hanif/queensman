import { Link, useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react'
import InputPasswordToggle from '@components/input-password-toggle'
import { Alert, Card, CardBody, CardTitle, CardText, Form, FormGroup, Label, Input, CustomInput, Button, Spinner } from 'reactstrap'
import { auth } from "../utility/nhost"

import '@styles/base/pages/page-auth.scss'

const LoginV1 = () => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const history = useHistory()
  useEffect(() => {
    auth.isAuthenticatedAsync().then(status => {
      if (status) {
        history.push('/home')
      } else {
        setLoading(false)
      }
    })
  }, [])
  const onSubmit = async (e) => {
    e.preventDefault()
    try { 
      const data = await auth.login({ email: e.target.elements.email.value, password: e.target.elements.password.value})
      localStorage.setItem('userData', JSON.stringify(data))
      
    } catch (e) {
      setError(e.response.data.message)
    }

  }
  return (
    <div className='auth-wrapper auth-v1 px-2'>
      <div className='auth-inner py-2'>
        {loading ? <Spinner color='primary' /> : <>
      {error && (
        <Alert color='warning'>
          <h4 className='alert-heading'>{error}</h4>
        </Alert>
      )}
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
              <h2 className='brand-text text-primary ml-1'>Queensman</h2>
            </Link>
            <CardTitle tag='h4' className='mb-1'>
              Welcome to Queensman! 👋
            </CardTitle>
            <CardText className='mb-2'>Please sign-in to your account</CardText>
            <Form className='auth-login-form mt-2' onSubmit={onSubmit}>
              <FormGroup>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <Input type='email' name='email' id='login-email' placeholder='john@example.com' autoFocus />
              </FormGroup>
              <FormGroup>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                  <Link to='/pages/forgot-password-v1'>
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <InputPasswordToggle name='password' className='input-group-merge' id='login-password' />
              </FormGroup>
              <FormGroup>
                <CustomInput name='remember' type='checkbox' className='custom-control-Primary' id='remember-me' label='Remember Me' />
              </FormGroup>
              <Button.Ripple type="submit" color='primary' block>
                Sign in
              </Button.Ripple>
            </Form>
          </CardBody>
        </Card>
        </>}
      </div>
    </div>
  )
}

export default LoginV1
