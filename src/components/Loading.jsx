import React from "react";
import styled, { keyframes } from "styled-components";
import { GlobleConnection } from "./Icon";

const rotate360 = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 40px;
    height: 40px;
    animation: ${rotate360} 2s linear infinite;
  }
`;

const Loading = () => {
  return (
    <Wrapper>
      <GlobleConnection />
    </Wrapper>
  );
};

export default Loading;
