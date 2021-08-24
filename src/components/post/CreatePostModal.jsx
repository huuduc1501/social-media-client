import { Modal } from "antd";
import React from "react";
import NewPost from "./NewPost";

const CreatePostModal = (props) => {
  return (
    <Modal {...props} footer={null} closable={false}>
      <NewPost />
    </Modal>
  );
};

export default CreatePostModal;
