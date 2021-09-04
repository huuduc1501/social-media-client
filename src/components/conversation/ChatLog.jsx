import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import TextArea from "antd/lib/input/TextArea";

import EmojiPicker from "../EmojiPicker";
import Message from "./Message";

const Wrapper = styled.div``;

const ChatLog = () => {
  const location = useLocation();
  const { data } = useQuery();
  const [messageValue, setMessageValue] = useState("");

  return (
    <Wrapper>
      <div className="chat-log">
        {data.messages.map((message) => (
          <Message message={message} />
        ))}
      </div>
      <div className="add-chat">
        <EmojiPicker setValue={setMessageValue} />
        <TextArea
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
        />
      </div>
    </Wrapper>
  );
};

export default ChatLog;
