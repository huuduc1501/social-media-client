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
  .username {
    color: ${(props) => props.theme.onSurface};
  }
  .comment {
    color: ${(props) => props.theme.onSecondSurface};
  }
`;

const PostComment = ({ comment }) => {
  const history = useHistory();
  if (!comment) return null;
  return (
    <Wrapper>
      <Comment
        author={
          <span
            className="username"
            onClick={() => history.push(`/u/${comment.user._id}`)}
          >
            {comment.user.username}
          </span>
        }
        avatar={
          <Avatar
            src={comment.user.avatar}
            onClick={() => history.push(`/u/${comment.user._id}`)}
          />
        }
        content={<p className="comment">{comment.text}</p>}
      />
    </Wrapper>
  );
};

export default PostComment;
