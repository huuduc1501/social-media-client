import { gql } from '@apollo/client'

import { BASIC_USER_FIELDS } from './fragments'

export const ADD_COMMENT = gql`
    ${BASIC_USER_FIELDS}
    mutation addNewComment($postId:ID!,$text:String!) {
        addComment(postId:$postId,text:$text) {
            _id 
            text 
            post{ 
                _id 
            }
            user { 
                ...BasicUserFields
            }
        }
    }
`

export const DELETE_COMMENT = gql`
    mutation deleteComment($commentId:ID!) {
        deleteComment(commentId:$commentId)
    }
`