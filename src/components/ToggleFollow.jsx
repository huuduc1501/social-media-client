import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { FOLLOW_USER, GET_ME, UNFOLLOW_USER } from "../queries/user";

const ToggleFollow = ({ userId, children, ...rest }) => {
  const client = useApolloClient();
  const {
    me: { _id: myId },
  } = client.readQuery({ query: GET_ME });
  const { isFollowing } = client.readFragment({
    id: `User:${userId}`,
    fragment: gql`
      fragment following on User {
        isFollowing
      }
    `,
  });
  const [followMutation] = useMutation(FOLLOW_USER, {
    update: (cache) => {
      cache.modify({
        id: `User:${myId}`,
        fields: {
          followingsCount(currentFollowingsCount) {
            return parseInt(currentFollowingsCount) + 1;
          },
        },
      });
    },
  });
  const [unfollowMutation] = useMutation(UNFOLLOW_USER, {
    update: (cache) => {
      cache.modify({
        id: `User:${myId}`,
        fields: {
          followingsCount(currentFollowingsCount) {
            return parseInt(currentFollowingsCount) - 1;
          },
        },
      });
    },
  });

  const handleFollow = async () => {
    try {
      client.cache.modify({
        id: `User:${userId}`,
        fields: {
          isFollowing(current) {
            console.log(current);
            return !current;
          },
        },
      });
      if (isFollowing) {
        unfollowMutation({
          variables: {
            userId,
          },
        });
      } else {
        followMutation({
          variables: {
            userId,
          },
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div {...rest} onClick={handleFollow}>
      {isFollowing ? "Following" : "Follow"}
    </div>
  );
};

export default ToggleFollow;
