import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useQuery } from "@apollo/client";
import { SEARCH_POSTS } from "../queries/post";
import { SEARCH_USER } from "../queries/user";

import Post from "../components/post/Post";
import { Col, Divider, Row, Skeleton } from "antd";
import SuggestUser from "../components/SuggestUser";

const Wrapper = styled.div`
  .search-list > div {
    margin-bottom: 1rem;
  }
`;

const SearchPage = () => {
  const { search } = useLocation();
  const searchTerm = queryString.parse(search).searchTerm;
  const { loading: postLoading, data: postData } = useQuery(SEARCH_POSTS, {
    variables: { searchTerm },
    fetchPolicy: "cache-first",
  });
  const { loading: userLoading, data: userData } = useQuery(SEARCH_USER, {
    variables: { searchTerm },
    fetchPolicy: "cache-first",
  });
  return (
    <Wrapper>
      <Row gutter={24}>
        <Col sm={14} xs={24}>
          <Divider>bài đăng</Divider>
          <div className="search-list">
            {postLoading ? (
              <>
                {[
                  ...Array(3).map((_, index) => (
                    <Skeleton key={index} active avatar paragraph={4} />
                  )),
                ]}
              </>
            ) : (
              <>
                {postData.searchPosts.length === 0 ? (
                  "Không tìm thấy bài viết"
                ) : (
                  <>
                    {postData.searchPosts.map((post, index) => (
                      <Post key={index} post={post} />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </Col>
        <Col sm={10} xs={24}>
          <Divider>người dùng</Divider>

          <div className="search-list">
            {userLoading ? (
              <>
                {[
                  ...Array(4).map((_, index) => (
                    <Skeleton key={index} active avatar paragraph={1} />
                  )),
                ]}
              </>
            ) : (
              <>
                {userData.searchUsers.length === 0 ? (
                  "Không tìm thấy người dùng"
                ) : (
                  <>
                    {userData.searchUsers.map((user, index) => (
                      <SuggestUser user={user} key={index} />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default SearchPage;
