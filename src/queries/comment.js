import { gql } from '@apollo/client'

export const ADD_COMMENT = gql`
    mutation addNewComment($postId:ID!,$text:String!) {
        addComment(postId:$postId,text:$text) {
            _id 
            text 
            post{ 
                _id 
            }
            user { 
                _id 
                username
                fullname
                avatar
            }
        }
    }
`

export const DELETE_COMMENT = gql`
    mutation deleteComment($commentId:ID!) {
        deleteComment(commentId:$commentId)
    }
`