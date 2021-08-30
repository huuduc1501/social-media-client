import React, { useState } from "react";
import styled from "styled-components";
import { Avatar, Space, Dropdown } from "antd";
import CreatePostModal from "../post/CreatePostModal";
import { useApolloClient } from "@apollo/client";
import { NavLink } from "react-router-dom";

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
  SunOutlined,
  MoonOutlined,
} from "../Icon";
import { IS_LOGGED_IN, MODE } from "../../queries/client";
import SearchField from "../SearchField";

const Wrapper = styled.div`
  position: sticky;
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.primaryColor};
  color: ${(props) => props.theme.onPrimary};
  z-index: 9;
  .navbar {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .navbar-item .active svg {
    fill: ${(props) => props.theme.onPrimary};
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
    fill: ${(props) => props.theme.onSecondPrimary};
  }
  .ant-avatar {
    cursor: pointer;
  }
  /* @media (min-height: 101vh) {
    padding-right: 16px;
  } */
`;

const DropdownWrapper = styled.div`
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.primaryColor};
  color: ${(props) => props.theme.onPrimary};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .dropdown-item {
    padding: 0.3rem 0.6rem;
    cursor: pointer;
    display: flex;
    gap: 1rem;
    /* justify-content: space-between; */
    align-items: center;
  }

  .dropdown-item:hover {
    background-color: ${(props) => props.theme.bg};
  }

  svg {
    width: 16px;
    height: 16px;
    fill: ${(props) => props.theme.onPrimary};
  }
  a {
    color: ${(props) => props.theme.onPrimary};
  }
`;

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const client = useApolloClient();
  const { me } = client.readQuery({ query: GET_ME });
  const { mode } = client.readQuery({ query: MODE });

  const handleLogout = () => {
    localStorage.removeItem("token");
    client.writeQuery({
      query: IS_LOGGED_IN,
      data: { isLoggedIn: false },
    });
  };

  const handleChangeThemeMode = () => {
    client.writeQuery({
      query: MODE,
      data: { mode: mode === "dark" ? "light" : 'dark' },
    });
    localStorage.setItem("mode", mode);
  };

  const userDropdown = (
    <DropdownWrapper>
      <div className="dropdown-item">
        <UserOutlined />
        <NavLink to={`/u/${me._id}`}>Trang cá nhân</NavLink>
      </div>
      <div className="dropdown-item">
        <BookmarkOulined />
        Đã lưu
      </div>
      <div className="dropdown-item" onClick={handleLogout}>
        <LogoutOutLined /> Đăng xuất
      </div>
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
            <NavLink to="/">
              <img src={logo} alt="Logo" />
            </NavLink>
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
              <NavLink exact={true} to="/" activeClassName="active">
                <HomeOutlined />
              </NavLink>
            </div>
            <div className="navbar-item">
              <NavLink to="/chat" activeClassName="active">
                <CommentOutlined />
              </NavLink>
            </div>
            <div className="navbar-item">
              <NavLink to="/explore" activeClassName="active">
                <ExploreOutlined />
              </NavLink>
            </div>
            <div className="navbar-item" onClick={() => setVisible(true)}>
              <HeartOutlined />
            </div>
            <div className="navbar-item" onClick={handleChangeThemeMode}>
              {mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
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
