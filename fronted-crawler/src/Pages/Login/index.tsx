
import React, { useCallback, useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom';
import request from '../../request'
// import qs from 'qs'
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { Store } from 'rc-field-form/lib/interface'
import './style.css'

const LoginForm: React.FC = () => {
  const [login, setLogin] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    request.get('/api/islogin').then(res => {
      const data: responseResult.islogin = res.data
      if (data) {
        setLogin(true)
      }
    }).finally(() => {
      setLoaded(true)
    })
  }, [])

  const onFinish = useCallback((values: Store) => {
    console.log('Received values of form: ', values);
    if (values) {
      request.post('/api/login', values).then(res => {
        const data: responseResult.login = res.data
        if (data) {
          setLogin(true)
        } else {
          message.error('登录失败')
        }
      })
      // axios.post('/api/login', qs.stringify({
      //   password: values.password
      // }), {
      //   headers: {
      //     'Content-Type': "application/x-www-form-urlencoded"
      //   }
      // }).then(res => {
      //   if (res.data?.data) {
      //     setLogin(true)
      //   } else {
      //     message.error('登录失败')
      //   }
      // })
    }
  }, [])

  if (!loaded) {
    return null
  }
  return login ? <Redirect to="/" /> : (
    <div className="login-page" >
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }
        }
        onFinish={onFinish}
      >
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm
