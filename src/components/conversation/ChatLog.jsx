import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useApolloClient, useQuery } from "@apollo/client";
import styled from "styled-components";

import Message from "./Message";
import {
  GET_MESSAGES,
  GET_SPECIFY_CONVERSATION,
} from "../../queries/conversation";
import { Avatar } from "antd";
import useSocket from "../../hooks/useSocket";
import { GET_ME } from "../../queries/user";
import ChatInput from "./ChatInput";
import InfiniteScroll from "react-infinite-scroll-component";

const Wrapper = styled.div`
  border: 1px solid black;
  height: 100%;

  .chat__board {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .chat__board--header{
    padding: .2rem .8rem;
    border-bottom: 1px solid ${props => props.theme.borderColor};
  }
  .chat-log {
    flex-grow: 1;
    overflow: auto;
    scroll-behavior: smooth;
    /* display: flex;
    flex-direction: column;
    gap: 1rem; */
  }

  .chat-log > * {
    margin: 8px 0;
  }

  .chat-log::-webkit-scrollbar {
    background-color: transparent;
    width: 6px;
    visibility: hiden;
  }

  .chat-log::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.secondaryColor};
    border-radius: 10px;
  }

  .add-chat {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  svg {
    width: 24px;
    height: 24px;
  }
`;

const ChatLog = () => {
  console.log("render log");
  const { conversationId } = useParams();
  const socket = useSocket();
  const client = useApolloClient();
  const { me } = client.readQuery({ query: GET_ME });
  const { loading, error, data, fetchMore } = useQuery(GET_MESSAGES, {
    variables: {
      conversationId,
      limit: 20,
    },
    fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-only",
  });
  const { data: conversationData } = useQuery(GET_SPECIFY_CONVERSATION, {
    variables: {
      conversationId,
    },
    fetchPolicy: "cache-first",
  });
  const chatLogRef = useRef(null);

  useEffect(() => {
    if (socket)
      socket.on("new-message", (data) => {
        if (data.sender._id.toString() !== me._id.toString())
          client.cache.modify({
            id: "ROOT_QUERY",
            fields: {
              getMessages(exist) {
                return {
                  paging: exist.paging,
                  messages: [...exist.messages, data],
                };
              },
            },
          });
      });
  }, [me._id, socket, client.cache]);

  let user = {};
  if (conversationData?.getSpecifyConversation.type === "single") {
    user = conversationData.getSpecifyConversation.members.find(
      (member) => member._id !== me._id
    );
  }

  useEffect(() => {
    if (chatLogRef.current)
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, [data]);

  const fetchMoreMessage = async () => {
    console.log("fetchMore");
    await fetchMore({
      variables: {
        conversationId,
        limit: 10,
        cursor: data.getMessages.paging.nextCursor,
      },
    });
    console.log("end fetchMore");
  };

  if (loading) return "loading...";

  if (error) return "Không tìm thấy";
  return (
    <Wrapper>
      <div className="chat__board">
        <div className="chat__board--header">
          {conversationData?.getSpecifyConversation.type === "single" ? (
            <>
              <Avatar src={user.avatar} />
              <span>{user.username}</span>
            </>
          ) : (
            <Avatar />
          )}
        </div>
        <div className="chat-log" ref={chatLogRef}>
          {/* <InfiniteScroll
            dataLength={data.getMessages.messages.length}
            hasMore={data.getMessages.paging.hasMore}
            next={fetchMoreMessage}
            inverse={true}
            // endMessage='hết'
          > */}
            {data?.getMessages.messages.map((message, index) => (
              <Message key={index} message={message} />
            ))}
          {/* </InfiniteScroll> */}
        </div>
        <div className="add-chat">
          <ChatInput data={data} />
        </div>
      </div>
    </Wrapper>
  );
};

export default ChatLog;
