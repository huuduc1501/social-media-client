import { gql } from '@apollo/client'

import { BASIC_USER_FIELDS, PREVIEW_POST_FIELDS, CORE_POST_FIELDS } from './fragments'

export const SUGGEST_POSTS = gql`
    ${PREVIEW_POST_FIELDS}
    query suggestPosts($limit:Int!,$cursor:String) {
        suggestPosts(limit:$limit,cursor:$cursor) {
            paging{
                hasMore 
                nextCursor
            }
            posts {
                ...PreviewPostFields    
            }
        }
    }
`

export const GET_POST = gql`
    ${BASIC_USER_FIELDS}
    ${CORE_POST_FIELDS}
    query getPost($postId:ID!){
        getPost(postId:$postId) {
            ...CorePostFields
            user{
                ...BasicUserFields
            }
            comments{
                _id 
                text 
                user {
                  ...BasicUserFields
                }
            }
        }
    }
`

export const CREATE_POST = gql`
    ${BASIC_USER_FIELDS}
    ${CORE_POST_FIELDS}
    mutation createPost($caption:String,$files:[String!],$tags:[String]){
        createPost(caption:$caption,files:$files,tags:$tags){
            ...CorePostFields
            user{
                ...BasicUserFields
            }
            comments {
                _id 
                text 
                user {
                    ...BasicUserFields
                }
            }
        }
    }
`

export const DELETE_POST = gql`
    mutation deletePost($postId:ID!){
        deletePost(postId:$postId)
    }
`

export const TOGGLE_LIKE_POST = gql`
    mutation toggleLikePost($postId:ID!){
        toggleLike(postId:$postId)
    }
`
export const TOGGLE_SAVE_POST = gql`
    mutation toggleSavePost($postId:ID!){
        toggleSave(postId:$postId)
    }
`

export const SEARCH_POSTS = gql`
    ${BASIC_USER_FIELDS}
    ${CORE_POST_FIELDS}
    query searchPosts($searchTerm:String!){
        searchPosts(searchTerm:$searchTerm){
            ...CorePostFields
            user{
                ...BasicUserFields
            }
        }
    }
`