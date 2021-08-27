import { gql } from '@apollo/client'

export const SIGNUP = gql`
    mutation signup($email:String!,$password:String!,$fullname:String!,$username:String!,){
        signup(email:$email,password:$password,fullname:$fullname,username:$username){
            token
        }
    }
`
export const SIGNIN = gql`
    mutation signin($email:String!,$password:String!,){
        signin(email:$email,password:$password){
            token
        }
    }
`
export const ME = gql`
    query getMe{
        me{
            _id
            username
            fullname
            avatar 
            bio
            email
            createdAt
        }
    }
`

export const VALIDATE_EMAIL = gql`
    mutation validateEmail($email:String!){
        validateEmail(email:$email)
    }
`

export const VALIDATE_USERNAME = gql`
    mutation validateUsername($username:String!){
        validateUsername(username:$username)
    }
`