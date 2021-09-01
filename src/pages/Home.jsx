import React from "react";
import styled from "styled-components";
import { Row, Col, Skeleton } from "antd";
import { useApolloClient, useQuery } from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";

import { GET_ME, GET_NEW_FEED, SUGGEST_USERS } from "../queries/user";
import Post from "../components/post/Post";
import SuggestUser from "../components/SuggestUser";
import NewPost from "../components/post/NewPost";

const Wrapper = styled.div`
  h3 {
    color: ${(props) => props.theme.onBg};
  }

  > div {
    width: 100%;
  }
  .post-list > div {
    margin-bottom: 1rem;
  }
  .suggest-list {
    position: fixed;
    width: 333px;
  }
  .suggest-list > div {
    margin-bottom: 0.5rem;
  }

  @media (max-width: 1016px) {
    .suggest-list {
      width: 33.33%;
    }
  }
  @media (max-width: 600px) {
    .ant-row {
      margin: 0 !important;
    }
  }
`;

const Home = () => {
  const { loading, error, data, fetchMore, refetch } = useQuery(GET_NEW_FEED, {
    variables: {
      limit: 2,
    },
    fetchPolicy: "cache-first",
  });
  const {
    loading: sgLoading,
    error: sgError,
    data: sgData,
  } = useQuery(SUGGEST_USERS, {
    fetchPolicy: "cache-first",
  });
  const client = useApolloClient();
  const { me } = client.readQuery({ query: GET_ME });

  const fetchMorePost = async () => {
    await fetchMore({
      variables: {
        cursor: data.feed.paging.nextCursor,
        limit: 2,
      },
    });
  };

  if (error) return error.message;

  return (
    <Wrapper>
      <Row gutter={24}>
        <Col sm={16} xs={24}>
          <div className="post-list">
            <NewPost />
            {loading ? (
              <>
                {[
                  ...Array(2).map((_, index) => (
                    <Skeleton key={index} active avatar paragraph={4} />
                  )),
                ]}
              </>
            ) : (
              <InfiniteScroll
                dataLength={data.feed.posts.length}
                hasMore={data.feed.paging.hasMore}
                next={fetchMorePost}
                className="post-list"
                endMessage={
                  <p style={{ textAlign: "center" }}>
                    <b>Yay! Bạn đã xem tất cả các bài đăng</b>
                  </p>
                }
                loader={<Skeleton avatar paragraph={4} />}
                // refreshFunction={async () => await refetch()}
                // pullDownToRefresh
                // pullDownToRefreshThreshold={50}
                // pullDownToRefreshContent={
                //   <h3 style={{ textAlign: "center" }}>
                //     &#8595; Pull down to refresh
                //   </h3>
                // }
                // releaseToRefreshContent={
                //   <h3 style={{ textAlign: "center" }}>
                //     &#8593; Release to refresh
                //   </h3>
                // }
              >
                {data?.feed.posts.map((post, index) => {
                  return <Post key={index} post={post} />;
                })}
              </InfiniteScroll>
            )}
          </div>
        </Col>
        <Col sm={8} xs={0}>
          <div className="suggest-list">
            <SuggestUser user={me} />
            <h3>Đề xuất</h3>
            {sgLoading ? (
              <>
                {[
                  ...Array(4).map((_, index) => (
                    <Skeleton key={index} active avatar />
                  )),
                ]}
              </>
            ) : (
              <>
                {sgData?.suggestUsers.map((user, index) => {
                  return <SuggestUser key={index} user={user} />;
                })}
              </>
            )}
          </div>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default Home;
