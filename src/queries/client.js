import { gql } from '@apollo/client'

export const IS_LOGGED_IN = gql`
    query userLoggedIn{
        isLoggedIn @client
    }
`
export const MODE = gql`
    query getMode {
        mode @client
    } 
`