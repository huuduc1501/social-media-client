import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { useMutation, gql } from "@apollo/client";
import { Avatar, message, Modal } from "antd";
import Slider from "react-slick";

import {
  DELETE_POST,
  TOGGLE_LIKE_POST,
  TOGGLE_SAVE_POST,
} from "../../queries/post";

import {
  HeartFilled,
  HeartOutlined,
  BookmarkFilled,
  BookmarkOulined,
  CommentOutlined,
  PlaneOutlined,
  More,
} from "../Icon";

import ToggleFollow from "../ToggleFollow";
import AddComment from "./AddComment";
import PostComment from "./PostComment";
import { useHistory } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Wrapper = styled.div`
  width: 100%;
  background-color:white;
  max-width: 100%;
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: ${(props) => props.theme.borderRadius};
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 100%;

  /* .post-images img {
    width:100%;
    height: auto;
  } */
  > div {
    max-width: 100%;
  }
  .post-header,
  .post-fotter {
    padding: 0.5rem 1rem;
  }

  .post-user {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .post-user > * {
    cursor: pointer;
  }
  .post-user > span {
    font-weight: 600;
  }
  .post-user > *:last-child {
    margin-left: auto;
  }

  .post-tag {
    color: blue;
  }

  .post-body {
    max-height: 660px;
    border-top: 1px solid ${(props) => props.theme.borderColor};
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
  }
  .post-body * {
    max-height: inherit;
  }
  .post-action {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .post-action > * {
    cursor: pointer;
    height: 22px;
  }
  .slick-slider > ul {
    bottom: 0;
  }

  /* .post-action > * {
   display: inline-block;
 } */
  .post-action > *:last-child {
    margin-left: auto;
  }

  .post-react {
    display: flex;
    gap: 1rem;
    font-weight: 400;
  }

  .comment-list {
    max-height: 400px;
    overflow-y: auto;
  }
  .comment-list::-webkit-scrollbar {
    width: 0;
  }
  svg {
    width: 22px;
    height: 22px;
  }

  .post-body img {
    width: 100%;
    max-height: 100%;
    /* height: auto; */
    object-fit: cover;
  }

  @media (min-width: 600px) {
    ${(props) =>
      props.isSpecific
        ? css`
            /* max-height: 600px; */
            grid-template-columns: 70% 30%;
            grid-template-rows: auto 1fr auto;
            .post-header {
              grid-column: 2;
              grid-row: 1/2;
              height: max-content;
            }
            .post-body {
              grid-column: 1/2;
              grid-row: 1/4;
              border-right: 1px solid ${(props) => props.theme.borderColor};
              border-top: 0;
              border-bottom: 0;
            }
            .post-fotter {
              grid-column: 2;
              grid-row: 2/3;
              display: flex;
              flex-direction: column;
              padding: 0;
            }

            .post-fotter > * {
              padding: 0.5rem 1rem;
            }
            .post-caption {
              max-height: 70px;
              overflow-y: auto;
            }
            .post-caption ::-webkit-scrollbar {
              width: 0;
            }
            .post-comment {
              position: relative;
              order: 1;
              flex-grow: 2;
              overflow-y: hidden;
              /* max-height: 300px; */
              border-top: 1px solid ${(props) => props.theme.borderColor};

              /* max-height:70%; */
            }
            .comment-list {
              position: absolute;
              max-height: calc(100% - 32px);
              overflow-y: scroll;
            }

            .post-react {
              padding: 0 1rem;
              order: 3;
            }
            .post-action {
              border-top: 1px solid ${(props) => props.theme.borderColor};
              order: 2;
              padding-bottom: 0;
            }
            .post__add-comment {
              grid-column: 2;
              grid-row: 3/4;
            }
            .slick-slider img {
              max-height: 600px;
              width: auto;
              object-fit: cover;
            }
          `
        : ""}
  }
`;

const MoreMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-weight: 500;
  > * {
    cursor: pointer;
  }
  .danger-action {
    color: red;
  }
