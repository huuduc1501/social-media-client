import React, { useState } from "react";
import styled from "styled-components";
import TextArea from "antd/lib/input/TextArea";
import { gql, useMutation } from "@apollo/client";

import "emoji-mart/css/emoji-mart.css";

import { ADD_COMMENT } from "../../queries/comment";
import { Send } from "../Icon";
import EmojiPicker from "../EmojiPicker";

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
`;

const AddComment = ({ post, setCommentList }) => {
  const [textAreaValue, setTextAreaValue] = useState("");

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

  return (
    <Wrapper>
      <div className="comment__emoji--picker">
        <EmojiPicker
          setValue={setTextAreaValue}
          pickerStyle={{ bottom: "2rem" }}
        />
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
