import { useQuery } from "@apollo/client";
import { Divider } from "antd";
import React from "react";
import styled from "styled-components";
import PostPreview from "../components/post/PostPreview";
import { SUGGEST_POSTS } from "../queries/post";

const Wrapper = styled.div`
  .explore__post-list {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
  }

  @media (max-width: 932px) {
    .explore__post-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 616px) {
    .explore__post-list {
      grid-template-columns: 1fr;
    }
  }
`;

const Explore = () => {
  const { loading, error, data } = useQuery(SUGGEST_POSTS, {
    fetchPolicy: "cache-first",
  });
  if (loading) return "loadin...";
  return (
    <Wrapper>
      <Divider orientation="left">
        <h3>Khám phá</h3>
      </Divider>
      <div className="explore__post-list">
        {data.suggestPosts.map((post, index) => (
          <PostPreview post={post} key={index} />
        ))}
      </div>
    </Wrapper>
  );
};

export default Explore;
