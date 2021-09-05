import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApolloClient, useQuery } from "@apollo/client";
import styled from "styled-components";
import TextArea from "antd/lib/input/TextArea";

import EmojiPicker from "../EmojiPicker";
import Message from "./Message";
import { GET_MESSAGES } from "../../queries/conversation";
import { Button } from "antd";
import useSocket from "../../hooks/useSocket";
import { GET_ME } from "../../queries/user";

const Wrapper = styled.div`
  border: 1px solid black;
  height: 100%;

  .chat-board {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .chat-log {
    flex-grow: 1;
    overflow: auto;
    /* display: flex;
    flex-direction: column;
    gap: 1rem; */
  }

  .chat-log > * {
    margin: 8px 0;
  }

  .add-chat {
    display: flex;
  }
  svg {
    width: 24px;
    height: 24px;
  }
`;

const ChatLog = () => {
  const { conversationId } = useParams();
  const socket = useSocket();
  const client = useApolloClient();
  const { me } = client.readQuery({ query: GET_ME });
  const { loading, data } = useQuery(GET_MESSAGES, {
    variables: {
      conversationId,
      limit: 20,
    },
  });
  const [messageValue, setMessageValue] = useState("");

  console.log(conversationId);

  useEffect(() => {
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
  });

  const handleSendMessage = () => {
    if (!messageValue) return;

    const message = {
      message: messageValue,
      type: "text",
      conversationId,
    };
    setMessageValue("");

    socket.emit("new-message", message);
    client.cache.modify({
      id: "ROOT_QUERY",
      fields: {
        getMessages(exist) {
          return {
            paging: exist.paging,
            messages: [
              ...exist.messages,
              {
                ...message,
                isMine: true,
                sender: me,
                conversation: conversationId,
              },
            ],
          };
        },
      },
    });
  };

  if (loading) return null;

  return (
    <Wrapper>
      <div className="chat-board">
        <div className="chat-log">
          {data?.getMessages.messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </div>
        <div className="add-chat">
          <EmojiPicker
            setValue={setMessageValue}
            pickerStyle={{ bottom: "3rem", left: "1rem" }}
          />
          <TextArea
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
          />
          <Button onClick={handleSendMessage}>gửi</Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default ChatLog;
