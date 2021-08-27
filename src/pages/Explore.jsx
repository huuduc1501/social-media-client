import { useQuery } from "@apollo/client";
import { Divider, message, Skeleton } from "antd";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
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
  const { loading, error, data, fetchMore } = useQuery(SUGGEST_POSTS, {
    variables: {
      limit: 6,
    },
    fetchPolicy: "cache-first",
  });

  const onHandleFetchMore = async () => {
    await fetchMore({
      variables: {
        limit: 5,
        cursor: data.suggestPosts.paging.nextCursor,
      },
    });
  };

  if (error) return message.error(error.message);

  return (
    <Wrapper>
      <Divider orientation="left">
        <h3>Khám phá</h3>
      </Divider>
      <div className="">
        {loading ? (
          <div className="explore__post-list">
            {[...Array(9).fill(1)].map((_, index) => (
              <Skeleton.Image
                key={index}
                active
                style={{ width: "300px", height: "300px" }}
              />
            ))}{" "}
          </div>
        ) : (
          <InfiniteScroll
            dataLength={data.suggestPosts.posts.length}
            hasMore={data.suggestPosts.paging.hasMore}
            next={onHandleFetchMore}
            className="explore__post-list"
            endMessage={
              <p style={{ textAlign: "center", gridColumn: "1/4" }}>
                <b>Yay! Bạn đã khám phá tất cả các bài đăng</b>
              </p>
            }
          >
            {data.suggestPosts.posts.map((post, index) => (
              <PostPreview post={post} key={index} />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </Wrapper>
  );
};

export default Explore;
