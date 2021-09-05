import { Avatar } from "antd";
import React from "react";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  /* border: 1px solid black; */
  display: flex;
  .message-body {
    width: max-content;
    display: flex;
  }

  .message-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0.2rem 0.8rem;
    background-color: ${(props) => props.theme.secondSurface};
    border-radius: 1rem;
  }
  ${(props) =>
    props.isMine &&
    css`
      justify-content: flex-end;
      .message-avatar {
        order: 3;
      }
      .message-content {
        align-items: flex-end;
      }
      .message-action {
        order: 1;
      }
    `}
`;

const Message = ({ message }) => {
  return (
    <Wrapper isMine={message.isMine}>
      <div className="message-body">
        <div className="message-avatar">
          <Avatar src={message.sender.avatar} />
        </div>
        <div className="message-content">
          <div className="message-username">{message.sender.username}</div>
          <div className="message-text">{message.message}</div>
        </div>
        <div className="message-action"></div>
      </div>
    </Wrapper>
  );
};

export default Message;
