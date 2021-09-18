import { Avatar, Image } from "antd";
import React from "react";
import styled, { css } from "styled-components";
import { ClipOutlined } from "../Icon";

const Wrapper = styled.div`
  /* border: 1px solid black; */
  /* display: flex; */
  .message-body {
    width: 100%;
    display: flex;
  }

  .message-avatar {
    padding-top: 0.7rem;
  }
  .message-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 70%;
  }

  .message-content img {
    min-height: 100px;
    /* max-height:300px; */
  }

  .message-username {
    font-size: 0.7rem;
  }
  .message-text {
    padding: 0.2rem 0.8rem;
    background-color: ${(props) => props.theme.messageBg};
    color: ${(props) => props.theme.onMessage};
    border-radius: 1rem;
  }
  .message-text p {
    margin: 0;
    word-break: break-word;
  }

  .inner__file {
    display: flex;
    gap: 0.3rem;
    align-items: center;
  }
  .inner__file svg {
    width: 1rem;
    height: 1rem;
  }

  a {
    color:inherit;
  }

  ${(props) =>
    props.isMine &&
    css`
      .message-body {
        justify-content: flex-end;
      }
      .message-avatar {
        order: 3;
      }
      .message-content {
        align-items: flex-end;
      }
      .message-text {
        background-color: ${(props) => props.theme.secondMessageBg};
        color: ${(props) => props.theme.onSecondMessage};
      }
      .message-action {
        order: 1;
      }
    `}
  ${(props) =>
    props.isImage &&
    css`
      .message-text {
        padding: 0;
        background-color: transparent;
      }
    `}
`;

const Message = ({ message }) => {
  // if (message.type === "file") console.log(message);
  // console.log(message);
  return (
    <Wrapper isMine={message.isMine} isImage={message.type === "image"}>
      <div className="message-body">
        <div className="message-avatar">
          <Avatar src={message.sender.avatar} />
        </div>
        <div className="message-content">
          <div className="message-username">{message.sender.username}</div>
          <div className="message-text">
            {message.type === "image" &&
              message.images.map((path, index) => (
                <Image
                  key={index}
                  src={
                    path.startsWith("blob")
                      ? path
                      : process.env.REACT_APP_API_ENDPOINT + "/" + path
                  }
                />
              ))}
            {message.type === "file" &&
              message.files.map((file, index) => {
                return (
                  <div className="inner__file" key={index}>
                    <ClipOutlined />
                    <a
                      href={
                        file.path === ""
                          ? ""
                          : process.env.REACT_APP_API_ENDPOINT + "/" + file.path
                      }
                      download
                    >
                      {file.name}
                    </a>
                  </div>
                );
              })}
            <p>{message.message}</p>
          </div>
        </div>
        <div className="message-action"></div>
      </div>
    </Wrapper>
  );
};

export default Message;
