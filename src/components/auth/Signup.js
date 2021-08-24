import React from 'react';
import styled from 'styled-components';
import { Button, Form, Checkbox, Input, Typography } from 'antd';
import { useMutation } from '@apollo/client';
import { SIGNUP } from '../../queries/auth';
import { IS_LOGGED_IN } from '../../queries/client';

const { Title, Text } = Typography
const Wrapper = styled.div`
`

const Signup = ({ changeToSignin }) => {

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

    const onFinish = async (values) => {
        try {
            await signupMutation({
                variables: values,
            })
        } catch (error) {
            console.log(error)
        }
    }
    const onFinishFailed = (errorInfo) => {

    }
    return (
        <Wrapper>
            <Title level={3} >Đăng nhập</Title>
            <Form
                name="signin"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="tên"
                    name="fullname"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập email!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập email!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập email!',
                        },
                    ]}
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
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập lại mật khẩu!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <Text onClick={changeToSignin}>Đăng nhập</Text>
        </Wrapper>
    );
};

export default Signup;