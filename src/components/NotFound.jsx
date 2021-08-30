import React from "react";
import notFound from "../assets/images/not-found.png";

import styled from "styled-components";

const Wrapper = styled.div`
  height: 80vh;
  background: url(${notFound}) no-repeat center;
  background-size: contain;
`;

const NotFound = () => {
  return <Wrapper />;
};

export default NotFound;
