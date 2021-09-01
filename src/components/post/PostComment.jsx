import { Avatar, Comment } from "antd";
import React from "react";
import { Link, useHistory } from "react-router-dom";
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
          <Link to={`/u/${comment.user._id}`} className="username">
            {comment.user.username}
          </Link>
        }
        avatar={
          <Link to={`/u/${comment.user._id}`} className="username">
            <Avatar src={comment.user.avatar} />
          </Link>
        }
        content={<p className="comment">{comment.text}</p>}
      />
    </Wrapper>
  );
};

export default PostComment;
