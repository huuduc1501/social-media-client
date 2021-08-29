import React, { useState } from "react";
import styled from "styled-components";
import TextArea from "antd/lib/input/TextArea";
import { gql, useMutation } from "@apollo/client";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

import { ADD_COMMENT } from "../../queries/comment";
import { SmileOutlined, Send } from "../Icon";

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
  .emoji-picker {
    position: relative;
  }
  /* .emoji-send {
    position: absolute;
    top: 0;
    right: 1rem;
  } */
`;

const AddComment = ({ post, isSpecific }) => {
  const [textAreaValue, setTextAreaValue] = useState("");
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);

  const [addCommentMutation] = useMutation(ADD_COMMENT, {
    update: (cache, { data: { addComment } }) => {
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
          comments: post.comments.concat(addComment),
          commentsCount: 1 + +post.commentsCount,
        },
      });
    },
  });

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
      <div className="emoji-picker">
        <SmileOutlined onClick={() => setIsOpenEmoji(!isOpenEmoji)} />
        {isOpenEmoji && (
          <Picker
            set="apple"
            style={{ position: "absolute", bottom: "2rem", left: "20px" }}
            onSelect={handleAddEmoji}
          />
        )}
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

export default AddComment;
