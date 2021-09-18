import { useQuery } from "@apollo/client";
import { message } from "antd";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import ChatInput from "./components/conversation/ChatInput";

import Navbar from "./components/layouts/Navbar";
import Loading from "./components/Loading";
import WebSocketProvider from "./contexts/Socket";
import ChatPage from "./pages/ChatPage";
import EditProfile from "./pages/EditProfile";
import Explore from "./pages/Explore";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import SearchPage from "./pages/SearchPage";
import SpecificPost from "./pages/SpecificPost";
import { GET_ME } from "./queries/user";

const PageWrapper = styled.div`
  width: 100%;
  padding-top: 1rem;
  background-color: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.onBg};
  min-height: calc(100vh - 60px);
`;

const RootRouter = () => {
  const { loading, error } = useQuery(GET_ME, {
    fetchPolicy: 'cache-first'
  })
  if (loading) return <Loading />
  if (error) return message.error(error.message)
  return (
    <WebSocketProvider>
      <Router>
        <Navbar />
        <PageWrapper>
          <div className="container">
            <Switch>
              <Route path='/test'>
                <ChatInput /> 
              </Route>
              <Route path='/timkiem'>
                <SearchPage />
              </Route>
              <Route path='/chat'>
                <ChatPage />
              </Route>
              <Route path='/explore'>
                <Explore />
              </Route>
              <Route path='/a/edit'>
                <EditProfile />
              </Route>
              <Route path="/u/:userId">
                <Profile />
              </Route>
              <Route path="/u/:userId/saved">
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
    </WebSocketProvider>
  );
};

export default RootRouter;
