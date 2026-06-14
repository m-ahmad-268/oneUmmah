import { Button, Col, Form, Input, Row, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthFormWrap } from './style';
import { Checkbox } from '../../components/checkbox/checkbox';
import { useAuth } from '../../context/AuthContext';

function SignIn() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [state, setState] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const { email, password } = values;

      state ? localStorage.setItem('loggedData', JSON.stringify(values)) : localStorage.removeItem('loggedData');
      const response = await fetch(`${process.env.REACT_APP_API_URL}auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          message.error(data.message || 'Invalid email or password.');
        } else if (response.status === 500) {
          message.error('Server error. Please try again later.');
        } else {
          message.error(data.message || `An unexpected HTTP error occurred: ${response.status}`);
        }
        throw new Error(data.message || `HTTP error! Status: ${response.status}`);
      }

      if (data.success && data.data) {
        const { accessToken, refreshToken, user: userData } = data.data;

        localStorage.setItem('access_token_admin', accessToken);
        localStorage.setItem('refresh_token_admin', refreshToken);
        localStorage.setItem('user_data', JSON.stringify(userData));

        setAuth({
          user: userData,
          role: userData.roles?.[0] ?? null,
          permissions: userData.permissions ?? [],
        });

        message.success('Login successful! Redirecting...');
        navigate('/');
      } else {
        message.error(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');

    if (errorParam === 'token-expired') {
      message.warning('Your token has expired. Please sign in again to continue.');

      // ✅ Remove query param from the URL without refreshing the page
      params.delete('error');
      const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
      window.history.replaceState({}, '', newUrl);
    }

    if (errorParam) {
      console.log('errorParam', errorParam);
    } else {
      console.log('no errorParam');
    }

    const data = localStorage.getItem('loggedData')
    if (data) {
      const value = JSON.parse(data);
      form.setFieldsValue({
        ...value
      })
      setState(true);
    }

  }, []);

  const onChange = (checked) => {
    setState(checked);
  };

  return (
    <div style={{ minHeight: '100vh' }} className="d-flex align-items-center justify-content-center">
      <Row justify="center">
        <Col xxl={6} xl={8} md={12} sm={18} xs={24}>
          <AuthFormWrap>
            <div className="ninjadash-authentication-top">
              <h2 className="ninjadash-authentication-top__title">
                Welcome to One Ummah
              </h2>
            </div>
            <div className="ninjadash-authentication-content">
              <Form name="login" form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item
                  name="email"
                  label="Username or Email Address"
                  rules={[
                    { required: true, message: 'Please input your username or Email!' },
                    { type: 'email', message: 'Please enter a valid email address!' },
                  ]}
                >
                  <Input placeholder="name@example.com" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>
                <div className="ninjadash-auth-extra-links">
                  <Checkbox onChange={onChange} checked={state}>
                    Keep me logged in
                  </Checkbox>
                </div>
                <Form.Item>
                  <Button className="btn-signin" htmlType="submit" type="primary" size="large" loading={isLoading}>
                    {isLoading ? 'Loading...' : 'Sign In'}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </AuthFormWrap>
        </Col>
      </Row>
    </div>
  );
}

export default SignIn;
