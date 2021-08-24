import { gql } from '@apollo/client'

export const GET_ME = gql`
    query getMe {
        me {
            _id 
            isMe 
            username 
            fullname
            bio
            email
            avatar 
            isFollowing 
            followingsCount 
            followersCount 
            postsCount 
        }
    }
`

export const GET_NEW_FEED = gql`
    query getNewFeed {
        feed {
            _id 
            caption 
            files 
            tags     
            isSaved
            isLiked
            isMine
            likesCount
            commentsCount
            comments{
                _id 
                text 
                user{
                    _id 
                    username 
                    avatar
                }
            }
            user {
                _id 
                isMe 
                username 
                fullname
                avatar 
                isFollowing
            }
        }
    }
`

export const GET_PROFILE = gql`
    query getProfile($userId:ID!) {
        getProfile(userId:$userId){
            _id 
            isMe 
            username 
            fullname
            bio
            avatar 
            isFollowing 
            followingsCount 
            followersCount 
            postsCount 
            posts {
                _id 
                caption 
                files 
                tags 
                likesCount
                isLiked 
                isMine 
                isSaved 
                commentsCount
                user {
                    _id 
                    username 
                    fullname
                    isMe 
                    isFollowing
                }

            }
            savedPosts {
                _id 
                caption 
                files 
                tags 
                likesCount
                isLiked 
                isMine 
                isSaved 
                commentsCount
                user {
                    _id 
                    username 
                    fullname
                    isMe 
                    isFollowing
                }
            }
        }
    }
    
`
export const GET_FOLLOWINGS = gql`
    query getFollowings($userId:ID!) {
        getProfile(userId:$userId){
            followingsCount
            followings {
                _id 
                username 
                isFollowing
                avatar 
            }
        }
    }
`

export const GET_FOLLOWERS = gql`
    query getFollowers($userId:ID!) {
        getProfile(userId:$userId){
            followersCount
            followers {
                _id 
                username 
                isFollowing
                avatar 
            }
        }
    }
`


export const SUGGEST_USERS = gql`
    query getSuggestUsers {
        suggestUsers {
            _id
            isMe 
            username 
            fullname 
            bio
            avatar 
            isFollowing 
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
            isMe 
            username 
            bio
            avatar 
            isFollowing 
        }
    }
`

export const GET_POST_USER = gql`
    query getProfile($userId:ID!){ 
        getProfile(userId:$userId){ 
            _id 
            posts{
                _id 
                caption
                files 
                tags 
                user {
                    _id 
                    username 
                    fullname
                    avatar
                    bio
                }
            }
        }
    }
`