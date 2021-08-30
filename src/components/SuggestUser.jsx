import React from "react";
import styled from "styled-components";
import { Avatar } from "antd";
import ToggleFollow from "./ToggleFollow";
import { useHistory } from "react-router-dom";

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

  button {
    background-color: transparent;
    border: 1px solid ${(props) => props.theme.onSecondSurface};
    border-radius: ${(props) => props.theme.borderRadius};
    padding: 0.2rem 0.8rem;
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
  const history = useHistory();
  return (
    <Wrapper>
      <Avatar
        src={user.avatar}
        onClick={() => history.push(`/u/${user._id}`)}
      />
      <div className="suggest-name">
        <span onClick={() => history.push(`/u/${user._id}`)}>
          {user.username}
        </span>
        <span>{user.fullname}</span>
      </div>
      {!user.isMe && (
        <ToggleFollow isFollowing={user.isFollowing} userId={user._id}>
          <button>{user.isFollowing ? "unfollow" : "follow"}</button>
        </ToggleFollow>
      )}
    </Wrapper>
  );
};

export default SuggestUser;
