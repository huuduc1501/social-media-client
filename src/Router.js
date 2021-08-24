import { useQuery } from "@apollo/client";
import { message } from "antd";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";

import Navbar from "./components/layouts/Navbar";
import Loading from "./components/Loading";
import EditProfile from "./pages/EditProfile";
import Explore from "./pages/Explore";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import SpecificPost from "./pages/SpecificPost";
import { GET_ME } from "./queries/user";

const PageWrapper = styled.div`
  /* width: 100vw; */
  padding-top: 5rem;
  background-color: ${(props) => props.theme.bg};
  min-height: 100vh;
`;

const RootRouter = () => {
  const { loading, error } = useQuery(GET_ME, {
    fetchPolicy: 'cache-first'
  })
  if (loading) return <Loading />
  if (error) return message.error(error.message)
  return (
    <Router>
      <Navbar />

      <PageWrapper>
        <div className="container">
          <Switch>
            <Route path='/explore'>
              <Explore />
            </Route>
            <Route path='/a/edit'>
              <EditProfile />
            </Route>
            <Route path="/u/:userId">
              <Profile />
            </Route>
            <Route path={`/p/:postId`}>
              <SpecificPost />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </PageWrapper>
    </Router >
  );
};

export default RootRouter;
