import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { FOLLOW_USER, GET_ME, UNFOLLOW_USER } from "../queries/user";

const ToggleFollow = ({ userId, isFollowing, children, ...rest }) => {
  console.log("render toggle");

  const client = useApolloClient();
  const {
    me: { _id: myId },
  } = client.readQuery({ query: GET_ME });
  const [followMutation] = useMutation(FOLLOW_USER, {
    update: (cache) => {
      cache.modify({
        id: `User:${myId}`,
        fields: {
          followingsCount(currentFollowingsCount) {
            return currentFollowingsCount + 1;
          },
        },
        broadcast: false,
      });
    },
  });
  const [unfollowMutation] = useMutation(UNFOLLOW_USER, {
    update: (cache) => {
      cache.modify({
        id: `User:${myId}`,
        fields: {
          followingsCount(currentFollowingsCount) {
            return currentFollowingsCount - 1;
          },
        },
        broadcast: false,
      });
    },
  });

  const handleFollow = async () => {
    try {
      client.writeFragment({
        id: `User:${userId}`,
        fragment: gql`
          fragment modifyUser on User {
            isFollowing
          }
        `,
        data: {
          isFollowing: true,
        },
      });
      await followMutation({
        variables: {
          userId,
        },
      });
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleUnFollow = async () => {
    try {
      client.writeFragment({
        id: `User:${userId}`,
        fragment: gql`
          fragment modifyUser on User {
            isFollowing
          }
        `,
        data: {
          isFollowing: false,
        },
      });
      await unfollowMutation({
        variables: {
          userId,
        },
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div
      {...rest}
      onClick={() => (isFollowing ? handleUnFollow() : handleFollow())}
    >
      {isFollowing ? "Following" : "Follow"}
    </div>
  );
};

export default ToggleFollow;
