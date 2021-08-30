import { useQuery } from "@apollo/client";
import { Skeleton } from "antd";
import React from "react";
import { useParams } from "react-router-dom";
import NotFound from "../components/NotFound";
import Post from "../components/post/Post";
import { GET_POST } from "../queries/post";

const SpecificPost = () => {
  const { postId } = useParams();
  const { loading, error, data } = useQuery(GET_POST, {
    variables: { postId },
  });
  if (loading) return <Skeleton active avatar paragraph={4} />;
  if (error) {
    console.error(error);
    return <NotFound />;
  }
  return <Post isSpecific={true} post={data.getPost} />;
};

export default SpecificPost;
