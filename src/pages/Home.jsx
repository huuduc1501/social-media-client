import React from "react";
import styled from "styled-components";
import { Row, Col, Skeleton } from "antd";
import { useApolloClient, useQuery } from "@apollo/client";

import { GET_ME, GET_NEW_FEED, SUGGEST_USERS } from "../queries/user";
import Post from "../components/post/Post";
import SuggestUser from "../components/SuggestUser";
import NewPost from "../components/post/NewPost";

const Wrapper = styled.div`
  .post-list > div {
    margin-bottom: 1rem;
  }
  .suggest-list > div {
    margin-bottom: 0.5rem;
  }
`;

const Home = () => {
  const { loading, error, data } = useQuery(GET_NEW_FEED, {
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
  if (error) return error.message;
  return (
    <Wrapper>
      <Row gutter={24}>
        <Col sm={16} xs={24}>
          <div className="post-list">
            <NewPost />
            {loading ? (
              <>
                <Skeleton avatar paragraph={4} />
                <Skeleton avatar paragraph={4} />
                <Skeleton avatar paragraph={4} />
                <Skeleton avatar paragraph={4} />
              </>
            ) : (
              ""
            )}
            {data?.feed.map((post, index) => {
              return <Post key={index} post={post} />;
            })}
          </div>
        </Col>
        <Col sm={8} xs={0}>
          <div className="suggest-list">
            <SuggestUser user={me} />
            <h3>Đề xuất</h3>
            {sgLoading ? (
              <>
                <Skeleton avatar paragraph={1} />
                <Skeleton avatar paragraph={1} />
                <Skeleton avatar paragraph={1} />
                <Skeleton avatar paragraph={1} />
              </>
            ) : (
              ""
            )}
            {sgError ? sgError.message : ""}
            {sgData?.suggestUsers.map((user, index) => {
              return <SuggestUser key={index} user={user} />;
            })}
          </div>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default Home;