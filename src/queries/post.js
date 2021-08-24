import { gql } from '@apollo/client'

export const SUGGEST_POSTS = gql`
    query suggestPosts {
        suggestPosts {
            _id  
            likesCount 
            commentsCount  
            files
        }
    }
`

export const GET_POST = gql`
    query getPost($postId:ID!){
        getPost(postId:$postId) {
            _id
            caption
            files
            tags
            likesCount
            commentsCount
            isMine
            isLiked
            isSaved
            likes{
                username
            }
            user{
                _id
                fullname
                username
                avatar
                isMe
            }
            comments{
                _id 
                text 
                user {
                    _id 
                    username 
                    fullname 
                    avatar 
                }
            }
        }
    }
`

export const CREATE_POST = gql`
    mutation createPost($caption:String,$files:[String!],$tags:[String]){
        createPost(caption:$caption,files:$files,tags:$tags){
            _id
            caption
            files
            tags
            likesCount
            commentsCount
            isMine
            isLiked
            isSaved
            likes{
                username
            }
            user{
                fullname
                username
                avatar
                isMe
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