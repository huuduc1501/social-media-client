import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useQuery } from "@apollo/client";
import { SEARCH_POSTS } from "../queries/post";
import { SEARCH_USER } from "../queries/user";

import Post from "../components/post/Post";
import { Col, Divider, Row } from "antd";
import SuggestUser from "../components/SuggestUser";

const Wrapper = styled.div`
  .search-list > div {
    margin-bottom: 1rem;
  }
`;

const SearchPage = () => {
  const { search } = useLocation();
  const searchTerm = queryString.parse(search).searchTerm;
  const { loading, data: postData } = useQuery(SEARCH_POSTS, {
    variables: { searchTerm },
    fetchPolicy: "cache-first",
  });
  const { loading: loadingUser, data: userData } = useQuery(SEARCH_USER, {
    variables: { searchTerm },
    fetchPolicy: "cache-first",
  });
  if (loading || loadingUser) return "...loading";
  return (
    <Wrapper>
      <Row gutter={24}>
        <Col span={16}>
          <Divider>bài đăng</Divider>
          <div className="search-list">
            {postData.searchPosts.map((post, index) => (
              <Post key={index} post={post} />
            ))}
          </div>
        </Col>
        <Col span={8}>
          <Divider>người dùng</Divider>

          <div className="search-list">
            {userData.searchUsers.map((user, index) => (
              <SuggestUser user={user} key={index} />
            ))}
          </div>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default SearchPage;
