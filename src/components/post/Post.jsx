import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { useMutation, gql, useApolloClient } from "@apollo/client";
import { Avatar, message, Modal } from "antd";
// import Slider from "react-slick";

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
import { Link, useHistory } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { GET_ME } from "../../queries/user";

const Wrapper = styled.div`
  width: 100%;
  max-width: 100%;
  background-color: ${(props) => props.theme.surface};
  color: ${(props) => props.theme.onSurface};
  box-shadow: ${(props) => props.theme.boxShadow};
  /* border: 1px solid ${(props) => props.theme.borderColor}; */
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
    font-weight: 500;
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
    height: max-content;
    min-height: 200px;
    max-height: 660px;
    border-top: 1px solid ${(props) => props.theme.borderColor};
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
  }
  .post-body * {
    /* max-height: inherit; */
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
    padding: 0.3rem 0;
    display: flex;
    gap: 1rem;
    font-weight: 400;
  }

  .comment__list--more > span {
    color: ${(props) => props.theme.onSecondSurface};
    cursor: pointer;
  }

  .comment-list {
    /* max-height: 400px; */
    overflow-y: auto;
  }
  .comment-list::-webkit-scrollbar {
    width: 0;
  }
  svg {
    width: 22px;
    height: 22px;
    fill: ${(props) => props.theme.onSurface};
  }

  .post-body img {
    width: 100%;
    max-height: 660px;
    height: auto;
    object-fit: cover;
  }

  a {
    color: unset;
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
              max-width: 88%;
            }

            .post-react {
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
  gap: 4px;
  font-weight: 500;
  div {
    cursor: pointer;
    width: 100%;
    padding: 0.5rem 0.8rem;
    display: flex;
    justify-content: center;
  }

  div:hover {
    background-color: ${(props) => props.theme.secondSurface};
  }
  .danger-action {
    color: red;
  }
`;

const settings = {
  // dots: true,
  dynamicHeight: true,
  // infiniteLoop: true,
  showIndicators: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  showArrows: true,
  showThumbs: false,
  swipeable: true,
};

const Post = ({ post, isSpecific }) => {
  const [isModdalVisible, setIsModalVisible] = useState(false);
  const client = useApolloClient();
  const {
    me: { _id: myId },
  } = client.readQuery({ query: GET_ME });

  const [commentList, setCommentList] = useState([
    ...post.comments.slice(0, 2)
  ]);
  const history = useHistory();
  const carouselRef = useRef();
  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE_POST);
  const [toggleSaveMutation] = useMutation(TOGGLE_SAVE_POST, {
    update: (cache) => {
      cache.modify({
        id: `User:${myId}`,
        fields: {
          savedPosts(existingSavedPostsRefs, { readField }) {
            if (post.isSaved) {
              return existingSavedPostsRefs.filter((postRef) => {
                return readField("_id", postRef) !== post._id;
              });
            }
            return [...existingSavedPostsRefs, post];
          },
        },
      });
    },
  });

  const [deletePostMutation] = useMutation(DELETE_POST);

  // xu li carousel

  // useEffect(() => {
  //   if (carouselRef.current) {
  //     // console.log(carouselRef.current.listRef);
  //     // const imgs = document.getElementsByClassName(`image-slider-${post._id}`);
  //     const imgs = carouselRef.current.listRef;

  //     // console.log(imgs[0].height);
  //     let minHeight = imgs[0]?.height;

  //     if (imgs.length > 2) {
  //       for (let i = 0; i < imgs.length; i++) {
  //         if (minHeight < imgs[i].height && imgs[i].height !== 0)
  //           minHeight = imgs[i].height;
  //       }

  //       const postBody = document.getElementById(`body-${post._id}`);
  //       if (postBody && minHeight !== 0) postBody.style.height = minHeight;
  //     }
  //   }
  // }, [post._id]);

  const handleToggleLike = async () => {
    try {
      client.writeFragment({
        id: `Post:${post._id}`,
        fragment: gql`
          fragment isLiked on Post {
            isLiked
            likesCount
          }
        `,
        data: {
          isLiked: !post.isLiked,
          likesCount:
            parseInt(post.likesCount) + parseInt(post.isLiked ? -1 : 1),
        },
      });
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
      client.writeFragment({
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
      client.cache.evict({
        id: `Post:${post._id}`,
      });
      setIsModalVisible(false);
      if (history.location.pathname !== "/") history.push("/");
      message.success("xóa thành công");

      await deletePostMutation({
        variables: {
          postId: post._id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewMoreComment = () => {
    const currentCommentListLength = commentList.length;
    if (post.commentsCount > currentCommentListLength) {
      setCommentList([
        ...commentList,
        ...post.comments.slice(
          currentCommentListLength,
          currentCommentListLength + 4
        ),
      ]);
    }
  };

  const handleHideModal = () => {
    setIsModalVisible(false);
  };

  const handleVisibleModal = () => {
    setIsModalVisible(true);
  };

  const handleGoToPost = () => {
    if (history.location.pathname === `/p/${post._id}`) return;
    history.push(`/p/${post._id}`);
  };

  const moreMenu = (
    <MoreMenuWrapper>
      <div>
        <span onClick={handleGoToPost}>Đi tới bài viết</span>
      </div>
      <div>
        {post.isMine ? (
          <span className="danger-action" onClick={handleDeletePost}>
            Xóa bài
          </span>
        ) : (
          <ToggleFollow userId={post.user._id} style={{ padding: "0" }}>
            <span onClick={handleHideModal}>
              {post.user.isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
            </span>
          </ToggleFollow>
        )}
      </div>
      <div onClick={handleHideModal}>
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
          <Link to={`/u/${post.user._id}`}>
            <Avatar src={post.user.avatar} />
          </Link>
          <Link to={`/u/${post.user._id}`}> {post.user.username}</Link>
          <More onClick={handleVisibleModal} />
        </div>
        <div className="post-caption">
          {post.caption?.split(" ").map((word, index) => {
            if (post.tags.includes(word))
              return (
                <span key={index} className="post-tag">
                  {word + " "}
                </span>
              );
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
              <HeartFilled style={{ fill: "#ed4956" }} />
            ) : (
              <HeartOutlined />
            )}
          </div>
          <CommentOutlined />
          <PlaneOutlined onClick={handleGoToPost} />
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
          <div className="comment__list--more">
            {post.commentsCount > commentList.length && (
              <span onClick={handleViewMoreComment}>xem thêm bình luận</span>
            )}
          </div>
          <div className="comment-list">
            {!!post.commentsCount &&
              commentList?.map((comment, index) => (
                <PostComment key={index} comment={comment} />
              ))}
          </div>
        </div>
      </div>
      <div className="post__add-comment">
        <AddComment
          setCommentList={setCommentList}
          isSpecific={isSpecific}
          post={post}
        />
      </div>
    </Wrapper>
  );
};

export default Post;
