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
            username
            fullname
            avatar 
            bio
            email
            createdAt
        }
    }
`