`;

const settings = {
  dots: true,
  dynamicHeight: true,
  infiniteLoop: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  showArrows: true,
  showThumbs: false,
  swipeable: true,
};

const Post = ({ post, isSpecific }) => {
  const [isModdalVisible, setIsModalVisible] = useState(false);
  const history = useHistory();
  const carouselRef = useRef();
  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE_POST, {
    update: (cache, { data: { toggleLike } }) => {
      cache.writeFragment({
        id: `Post:${post._id}`,
        fragment: gql`
          fragment modifyPost on Post {
            isLiked
            likesCount
          }
        `,
        data: {
          likesCount:
            parseInt(post.likesCount) + parseInt(post.isLiked ? -1 : 1),
          isLiked: !post.isLiked,
        },
      });
    },
  });
  const [toggleSaveMutation] = useMutation(TOGGLE_SAVE_POST, {
    update: (cache, { data: { toggleSave } }) => {
      cache.writeFragment({
        id: `Post:${post._id}`,
        fragment: gql`
          fragment moPost on Post {
            isSaved
          }
        `,
        data: {
          isSaved: !post.isSaved,
        },
      });
    },
  });

  const [deletePostMutation] = useMutation(DELETE_POST, {
    update: (cache) => {
      cache.evict({
        id: `Post:${post._id}`,
      });
    },
  });

  // xu li carousel

  useEffect(() => {
    if (carouselRef.current) {
      // console.log(carouselRef.current.listRef);
      // const imgs = document.getElementsByClassName(`image-slider-${post._id}`);
      const imgs = carouselRef.current.listRef;
      console.log(imgs);
      // console.log(imgs[0].height);
      let minHeight = imgs[0]?.height;
      console.log(imgs.length > 2);
      if (imgs.length > 2) {
        for (let i = 0; i < imgs.length; i++) {
          console.log(imgs[i].height);
          if (minHeight < imgs[i].height && imgs[i].height !== 0)
            minHeight = imgs[i].height;
        }
        console.log(minHeight);
        const postBody = document.getElementById(`body-${post._id}`);
        if (postBody && minHeight !== 0) postBody.style.height = minHeight;
      }
    }
  }, [post._id]);

  const handleToggleLike = async () => {
    try {
      await toggleLikeMutation({
        variables: {
          postId: post._id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleToggleSave = async () => {
    try {
      await toggleSaveMutation({
        variables: {
          postId: post._id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePostMutation({
        variables: {
          postId: post._id,
        },
      });
      setIsModalVisible(false);
      message.success("xóa thành công");
    } catch (error) {
      console.log(error);
    }
  };

  const moreMenu = (
    <MoreMenuWrapper>
      <div>
        <span
          onClick={() => {
            history.push(`/p/${post._id}`);
            setIsModalVisible(false);
          }}
        >
          Đi tới bài viết
        </span>
      </div>
      <div className="danger-action">
        {post.isMine ? (
          <span onClick={handleDeletePost}>Xóa bài</span>
        ) : (
          <ToggleFollow isFollowing={post.isFollowing} userId={post._id}>
            <span>{post.user.isFollowing ? "Bỏ theo dõi" : "Theo dõi"}</span>
          </ToggleFollow>
        )}
      </div>
      <div onClick={() => setIsModalVisible(false)}>
        <span>Hủy</span>
      </div>
    </MoreMenuWrapper>
  );

  return (
    <Wrapper isSpecific={isSpecific}>
      <Modal
        visible={isModdalVisible}
        onCancel={() => setIsModalVisible(false)}
        closable={false}
        footer={null}
        width="200px"
      >
        {moreMenu}
      </Modal>
      <div className="post-header">
        <div className="post-user">
          <Avatar
            src={post.user.avatar}
            onClick={() => history.push(`/u/${post.user._id}`)}
          />
          <span onClick={() => history.push(`/u/${post.user._id}`)}>
            {post.user.username}
          </span>
          <More onClick={() => setIsModalVisible(true)} />
        </div>
        <div className="post-caption">
          {post.caption?.split(" ").map((word, index) => {
            if (post.tags.includes(word))
              return <span className="post-tag">{word + " "}</span>;
            return word + " ";
          })}
        </div>
      </div>
      <div className="post-body" id={`body-${post._id}`}>
        <div className="post-images">
          <div className="">
            <Carousel {...settings} ref={carouselRef}>
              {post.files?.map((url, index) => {
                return (
                  <img
                    className={`image-slider-${post._id}`}
                    src={url}
                    key={index}
                    alt="imagea"
                  />
                );
              })}
            </Carousel>
          </div>
        </div>
      </div>
      <div className="post-fotter">
        <div className="post-action">
          <div onClick={handleToggleLike}>
            {post.isLiked ? (
              <HeartFilled style={{ color: "rgb(237 73 86)" }} />
            ) : (
              <HeartOutlined />
            )}
          </div>
          <CommentOutlined />
          <PlaneOutlined
            onClick={() => {
              if (history.location.pathname === `/p/${post._id}`) return;
              history.push(`/p/${post._id}`);
            }}
          />
          <div onClick={handleToggleSave}>
            {post.isSaved ? <BookmarkFilled /> : <BookmarkOulined />}
          </div>
        </div>
        <div className="post-react">
          <div>
            <span>{post.likesCount} thích</span>
          </div>
          <div>
            {!!post.commentsCount && (
              <span>{post.commentsCount} bình luận</span>
            )}
          </div>
        </div>
        <div className="post-comment">
          <div className="comment-list">
            {!!post.commentsCount &&
              post.comments.map((comment, index) => (
                <PostComment key={index} comment={comment} />
              ))}
          </div>
        </div>
      </div>
      <div className="post__add-comment">
        <AddComment isSpecific={isSpecific} post={post} />
      </div>
    </Wrapper>
  );
};

export default Post;
