import React, { useState } from 'react';
import styled from 'styled-components'

import Signin from './Signin';
import Signup from './Signup';

const Wrapper = styled.div`

    width:400px;
    margin: 40px auto;
    padding: 1rem;
    border: 1px solid ${props => props.theme.borderColor};
    background-color: ${props => props.theme.white};
    border-radius: ${props => props.theme.borderRadius};

    .form-button > div{ 
        max-width: 100%;
    }
    .ant-form-item-control-input-content:last-child{
        display: flex;
        justify-content: center;
    }
    .ant-form-item-children-icon svg,.ant-input-suffix svg {
        font-size: 1rem;
    }


    @media (max-width:450px) {
        width:90%;
    }

`

const Auth = () => {
    const [auth, setAuth] = useState('signin')

    return (
        <Wrapper>
            {auth === 'signin'
                ? <Signin changeToSignup={() => setAuth('signup')} />
                : <Signup changeToSignin={() => setAuth('signin')} />}
        </Wrapper>
    );
};

export default Auth;