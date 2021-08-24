import React, { useState, useEffect } from "react";
import { Avatar, Modal, Upload, Button, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useApolloClient, useMutation } from "@apollo/client";
import styled from "styled-components";
import { GET_ME, GET_NEW_FEED } from "../../queries/user";
import { useHistory } from "react-router-dom";
import { Picker } from "emoji-mart";
import { ImageOutlined, SmileOutlined, PlusOutlined } from "../Icon";

import { CREATE_POST } from "../../queries/post";
import { uploadImage } from "../../utils";

const Wrapper = styled.div`
  padding: 0.5rem 1rem;
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: ${(props) => props.theme.borderRadius};
  background-color: white;
  > * {
    padding: 0.3rem 0;
  }
  .new__post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .new__post-header > * {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  .new__post-footer {
  }
  .emoji-picker {
    position: relative;
  }
  svg {
    width: 22px;
    height: 22px;
  }
`;
const UploadWrapper = styled.div``;

const NewPost = () => {
  const history = useHistory();
  const client = useApolloClient();
  const { me } = client.readQuery({ query: GET_ME });
  const [imageList, setImageList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const [openUploadBox, setOpenUploadBox] = useState(false);
  const [loadingCreatePost, setLoadingCreatePost] = useState(false);
  const [createPostMutattion] = useMutation(CREATE_POST, {
    update: (cache, { data: { createPost } }) => {
      const { feed } = cache.readQuery({ query: GET_NEW_FEED });
      cache.writeQuery({
        query: GET_NEW_FEED,
        data: { feed: [createPost, ...feed] },
      });
    },
  });
  useEffect(() => {
    if (openUploadBox) {
      const el = document.getElementsByClassName("ant-upload-select");
      console.log(el[0]);
      el[0].firstElementChild.click();
    }
  }, [openUploadBox]);
  const handleChangeFile = (info) => {
    setImageList(info.fileList);
  };
  const onHandlePreview = (file) => {
    if (!file.preview) {
      file.preview = URL.createObjectURL(file.originFileObj);
    }
    setPreviewImage(file.preview);
    setPreviewVisible(true);
  };
  const onHandleCancel = () => setPreviewVisible(false);
  const handleAddEmoji = (emoji) => {
    setTextAreaValue(textAreaValue + emoji.native);
  };
  const onHandleOpenUpload = (e) => {
    setOpenUploadBox(true);
  };

  const onHandleBeforeUpload = (file) => {
    if (!file.type.includes("image")) {
      return message.error("vui lòng chọn hình ảnh");
    }
    console.log(file);
    return false;
  };

  const onHandleCreatePost = async () => {
    let caption;
    let tags = [];
    let files = [];
    setLoadingCreatePost(true);
    if (textAreaValue) {
      caption = textAreaValue;
      tags = textAreaValue.split(" ").filter((word) => word.startsWith("#"));
    }
    try {
      if (imageList.length) {
        for (let i = 0; i < imageList.length; i++) {
          const fileUrl = await uploadImage(imageList[i].originFileObj);
          files.push(fileUrl);
        }
      }
      await createPostMutattion({
        variables: {
          caption,
          tags,
          files,
        },
      });
    } catch (error) {
      message.error(error.message);
      console.error(error);
      setLoadingCreatePost(false);
      return;
    }
    setTextAreaValue("");
    setImageList([]);
    setOpenUploadBox(false);
    setLoadingCreatePost(false);
    message.success("thành công");
  };

  return (
    <Wrapper>
      <div className="new__post-header">
        <div className="header-left">
          <Avatar
            src={me.avatar}
            onClick={() => history.push(`/u/${me._id}`)}
          />
          <span onClick={() => history.push(`/u/${me._id}`)}>
            {me.username}
          </span>
        </div>

        <div className="header-right">
          {!openUploadBox && (
            <div>
              <ImageOutlined onClick={onHandleOpenUpload} />
            </div>
          )}
          <div className="emoji-picker">
            <SmileOutlined onClick={() => setIsOpenEmoji(!isOpenEmoji)} />
            {isOpenEmoji && (
              <Picker
                set="apple"
                style={{
                  position: "absolute",
                  top: "2rem",
                  left: "20px",
                  zIndex: "99",
                }}
                onSelect={handleAddEmoji}
              />
            )}
          </div>
          <div>
            <Button
              loading={loadingCreatePost}
              type="primary"
              onClick={onHandleCreatePost}
            >
              Đăng
            </Button>
          </div>
        </div>
      </div>
      <div className="new__post-body">
        <TextArea
          autoSize={true}
          value={textAreaValue}
          name="caption"
          placeholder="Đăng bài"
          onChange={(e) => setTextAreaValue(e.target.value)}
        />
      </div>
      <div className="new__post-footer">
        {}
        {openUploadBox && (
          <Upload
            fileList={imageList}
            beforeUpload={onHandleBeforeUpload}
            onPreview={onHandlePreview}
            listType="picture-card"
            onChange={handleChangeFile}
            multiple={true}
            accept="image/*"
          >
            <UploadWrapper>
              <PlusOutlined />
              <div>chọn ảnh</div>
            </UploadWrapper>
          </Upload>
        )}

        <Modal
          title="Xem trước"
          visible={previewVisible}
          footer={null}
          onCancel={onHandleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    </Wrapper>
  );
};

export default NewPost;