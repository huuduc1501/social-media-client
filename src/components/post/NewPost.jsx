import React, { useState, useEffect } from "react";
import { Avatar, Modal, Upload, Button, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useApolloClient, useMutation } from "@apollo/client";
import styled from "styled-components";
import { GET_ME } from "../../queries/user";
import { Link, useHistory } from "react-router-dom";
import { ImageOutlined, PlusOutlined } from "../Icon";

import { CREATE_POST } from "../../queries/post";
import { uploadImage } from "../../utils";
import EmojiPicker from "../EmojiPicker";

const Wrapper = styled.div`
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: ${(props) => props.theme.borderRadius};
  color: ${(props) => props.theme.onSurface};

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
  svg {
    width: 22px;
    height: 22px;
    fill: ${(props) => props.theme.onSurface};
  }

  textarea {
    background: ${(props) => props.theme.bg};
    color: ${(props) => props.theme.onBg};
    border: 0;
  }
  textarea:focus {
    border-color: unset;
    box-shadow: unset;
  }
  a {
    color: unset;
  }
  .ant-upload.ant-upload-select-picture-card {
    background-color: ${(props) => props.theme.bg};
    color: ${(props) => props.theme.onBg};
  }
  .ant-upload.ant-upload-select-picture-card .text {
    color: ${(props) => props.theme.onBg};
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
  const [openUploadBox, setOpenUploadBox] = useState(false);
  const [loadingCreatePost, setLoadingCreatePost] = useState(false);
  const [createPostMutattion] = useMutation(CREATE_POST, {
    update: (cache, { data: { createPost } }) => {
      //  cách 1: ghi đè lại feed, và k trigger hàm merge

      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          feed(existing) {
            return {
              paging: existing.paging,
              posts: [{ __ref: `Post:${createPost._id}` }, ...existing.posts],
            };
          },
        },
      });

      // cach 2: nối thêm bài đăng mới vào feed bằng hàm merge

      // const { feed } = cache.readQuery({ query: GET_NEW_FEED });
      // console.log(feed);
      // cache.writeQuery({
      //   query: GET_NEW_FEED,
      //   data: {
      //     feed: { paging: feed.paging, posts: [createPost] },
      //   },
      // });
    },
  });
  useEffect(() => {
    if (openUploadBox) {
      const el = document.getElementsByClassName("ant-upload-select");
      el[0].firstElementChild.click();
    }
  }, [openUploadBox]);
  const handleChangeFile = (info) => {
    setImageList(info.fileList);
  };
  const onHandlePreview = (file) => {
    if (previewImage) URL.revokeObjectURL(previewImage);
    setPreviewImage(URL.createObjectURL(file.originFileObj));
    setPreviewVisible(true);
  };
  const onHandleCancel = () => setPreviewVisible(false);

  const onHandleOpenUpload = (e) => {
    setOpenUploadBox(true);
  };

  const onHandleBeforeUpload = (file) => {
    if (!file.type.includes("image")) {
      message.error("vui lòng chọn hình ảnh");
      return Upload.LIST_IGNORE;
    }
    // if (file.size > 2 * 1024 * 1024) {
    //   message.error("chọn ảnh có kích thước nhở hơn 2mb");
    //   return Upload.LIST_IGNORE;
    // }

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
        await createPostMutattion({
          variables: {
            caption,
            tags,
            files,
          },
        });
        setTextAreaValue("");
        setImageList([]);
        setOpenUploadBox(false);
        message.success("thành công");
        if (previewImage) URL.revokeObjectURL(previewImage);
      } else {
        message.error("Vui lòng chọn hình ảnh!");
      }
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
    setLoadingCreatePost(false);
  };

  return (
    <Wrapper>
      <div className="new__post-header">
        <div className="header-left">
          <Link to={`/u/${me._id}`}>
            <Avatar src={me.avatar} />
          </Link>
          <Link to={`/u/${me._id}`}>{me.username}</Link>
        </div>

        <div className="header-right">
          {!openUploadBox && (
            <div>
              <ImageOutlined onClick={onHandleOpenUpload} />
            </div>
          )}
          <div className="emoji-picker">
            <EmojiPicker
              setValue={setTextAreaValue}
              pickerStyle={{ right: "0" }}
            />
          </div>
          <div>
            <Button loading={loadingCreatePost} onClick={onHandleCreatePost}>
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
          maxLength={100}
        />
      </div>
      <div className="new__post-footer">
        {openUploadBox && (
          <Upload
            fileList={imageList}
            beforeUpload={onHandleBeforeUpload}
            onPreview={onHandlePreview}
            listType="picture-card"
            onChange={handleChangeFile}
            multiple={true}
            accept="image/*"
            maxCount={8}
          >
            <UploadWrapper>
              <PlusOutlined />
              <div className="text">chọn ảnh</div>
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
