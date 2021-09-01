import React, { useState } from "react";
import styled from "styled-components";
import { Button, Skeleton, Space } from "antd";
import ToggleFollow from "../ToggleFollow";
import Modal from "antd/lib/modal/Modal";
import SuggestUser from "../SuggestUser";
import { useLazyQuery } from "@apollo/client";
import { GET_FOLLOWERS, GET_FOLLOWINGS } from "../../queries/user";
import { Options } from "../Icon";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  display: grid;
  gap: 0.3rem;
  column-gap: 2rem;
  grid-template-columns: auto 1fr;
  line-height: 3rem;
  .profile-avatar {
    margin: auto;
    grid-row: 1/4;
  }
  img {
    width: 140px;
    height: 140px;
    object-fit: cover;
    border-radius: 50%;
  }

  .profile-stats,
  .profile-meta,
  .profile-bio {
    grid-column: 2;
  }

  .profile-meta {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .profile-meta > *:first-child {
    font-size: 1.5rem;
  }
  .profile-stats {
    display: flex;
    gap: 1rem;
  }
  .action {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
  .profile-stats > div {
    cursor: pointer;
  }
  .profile-stats span {
    font-weight: 500;
  }
  svg {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }

  .ant-modal {
    width: max-content !important;
  }

  @media (max-width: 600px) {
    column-gap: 0.6rem;
    img {
      width: 100px;
      height: 100px;
    }
    .profile-avatar {
      grid-row: 1/3;
    }
    .profile-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.2rem;
    }
    .profile-stats {
      border-top: 1px solid ${(props) => props.theme.borderColor};
      padding-top: 0.5rem;
      grid-column: 1/3;
      display: flex;
      justify-content: space-around;
    }
    .profile-stats > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1.2rem;
    }
  }
`;

const HeaderProfile = ({ user }) => {
  const [isFollowingModalVisible, setIsFollowingModalVisible] = useState(false);
  const [isFollowerModalVisible, setIsFollowerModalVisible] = useState(false);
  const [getFollowings, { loading: followingsLoading, data: followingsData }] =
    useLazyQuery(GET_FOLLOWINGS, {
      fetchPolicy: "cache-first",
    });
  const [getFollwers, { loading: followersLoading, data: followersData }] =
    useLazyQuery(GET_FOLLOWERS, {
      fetchPolicy: "cache-first",
    });

  const handleGetFollowings = async () => {
    try {
      setIsFollowingModalVisible(true);
      await getFollowings({
        variables: {
          userId: user._id,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetFollowers = async () => {
    try {
      setIsFollowerModalVisible(true);
      await getFollwers({
        variables: {
          userId: user._id,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancleFollowerModal = () => {
    setIsFollowerModalVisible(false);
  };
  const handleCancleFollowingModal = () => {
    setIsFollowingModalVisible(false);
  };

  return (
    <>
      <FollowModal
        title="Đang theo dõi"
        loading={followingsLoading}
        data={followingsData?.getProfile.followings}
        visible={isFollowingModalVisible}
        onCancel={handleCancleFollowingModal}
      />
      <FollowModal
        title="Theo dõi"
        loading={followersLoading}
        data={followersData?.getProfile.followers}
        visible={isFollowerModalVisible}
        onCancel={handleCancleFollowerModal}
      />
      <Wrapper>
        <div className="profile-avatar">
          <img src={user?.avatar} alt="avatar" />
        </div>

        <div className="profile-meta">
          <span>{user.username}</span>
          <div className="action">
            {user.isMe ? (
              <Link to="/a/edit">
                <Button>chỉnh sửa thông tin</Button>
              </Link>
            ) : (
              <Button type="primary" style={{ padding: "0" }}>
                <ToggleFollow
                  isFollowing={user.isFollowing}
                  userId={user._id}
                  style={{ padding: "0.4rem 0.8rem" }}
                />
              </Button>
            )}

            <Options />
          </div>
        </div>
        <div className="profile-bio">
          <span>{user.fullname}</span>
          <p>{user.bio}</p>
        </div>
        <div className="profile-stats">
          <div>
            <span>{user.postsCount} </span>bài viết
          </div>
          <div onClick={handleGetFollowings}>
            <span>{user.followingsCount} </span>đang theo dõi
          </div>
          <div onClick={handleGetFollowers}>
            <span>{user.followersCount} </span>theo dõi
          </div>
        </div>
      </Wrapper>
    </>
  );
};

const FollowModal = ({ data, loading, ...rest }) => {
  return (
    <Modal
      {...rest}
      closable={false}
      footer={null}
      width="400px"
      bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
    >
      {loading ? (
        <>
          <Skeleton active avatar paragraph={2} />
          <Skeleton active avatar paragraph={2} />
        </>
      ) : (
        <>
          {data?.length ? (
            <Space direction="vertical" style={{ width: "100%" }}>
              {data.map((u, index) => {
                return <SuggestUser user={u} key={index} />;
              })}
            </Space>
          ) : (
            "Chưa có người theo dõi"
          )}
        </>
      )}
    </Modal>
  );
};

export default HeaderProfile;
