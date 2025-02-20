import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

// import { loginUser } from '../utils/API';
import Auth from '../utils/auth';
import type { User } from '../models/User';

import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutation';

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
const LoginForm = ({}: { handleModalClose: () => void }) => {
  const [userFormData, setUserFormData] = useState<User>({ username: '', email: '', password: ''});
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

 // Mutation for loging in
 const [loginUser, { error }] = useMutation(LOGIN_USER);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    console.log('Submitting login form data:', userFormData);

    try {
      // const response = await loginUser(userFormData);

      // if (!response.ok) {
      //   throw new Error('something went wrong!');
      // }
      const { data } = await loginUser({
        variables: { email: userFormData.email, password: userFormData.password }
      });

      console.log('this is the data', data)

      Auth.login(data.login.token);
      
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
      savedBooks: [],
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
        {error && (
          <div className="my-3 p-3 bg-danger text-white">
            {error.message}
          </div>
        )}
      </Form>
    </>
  );
};

export default LoginForm;