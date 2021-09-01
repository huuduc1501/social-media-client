import React, { useEffect, useRef } from "react";
import { Picker } from "emoji-mart";
import styled from "styled-components";
import { useApolloClient } from "@apollo/client";
import { MODE } from "../queries/client";

import { SmileOutlined } from "./Icon";

const Wrapper = styled.div`
  position: relative;

  .emoji__picker--toggle {
  }
  .emoji__picker--content {
    display: none;
  }
  .active {
    display: block;
  }
  @media (max-width: 425px) {
    .emoji-mart {
      width: 280px !important;
    }
  }
`;

export const clickOutsideRef = (contentRef, toggleRef) => {
  document.addEventListener("mousedown", (e) => {
    // user click toggle
    if (toggleRef.current && toggleRef.current.contains(e.target)) {
      contentRef.current.classList.toggle("active");
    } else {
      // user click outside toggle and content
      if (contentRef.current && !contentRef.current.contains(e.target)) {
        contentRef.current.classList.remove("active");
      }
    }
  });
};

const EmojiPicker = ({ setValue, pickerStyle }) => {
  const contentRef = useRef(null);
  const toggleRef = useRef(null);
  const client = useApolloClient();
  const { mode } = client.readQuery({ query: MODE });

  useEffect(() => {
    clickOutsideRef(contentRef, toggleRef);
  }, []);

  const handleAddEmoji = (emoji) => {
    setValue((preValue) => preValue + emoji.native);
  };
  return (
    <Wrapper>
      <div ref={toggleRef} className="emoji__picker--toggle">
        <SmileOutlined />
      </div>
      <div ref={contentRef} className="emoji__picker--content">
        <Picker
          set="apple"
          theme={mode}
          style={{
            position: "absolute",
            zIndex: "9",
            ...pickerStyle,
          }}
          onSelect={handleAddEmoji}
        />
      </div>
    </Wrapper>
  );
};

export default EmojiPicker;
