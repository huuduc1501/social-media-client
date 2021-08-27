import { gql } from '@apollo/client'

import { BASIC_USER_FIELDS, CORE_POST_FIELDS, PREVIEW_POST_FIELDS } from './fragments'

export const GET_ME = gql`
    ${BASIC_USER_FIELDS}

    query getMe {
        me {
            ...BasicUserFields
            bio
            email
            followingsCount 
            followersCount 
            postsCount 
        }
    }
`

export const GET_NEW_FEED = gql`
    ${BASIC_USER_FIELDS}
    ${CORE_POST_FIELDS}
    query getNewFeed($cursor:String,$limit:Int!) {

        feed(cursor:$cursor,limit:$limit) {
            paging {
                hasMore 
                nextCursor
            }
            posts{
                ...CorePostFields
            comments{
                _id 
                text 
                user{
                    ...BasicUserFields
                }
            }
            user {
                ...BasicUserFields
            }
            }
        }
    }
`

export const GET_PROFILE = gql`
    ${BASIC_USER_FIELDS}
    ${PREVIEW_POST_FIELDS}
    query getProfile($userId:ID!) {
        getProfile(userId:$userId){
            ...BasicUserFields
            bio
            isFollowing 
            followingsCount 
            followersCount 
            postsCount 
            posts {
                ...PreviewPostFields
            }
            savedPosts {
                ...PreviewPostFields
            }
        }
    }
    
`
export const GET_FOLLOWINGS = gql`
    ${BASIC_USER_FIELDS}

    query getFollowings($userId:ID!) {
        getProfile(userId:$userId){
            followingsCount
            followings {
                ...BasicUserFields
            }
        }
    }
`

export const GET_FOLLOWERS = gql`
    ${BASIC_USER_FIELDS}

    query getFollowers($userId:ID!) {
        getProfile(userId:$userId){
            followersCount
            followers {
                ...BasicUserFields
            }
        }
    }
`


export const SUGGEST_USERS = gql`
    ${BASIC_USER_FIELDS}

    query getSuggestUsers {
        suggestUsers {
            ...BasicUserFields
        }
    }
`

export const FOLLOW_USER = gql`
    mutation followUser($userId:ID!) {
        follow(userId:$userId)
    }
`

export const UNFOLLOW_USER = gql`
    mutation unfollowUser($userId:ID!){
        unfollow(userId:$userId)
    }
`
export const EDIT_PROFILE = gql`
    mutation editProfile($fullname:String,$username:String,$bio:String,$avatar:String,$email:String) {
        editProfile(fullname:$fullname,username:$username,bio:$bio,avatar:$avatar,email:$email){
            _id 
            username 
            fullname 
            bio 
            email
        }
    }
`

export const GET_POST_USER = gql`
    query getProfile($userId:ID!){ 
        getProfile(userId:$userId){ 
            _id 
            posts{
                _id 
                files 
                likesCount
                commentsCount
            }
        }
    }
`

export const SEARCH_USER = gql`
    ${BASIC_USER_FIELDS}
    query searchUsers($searchTerm:String!) {
        searchUsers(searchTerm:$searchTerm){ 
            ...BasicUserFields
        }
    }
`