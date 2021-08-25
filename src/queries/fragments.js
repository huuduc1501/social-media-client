import { gql } from '@apollo/client'

export const BASIC_USER_FIELDS = gql`
    fragment BasicUserFields on User {
        _id 
        username 
        fullname 
        isFollowing
        isMe 
        avatar
    }
`
export const PREVIEW_POST_FIELDS = gql`
    fragment PreviewPostFields on Post {
        _id 
        files 
        likesCount 
        commentsCount
    }
`

export const CORE_POST_FIELDS = gql`
    fragment CorePostFields on Post {
        _id
        caption
        files
        tags
        likesCount
        commentsCount
        isMine
        isLiked
        isSaved
    }
`