import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { CommentOutlined, HeartOutlined } from "../Icon";

const Wrapper = styled.div`
  cursor: pointer;
  width: 300px;
  height: 300px;

  img {
    width: 300px;
    height: 300px;
    object-fit: cover;
    border-radius: 4px;
  }
  .post-preview {
    position: absolute;
  }
  .overlay {
    width: 300px;
    height: 300px;
    display: none;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    position: absolute;
    color: white;
    fill: white;
    font-size: 1.5rem;
    font-weight: 300;
  }

  .overlay-content {
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  :hover .overlay {
    display: block;
  }
  svg {
    fill: white;
  }
`;

const PostPreview = ({ post }) => {
  const history = useHistory();
  return (
    <Wrapper onClick={() => history.push(`/p/${post._id}`)}>
      <div className="post-preview">
        <img src={post.files[0]} alt="images" />
        <div className="overlay">
          <div className="overlay-content">
            <span>
              <HeartOutlined /> {post.likesCount}
            </span>
            <span>
              <CommentOutlined /> {post.commentsCount}
            </span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default PostPreview;
