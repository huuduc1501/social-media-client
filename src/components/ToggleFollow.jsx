import { gql, useMutation } from "@apollo/client";
import React from "react";
import { FOLLOW_USER, UNFOLLOW_USER } from "../queries/user";

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
