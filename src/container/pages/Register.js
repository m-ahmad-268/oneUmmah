import UilFacebook from '@iconscout/react-unicons/icons/uil-facebook-f';
import UilGithub from '@iconscout/react-unicons/icons/uil-github';
import UilTwitter from '@iconscout/react-unicons/icons/uil-twitter';
import { Button, Col, Form, Input, Row } from 'antd';
import { Auth0Lock } from 'auth0-lock';
import React, { useCallback, useState } from 'react';

import { Link, NavLink, useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactSVG } from 'react-svg';
import { AuthFormWrap } from './style';
import { Checkbox } from '../../components/checkbox/checkbox';
import { auth0options } from '../../config/auth0';
import { FcGoogle } from 'react-icons/fc';

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

function Register() {
  const navigate = useNavigate();
  const isLoading = false;
  const [form] = Form.useForm();
  const [state, setState] = useState({
    checked: null,
  });

  const lock = new Auth0Lock(clientId, domain, auth0options);

  const handleSubmit = (values) => {
    window.location.href = `${process.env.REACT_APP_API_URL}set-redirect?target=http://localhost:3000/admin/`;
  };

  const handleAuthOSubmit = () => {};

  const onChange = (checked) => {
    setState({ ...state, checked });
  };

  const validatePassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      callback('Passwords do not match!');
    }

    callback();
  };

  lock.on('authenticated', (authResult) => {
    lock.getUserInfo(authResult.accessToken, (error) => {
      if (error) {
        return;
      }
      handleAuthOSubmit(authResult);
      lock.hide();
    });
  });

  return (
    <div style={{ minHeight: '100vh' }} className="d-flex align-items-center justify-content-center">
      <Row justify="center">
        <Col xxl={6} xl={8} md={12} sm={18} xs={24}>
          <AuthFormWrap>
            <div className="ninjadash-authentication-top">
              <h2 className="ninjadash-authentication-top__title">Sign up to Zarbotics Workspace</h2>
            </div>
            <div className="ninjadash-authentication-content">
              <Form name="signup" form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item
                  name="firstName"
                  rules={[{ message: 'Please input your first name!', required: true }]}
                  label="First Name"
                >
                  <Input placeholder="First Name" />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  rules={[{ message: 'Please input your last name!', required: true }]}
                  label="Last Name"
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[{ message: 'Please input your email address!', required: true }]}
                  label="Email Address"
                >
                  <Input placeholder="name@example.com" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ message: 'Please input your password!', required: true }]}
                  label="Password"
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { message: 'Please confirm your password!', required: true },
                    { validator: validatePassword },
                  ]}
                  label="Confirm Password"
                >
                  <Input.Password placeholder="Confirm Password" />
                </Form.Item>
                <div className="ninjadash-auth-extra-links">
                  <Checkbox onChange={onChange} checked={state.checked}>
                    I agree to the Zarbotics Workspace
                    <Link to="/terms-and-conditions">Terms and Conditions</Link>
                  </Checkbox>
                </div>
                <Form.Item>
                  <Button className="btn-signin" htmlType="submit" type="primary" size="large">
                    {isLoading ? 'Loading...' : 'Sign up'}
                  </Button>
                </Form.Item>
                <p className="ninjadash-form-divider">
                  <span>Or</span>
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button
                    onClick={handleSubmit}
                    type="primary"
                    size="middle"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#F2F2F2', // purple → blue gradient
                      border: 'none',
                      fontWeight: '500',
                      borderRadius: '9999px',
                      color: '#000000',
                      padding: '20px 35px',
                    }}
                  >
                    <FcGoogle color="white" />
                    Sign up with Google
                  </Button>
                </div>
              </Form>
            </div>
            <div className="ninjadash-authentication-bottom">
              <p>
                Already have an account?
                <Link to="/login">Sign in</Link>
              </p>
            </div>
          </AuthFormWrap>
        </Col>
      </Row>
    </div>
  );
}

export default Register;
