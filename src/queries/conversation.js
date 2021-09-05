import { gql } from '@apollo/client'
import { BASIC_USER_FIELDS } from './fragments'

export const GET_MESSAGES = gql`
    ${BASIC_USER_FIELDS}
    query getMessages($conversationId:ID!,$cursor:String,$limit:Int!){
        getMessages(conversationId:$conversationId,cursor:$cursor,limit:$limit){
            paging {
            hasMore
            nextCursor
            }
            messages {
                _id 
                message
                isMine
                file {
                    name
                    path
                }
                images
                type
                sender {
                    ...BasicUserFields
                }
            }
        }
    }
`

export const GET_SINGLE_CONVERSATION = gql`
    mutation getSingleConversation($userId:ID!){
        getSingleConversation(userId:$userId) {
            _id 
            type 
        }
    }
`