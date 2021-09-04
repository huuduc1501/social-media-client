import { useApolloClient } from "@apollo/client";
import { Avatar } from "antd";
import React from "react";
import styled from "styled-components";
import { GET_ME } from "../../queries/user";

const Wrapper = styled.div``;

const PreviewConversation = ({ conversation }) => {
  const client = useApolloClient();
  const {
    me: { _id: myId },
  } = client.readQuery({ query: GET_ME });
  let user = {};
  if (conversation.type === "single") {
    user = conversation.members.find((member) => member._id !== myId);
  }
  console.log(user);
  return (
    <Wrapper>
      <div className="preview__left">
        <Avatar />
      </div>
      <div className="preview__right">
        <span>
          {conversation.type === "single" ? user.name : conversation.title}
        </span>
        <span className={conversation.readed ? "readed" : ""}>
          {conversation.lastMessage}
        </span>
      </div>
    </Wrapper>
  );
};

export default PreviewConversation;
