import React from 'react';
import Auth from './components/auth/Auth';
import 'antd/dist/antd.css';
import { ThemeProvider } from 'styled-components';

import Router from './Router'
import { useQuery } from '@apollo/client';
import { IS_LOGGED_IN, MODE } from './queries/client';
import GLobleStyle from './styles/GLobleStyle';
import { lightTheme, darkTheme } from './styles/theme'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const App = () => {
    const { data: { isLoggedIn } } = useQuery(IS_LOGGED_IN)
    console.log(isLoggedIn)

    const { data: { mode } } = useQuery(MODE)

    return (
        <>
            <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
                <GLobleStyle />
                {isLoggedIn ? <Router /> : <Auth />}
            </ThemeProvider>
        </>
    );
};

export default App;