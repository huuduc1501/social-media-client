import React, { useState } from "react";
import styled from "styled-components";
import { Avatar } from "antd";
import ToggleFollow from "./ToggleFollow";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: ${(props) => props.theme.borderRadius};
  background-color: ${(props) => props.theme.surface};
  padding: 0.5rem 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  > *:nth-child(2) {
    flex-grow: 2;
  }
  .suggest-name > * {
    display: block;
  }
  img {
    cursor: pointer;
  }
  .suggest-name > *:first-child {
    font-weight: 600;
    cursor: pointer;
  }

  a {
    color: unset;
  }

  button {
    background-color: transparent;
    border: 1px solid ${(props) => props.theme.onSecondSurface};
    border-radius: ${(props) => props.theme.borderRadius};
    outline: none;
    cursor: pointer;
    transition: border-color 0.3s, background-color 0.3s;
  }
  button:hover {
    border-color: ${(props) => props.theme.onSurface};
    background-color: ${(props) => props.theme.bg};
  }
`;

const SuggestUser = ({ user }) => {
  return (
    <Wrapper>
      <Link to={`/u/${user._id}`}>
        <Avatar src={user.avatar} />
      </Link>
      <div className="suggest-name">
        <span>
          <Link to={`/u/${user._id}`}>{user.username}</Link>
        </span>
        <span>{user.fullname}</span>
      </div>
      {!user.isMe && (
        <button>
          <ToggleFollow
            isFollowing={user.isFollowing}
            userId={user._id}
            style={{ padding: "0.2rem 0.8rem" }}
          />
        </button>
      )}
    </Wrapper>
  );
};

export default SuggestUser;
