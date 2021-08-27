import React from "react";
import styled from "styled-components";
import underC from "../assets/images/under-construction.webp";

const Wrapper = styled.div`
  height: 80vh;
  background: url(${underC}) no-repeat center;
  background-size: contain;
`;

const ChatPage = () => {
  return <Wrapper></Wrapper>;
};

export default ChatPage;
