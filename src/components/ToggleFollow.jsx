import { gql, useMutation } from "@apollo/client";
import React from "react";
import { FOLLOW_USER, GET_ME, UNFOLLOW_USER } from "../queries/user";

const ToggleFollow = ({ userId, isFollowing, children, ...rest }) => {
  const [followMutation] = useMutation(FOLLOW_USER, {
    update: (cache) => {
      cache.writeFragment({
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
      const {
        me: { _id: myId },
      } = cache.readQuery({ query: GET_ME });
      cache.modify({
        id: `User:${myId}`,
        fields: {
          followingsCount(currentFollowingsCount) {
            return currentFollowingsCount + 1;
          },
        },
      });
    },
  });
  const [unfollowMutation] = useMutation(UNFOLLOW_USER, {
    update: (cache) => {
      cache.writeFragment({
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

      const {
        me: { _id: myId },
      } = cache.readQuery({ query: GET_ME });
      cache.modify({
        id: `User:${myId}`,
        fields: {
          followingsCount(currentFollowingsCount) {
            return currentFollowingsCount - 1;
          },
        },
        broadcast: true,
      });
    },
  });

  const handleFollow = async () => {
    try {
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
      {children}
    </div>
  );
};

export default ToggleFollow;
