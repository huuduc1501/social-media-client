import React from 'react';
import ReactDom from 'react-dom';
import { ApolloProvider } from '@apollo/client'
import dotenv from 'dotenv'


import App from './App';
import client from './apollo'

document.title = 'Social media'
dotenv.config()

ReactDom.render(
    <React.StrictMode>
        <ApolloProvider client={client} >
            <App />
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
)