import React, { useState } from "react";
import styled from "styled-components";
import { Form, Input, message, Button, Row, Col, Image } from "antd";
import { useApolloClient, useMutation } from "@apollo/client";
import { EDIT_PROFILE, GET_ME } from "../queries/user";
import { uploadImage } from "../utils";
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
/* eslint-disable no-template-curly-in-string */

const Wrapper = styled.div`
  width: 70%;
  padding: 2rem;
  margin: 4rem auto;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.surface};
  color: ${(props) => props.theme.onSurface};

  img {
    width: 70px;
    height: 70px;
    /* object-fit: cover; */
    /* border-radius: 50%; */
    border: 0;
  }

  .avatar-label {
    display: flex;
    flex-direction: column;
    color: ${(props) => props.theme.onSurface};
  }

  .avatar-label > label {
    cursor: pointer;
    color: #0f0fdf;
  }

  .edit-profile {
    width: 60%;
    margin: auto;
  }
  @media (max-width: 500px) {
    width: 100%;
    .edit-profile {
      width: 90%;
    }
  }

  input,
  textarea {
    background: ${(props) => props.theme.secondSurface};
    color: ${(props) => props.theme.onSurface};
    border: 0;
  }

  label {
    color: ${(props) => props.theme.onSurface};
  }

  .ant-image-mask-info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const EditProfile = () => {
  const client = useApolloClient();
  const { me } = client.readQuery({ query: GET_ME });
  const [editProfileMutation] = useMutation(EDIT_PROFILE, {});
  const [avatarFile, setAvatarFile] = useState({ url: me.avatar });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleImageUpload = (e) => {
    const imageUrl = URL.createObjectURL(e.target.files[0]);
    setAvatarFile({ url: imageUrl, file: e.target.files[0] });
  };

  const onFinish = async (values) => {
    setIsUpdating(true);
    const editObj = { ...values };
    if (avatarFile.file) {
      try {
        editObj.avatar = await uploadImage(avatarFile.file);
      } catch (error) {
        setIsUpdating(false);
        message.error("tải lên thất bại");
      }
    }
    try {
      // client.writeQuery({
      //   query: GET_ME,
      //   data: {
      //     ...editObj,
      //   },
      // });
      await editProfileMutation({
        variables: editObj,
      });
    } catch (error) {
      message.error(error.message);
      setIsUpdating(false);
    }
    setIsUpdating(false);
  };

  return (
    <Wrapper>
      <div className="edit-profile">
        <Form
          {...layout}
          name="edit-profile"
          onFinish={onFinish}
          initialValues={{
            username: me.username,
            email: me.email,
            fullname: me.fullname,
            bio: me.bio,
          }}
        >
          <Row gutter={16}>
            <Col span="8">
              <Image src={avatarFile.url} />
            </Col>
            <Col span="16">
              <div className="avatar-label">
                <span>{me.username}</span>
                <label htmlFor="change-avatar-link">
                  <span>thay đỗi ảnh đại diện</span>
                </label>
                <input
                  id="change-avatar-link"
                  accept="image/*"
                  type="file"
                  onChange={handleImageUpload}
                  hidden
                />
              </div>
            </Col>
          </Row>
          <Form.Item
            name="username"
            label="tên"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: "email",
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="fullname" label="tên đầy đủ">
            <Input />
          </Form.Item>
          <Form.Item name="bio" label="Mô tả">
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" loading={isUpdating} htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Wrapper>
  );
};

export default EditProfile;
