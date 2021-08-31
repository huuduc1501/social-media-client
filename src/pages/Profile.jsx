import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import styled from "styled-components";
import { Divider, Skeleton } from "antd";
import { useLocation, useParams } from "react-router-dom";
import { BookmarkOulined, PostIcon } from "../components/Icon";
import { GET_PROFILE } from "../queries/user";
import HeaderProfile from "../components/user/HeaderProfile";
import PostPreview from "../components/post/PostPreview";
import NotFound from "../components/NotFound";

const Wrapper = styled.div`
  .profile-tab {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    font-size: 1.5rem;
    font-weight: 300;
  }
  .profile-tab > div {
    cursor: pointer;
    opacity: 0.8;
  }
  .profile-tab .choose {
    opacity: 1;
  }
  .profile__post-list {
    margin-top: 1rem;
    display: grid;
    justify-items: center;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  svg {
    width: 24px;
    height: 24px;
    fill: ${(props) => props.theme.onBg};
  }

  @media (max-width: 932px) {
    .profile__post-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 616px) {
    .profile__post-list {
      grid-template-columns: 1fr;
    }
  }
`;

const Profile = () => {
  const { userId } = useParams();
  const { pathname } = useLocation();
  const [tab, setTab] = useState(
    pathname.split("/").pop() === "saved" ? "saved" : "post"
  );
  const { loading, error, data } = useQuery(GET_PROFILE, {
    variables: {
      userId,
    },
    fetchPolicy: "cache-first",
    errorPolicy: "all",
  });
  const user = data ? data.getProfile : {};

  if (loading)
    return (
      <div>
        <Skeleton avatar paragraph={4} active />
      </div>
    );

  if (error) {
    console.error(error);
    return <NotFound />;
  }

  if (!data.getProfile.isMe && tab !== "post") {
    setTab("post");
  }

  return (
    <Wrapper>
      <div className="profile-header">
        <HeaderProfile user={user} />
      </div>
      <div className="profile-body">
        <Divider />

        <div className="profile-tab">
          <div
            className={tab === "post" ? "choose" : ""}
            onClick={() => setTab("post")}
          >
            <PostIcon /> Post
          </div>
          {data.getProfile.isMe && (
            <div
              className={tab === "saved" ? "choose" : ""}
              onClick={() => setTab("saved")}
            >
              <BookmarkOulined /> Saved
            </div>
          )}
        </div>
        <div className="profile__post-list">
          {tab === "post" &&
            (user.posts.length === 0 ? (
              <PlaceHolder
                icon={<PostIcon />}
                title="Bài đăng"
                text="Bài đăng sẽ hiển thị tại đây"
              />
            ) : (
              user.posts.map((post, index) => (
                <PostPreview key={index} post={post} />
              ))
            ))}
          {tab === "saved" &&
            data.getProfile.isMe &&
            (user.savedPosts.length === 0 ? (
              <PlaceHolder
                icon={<BookmarkOulined />}
                title="Bài đã lưu"
                text="Bài đã lưu sẽ hiển thị tại đây"
              />
            ) : (
              user.savedPosts?.map((post, index) => (
                <PostPreview key={index} post={post} />
              ))
            ))}
        </div>
      </div>
    </Wrapper>
  );
};

const PlaceHoderWrapper = styled.div`
  grid-column: 1/4;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  font-size: 2rem;
  .holder-text {
    font-size: 1.3rem;
  }
  svg {
    height: 36px;
    width: 36px;
  }
`;

const PlaceHolder = ({ title, text, icon }) => {
  return (
    <PlaceHoderWrapper>
      <div className="holder-icon">{icon}</div>
      <div className="holder-title">{title}</div>
      <div className="holder-text">{text}</div>
    </PlaceHoderWrapper>
  );
};

export default Profile;
