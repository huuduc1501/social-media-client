import React, { useState } from "react";
import styled from "styled-components";
import { Avatar, Input, Space, Menu, Dropdown } from "antd";
import CreatePostModal from "../post/CreatePostModal";
import { useApolloClient } from "@apollo/client";
import { Link } from "react-router-dom";

import { GET_ME } from "../../queries/user";
import logo from "../../assets/images/SM-logo.jpeg";
import {
  HomeOutlined,
  CommentOutlined,
  ExploreOutlined,
  HeartOutlined,
  UserOutlined,
  BookmarkOulined,
  LogoutOutLined,
} from "../Icon";
import { IS_LOGGED_IN } from "../../queries/client";
import SearchField from "../SearchField";

const Wrapper = styled.div`
  position: sticky;
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  background: white;
  z-index: 9;
  .navbar {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .navbar ul {
    list-style-type: none;
    display: flex;
    align-items: center;
    height: 100%;
  }
  .logo img {
    height: 40px;
    width: 40px;
  }
  svg {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
  .ant-avatar {
    cursor: pointer;
  }
  /* @media (min-height: 101vh) {
    padding-right: 16px;
  } */
`;

const DropdownWrapper = styled.div`
  .ant-menu-item {
    display: flex;
    align-items: center;
  }
  svg {
    width: 16px;
    height: 16px;
  }
`;

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const client = useApolloClient();
  const { me } = client.readQuery({ query: GET_ME });

  const handleLogout = () => {
    localStorage.removeItem("token");
    client.writeQuery({
      query: IS_LOGGED_IN,
      data: { isLoggedIn: false },
    });
  };

  const userDropdown = (
    <DropdownWrapper>
      <Menu>
        <Menu.Item icon={<UserOutlined />}>
          <Link to={`/u/${me._id}`}>Trang cá nhân</Link>
        </Menu.Item>
        <Menu.Item icon={<BookmarkOulined />}>Đã lưu</Menu.Item>
        <Menu.Item icon={<LogoutOutLined />} onClick={handleLogout}>
          Đăng xuất
        </Menu.Item>
      </Menu>
    </DropdownWrapper>
  );

  return (
    <Wrapper>
      <CreatePostModal
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
      />
      <div className="navbar container">
        <div className="logo">
          <div className="navbar-item">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>
        </div>
        <div className="search">
          <div className="navbar-item">
            <SearchField />
          </div>
        </div>
        <div className="right">
          <Space size="middle">
            <div className="navbar-item">
              <Link to="/">
                <HomeOutlined />
              </Link>
            </div>
            <div className="navbar-item">
              <Link to="/chat">
                <CommentOutlined />
              </Link>
            </div>
            <div className="navbar-item">
              <Link to="/explore">
                <ExploreOutlined />
              </Link>
            </div>
            <div className="navbar-item" onClick={() => setVisible(true)}>
              <HeartOutlined />
            </div>
            <div className="navbar-item">
              <Dropdown overlay={userDropdown} arrow trigger={["click"]}>
                <Avatar src={me.avatar} />
              </Dropdown>
            </div>
          </Space>
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
