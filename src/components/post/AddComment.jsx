import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import TextArea from "antd/lib/input/TextArea";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

import { ADD_COMMENT } from "../../queries/comment";
import { SmileOutlined, Send } from "../Icon";
import { clickOutsideRef } from "../../utils/index";
import { MODE } from "../../queries/client";

const Wrapper = styled.div`
  padding: 0 1rem;
  display: flex;
  align-items: center;
  border-top: 1px solid ${(props) => props.theme.borderColor};
  textarea {
    flex-grow: 2;
    background-color: ${(props) => props.theme.bg};
    color: ${(props) => props.theme.onSurface};
  }
  .comment__emoji--picker {
    position: relative;
  }
  .emoji__picker--content {
    display: none;
  }
  .active {
    display: block;
  }

  .active {
    display: block;
  }
`;

const AddComment = ({ post, setCommentList }) => {
  const [textAreaValue, setTextAreaValue] = useState("");
  const emojiPickerRef = useRef(null);
  const toggleEmojiRef = useRef(null);
  const client = useApolloClient();
  const { mode } = client.readQuery({ query: MODE });

  const [addCommentMutation] = useMutation(ADD_COMMENT, {
    update: (cache, { data: { addComment } }) => {
      setCommentList((commentList) => [...commentList, addComment]);

      cache.writeFragment({
        id: `Post:${post._id}`,
        fragment: gql`
          fragment addNewComment on Post {
            commentsCount
            comments {
              _id
              text
              user {
                _id
                username
                avatar
              }
            }
          }
        `,
        data: {
          comments: [addComment].concat(post.comments),
          commentsCount: 1 + +post.commentsCount,
        },
      });
    },
  });

  useEffect(() => {
    clickOutsideRef(emojiPickerRef, toggleEmojiRef);
  }, []);

  const handleAddComment = async (e) => {
    if (!textAreaValue) return;
    try {
      await addCommentMutation({
        variables: {
          postId: post._id,
          text: textAreaValue,
        },
      });
      setTextAreaValue("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddEmoji = (emoji) => {
    setTextAreaValue(textAreaValue + emoji.native);
  };
  return (
    <Wrapper>
      <div className="comment__emoji--picker">
        <div ref={toggleEmojiRef}>
          <SmileOutlined />
        </div>

        <div ref={emojiPickerRef} className="emoji__picker--content">
          <Picker
            set="apple"
            theme={mode}
            style={{
              position: "absolute",
              bottom: "2rem",
              left: "20px",
              zIndex: "9",
            }}
            onSelect={handleAddEmoji}
          />
        </div>
      </div>
      <TextArea
        autoSize={{ minRows: 1, maxRows: 4 }}
        bordered={false}
        value={textAreaValue}
        name="text"
        onChange={(e) => setTextAreaValue(e.target.value)}
        placeholder="Thêm bình luận"
      />
      <Send className="emoji-send" onClick={handleAddComment} />
    </Wrapper>
  );
};

// const PickerWrapper = styled.div`
//   /* display: none; */
//   position: absolute;
//   bottom: 2rem;
//   left: 20px;
//   z-index: 9;
// `;

export default AddComment;
