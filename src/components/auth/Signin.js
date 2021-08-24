import React from 'react';
import { Input, Form, Checkbox, Button, Typography } from 'antd'
import styled from 'styled-components'
import { SIGNIN } from '../../queries/auth'
import { useMutation } from '@apollo/client';
import { IS_LOGGED_IN } from '../../queries/client';

const Wrapper = styled.div`

`
const { Title, Text } = Typography

const Signin = ({ changeToSignup }) => {
    const [signinMutation, { loading, error, }
    ] = useMutation(SIGNIN, {
        update: (cache, { data: { signin } }) => {
            localStorage.setItem('token', signin.token)
            cache.writeQuery({
                query: IS_LOGGED_IN,
                data: {
                    isLoggedIn: true
                }
            })
        },
        errorPolicy: 'none',

    })

    const onFinish = async (values) => {
        try {
            await signinMutation({
                variables: {
                    email: values.email,
                    password: values.password,
                },
            })
        } catch (error) {
            console.log(error)
        }

    };
    if (loading) return <h1>loading...</h1>
    // if (error) return error.message


    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <Wrapper>
            <Title level={4}>Đăng nhập</Title>
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
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Checkbox>Lưu thông tin</Checkbox>
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

            <Text>
                <Text underline onClick={changeToSignup}>Đăng kí</Text>
                /
                <Text underline>quên mật khẩu</Text>
            </Text>
        </Wrapper >
    );
};

export default Signin;