import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import slugify from "slugify";
const PostNewestLargeStyles = styled.div`
  .post {
    &-image {
      display: block;
      margin-bottom: 16px;
      height: 433px;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 16px;
    }
    &-title {
      margin-bottom: 12px;
    }
  }
`;


const PostNewestLarge = ({ data }) => {
  if (!data.id) return null;

  const date = data?.createdAt?.seconds ? new Date(data?.createdAt?.seconds * 1000) : new Date()
  const formatDate = new Date(date).toLocaleDateString('vi-VI');

  return (
    <PostNewestLargeStyles>
      <PostImage
        url={data?.image}
        alt={data?.title}
        className="post-image"
      >
      </PostImage>

      <PostCategory className="post-category" to={data?.category?.slug}>{data?.category?.name}</PostCategory>
      <PostTitle size="big" className="post-title" to={data?.slug}>
        {data?.title}
      </PostTitle>
      <PostMeta author={data?.user?.fullname} to={slugify(data?.user?.fullname || '', { lower: true })} date={formatDate}></PostMeta>
    </PostNewestLargeStyles>
  );
};

export default PostNewestLarge;