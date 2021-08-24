import { Avatar, Comment } from "antd";
import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  span {
    font-weight: 500;
    color: rgb(38, 38, 38);
    cursor: pointer;
  }
  .ant-comment-inner {
    padding: 4px 0;
  }
`;

const PostComment = ({ comment }) => {
  const history = useHistory();
  return (
    <Wrapper>
      <Comment
        author={
          <span onClick={() => history.push(`/u/${comment.user._id}`)}>
            {comment.user.username}
          </span>
        }
        avatar={
          <Avatar
            src={comment.user.avatar}
            onClick={() => history.push(`/u/${comment.user._id}`)}
          />
        }
        content={<p>{comment.text}</p>}
      />
    </Wrapper>
  );
};

export default PostComment;
