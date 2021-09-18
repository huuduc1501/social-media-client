import { useApolloClient } from "@apollo/client";
import { Avatar } from "antd";
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { GET_ME } from "../../queries/user";

const Wrapper = styled.div`
  /* border: 1px solid black; */
  /* padding: 0.4rem 0.8rem; */
  padding: 1px 0;

  .active,
  .preview-item:hover {
    background-color: ${(props) => props.theme.secondSurface};
  }
  .preview-item {
    padding: 0.4rem 0.8rem;
    border-radius: 8px;
    display: flex;
    gap: 1rem;
  }
  .preview__username {
    font-weight: 400;
  }
  .preview__right {
    overflow: hidden;
    color: ${(props) => props.theme.onSecondSurface};
  }
  .preview__right p {
    margin: 0;
  }
  .unRead {
    color: ${(props) => props.theme.onSurface};
  }
  @media (max-width: 600px) {
    .preview__right {
      display: none;
    }
  }
`;

const PreviewConversation = ({ conversation }) => {
  console.log("render preview");
  const client = useApolloClient();
  const {
    me: { _id: myId },
  } = client.readQuery({ query: GET_ME });
  let user = {};

  if (!conversation) return null;
  if (conversation.type === "single") {
    user = conversation.members.find((member) => member._id !== myId);
  }

  return (
    <Wrapper>
      <NavLink
        to={`/chat/${conversation._id}`}
        className="preview-item"
        activeClassName="active"
      >
        <div className="preview__left">
          {conversation.type === "single" ? (
            <Avatar src={user.avatar} size="large" />
          ) : (
            <Avatar size="large" />
          )}
        </div>
        <div
          className={
            conversation.readed ? "preview__right" : "unRead preview__right"
          }
        >
          <span className="preview__username">
            {conversation.type === "single"
              ? user.username
              : conversation.title}
          </span>
          <p>
            {conversation.lastMessage?.isMine && "Bạn:"}
            {conversation.lastMessage?.message}
          </p>
        </div>
      </NavLink>
    </Wrapper>
  );
};

export default PreviewConversation;
