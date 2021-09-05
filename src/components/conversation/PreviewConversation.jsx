import { useApolloClient } from "@apollo/client";
import { Avatar } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { GET_ME } from "../../queries/user";

const Wrapper = styled.div`
  border: 1px solid black;
  padding: 0.4rem 0.8rem;
  display: flex;
  gap: 1rem;
`;

const PreviewConversation = ({ conversation }) => {
  const client = useApolloClient();
  const {
    me: { _id: myId },
  } = client.readQuery({ query: GET_ME });
  let user = {};
  if (!conversation) return null;
  if (conversation.type === "single") {
    user = conversation.members.find((member) => member._id !== myId);
  }
  console.log(user);
  return (
    <Wrapper>
      <Link to={`/chat/${conversation._id}`}>
        <div className="preview__left">
          <Avatar />
        </div>
        <div className="preview__right">
          <span>
            {conversation.type === "single"
              ? user.username
              : conversation.title}
          </span>
          <span className={conversation.readed ? "readed" : ""}>
            {conversation.lastMessage}
          </span>
        </div>
      </Link>
    </Wrapper>
  );
};

export default PreviewConversation;
