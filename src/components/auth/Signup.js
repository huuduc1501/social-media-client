import React from 'react';
import styled from 'styled-components';
import { Button, Form, Input, Typography } from 'antd';
import { useLazyQuery, useMutation } from '@apollo/client';
import { SIGNUP, VALIDATE_EMAIL, VALIDATE_USERNAME } from '../../queries/auth';
import { IS_LOGGED_IN } from '../../queries/client';

const { Title, Text } = Typography
const Wrapper = styled.div`
`

const Signup = ({ changeToSignin }) => {

    const [validateEmailMutation] = useMutation(VALIDATE_EMAIL)
    const [validateUsernameMutation] = useMutation(VALIDATE_USERNAME)
    const [form] = Form.useForm()

    const [signupMutation, { loading, error, data }
    ] = useMutation(SIGNUP, {
        update: (cache, { data: { signup } }) => {
            localStorage.setItem('token', signup.token);
            cache.writeQuery({
                query: IS_LOGGED_IN,
                data: {
                    isLoggedIn: true
                }
            })
        }
    })

    const onHandleValidateUsername = async (_, username) => {
        if (!username) return
        if (username.trim().split(' ').length !== 1)
            return Promise.reject(new Error('tên không được chứa khoảng trắng'))
        const d = await validateUsernameMutation({ variables: { username } })
        console.log(d.data.validateUsername)
        if (d.data.validateUsername) return Promise.resolve()
        return Promise.reject(new Error('tên này đã được đăng kí'))
    }

    const onHandleValidateEmail = async (_, email) => {
        if (!email) return
        const d = await validateEmailMutation({ variables: { email } })
        if (d.data.validateEmail) return Promise.resolve()
        return Promise.reject(new Error('Email này đã đăng kí!'))
    }

    const onFinish = async (values) => {
        // const { email, password, rePassword, username, fullname } = values;
        // if(!email.trim||)
        try {
            await signupMutation({
                variables: values,
            })
        } catch (error) {
            console.log(error)
        }
    }
    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo)
    }
    return (
        <Wrapper>
            <Title level={3} >Đăng kí</Title>
            <Form
                name="signin"
                labelCol={{
                    span: 10,
                }}
                wrapperCol={{
                    span: 14,
                }}
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="tên đầy đủ"
                    name="fullname"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="kí danh"
                    name="username"
                    validateTrigger='onBlur'
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên',
                        }, {
                            validator: onHandleValidateUsername
                        },
                    ]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    validateTrigger='onBlur'
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập email!',
                        }, {
                            type: 'email', message: 'Vui lòng nhập đúng e-mail'
                        },
                        { validator: onHandleValidateEmail }
                    ]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Nhập lại mật khẩu"
                    name="rePassword"
                    // validateTrigger='onBlur'
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập lại mật khẩu!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu nhập lại không khớp'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item className="form-button">
                    <Button loading={loading} type="primary" htmlType="submit">
                        Đăng kí
                    </Button>
                </Form.Item>
            </Form>
            <Text style={{ cursor: 'pointer' }} underline type='secondary' onClick={changeToSignin}>Đăng nhập</Text>
        </Wrapper>
    );
};

export default Signup;