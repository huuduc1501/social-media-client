import React, { useState } from 'react';
import styled from 'styled-components'

import Signin from './Signin';
import Signup from './Signup';

const Wrapper = styled.div`

    width:400px;
    margin: 40px auto;
    padding: 1rem;
    border: 1px solid blue;

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