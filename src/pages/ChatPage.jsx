import { useQuery } from "@apollo/client";
import React from "react";
import styled from "styled-components";

import PreviewConversation from "../components/conversation/PreviewConversation";
import underC from "../assets/images/under-construction.webp";
import { GET_CONVERSATIONS } from "../queries/user";
import ChatLog from "../components/conversation/ChatLog";

const Wrapper = styled.div`
  height: 80vh;
  background-color: ${(props) => props.theme.surface};

  .specific-chat,
  .side-bar {
    height: 80vh;
  }
  .content {
    display: grid;
    grid-template-columns: 30% 70%;
    height: 100%;
  }
`;

const ChatPage = () => {
  const { loading, data } = useQuery(GET_CONVERSATIONS, {
    variables: { limit: 5 },
    fetchPolicy: "cache-first",
  });

  if (loading) return "loading...";
  console.log(data);
  return (
    <Wrapper>
      <div className="content">
        <div className="sidebar">
          {data?.getConversations.conversations.map((conversation, index) => {
            return (
              <PreviewConversation key={index} conversation={conversation} />
            );
          })}
        </div>
        <div className="specific-chat">
          <ChatLog />
        </div>
      </div>
    </Wrapper>
  );
};

export default ChatPage;
