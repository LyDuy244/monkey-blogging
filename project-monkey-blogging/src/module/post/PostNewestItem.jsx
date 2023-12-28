import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import slugify from "slugify";
const PostNewestItemStyles = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #ccc;
  &:last-child {
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: 0;
  }
  .post {
    &-image {
      display: block;
      flex-shrink: 0;
      width: 180px;
      height: 130px;
      border-radius: 12px;
    }
    &-category {
      margin-bottom: 8px;
    }
  }
`;
const PostNewestItem = ({data = {}}) => {
  if (!data.id) return null;

  const date = data?.createdAt?.seconds ? new Date(data?.createdAt?.seconds * 1000) : new Date()
  const formatDate = new Date(date).toLocaleDateString('vi-VI');

  return (
    <PostNewestItemStyles>
      <PostImage
        url={data?.image}
        alt={data?.image_name}
        className="post-image"
        to={''}
      >
      </PostImage>
      <div className="post-content">
        <PostCategory type="secondary" className="post-category" to={data?.category?.slug}>{data?.category?.name}</PostCategory>
        <PostTitle className="post-title" to={data?.slug}>
          {data.title}
        </PostTitle>
        <PostMeta author={data?.user?.fullname} to={slugify(data?.user?.fullname || '', { lower: true })} date={formatDate}></PostMeta>
      </div>
    </PostNewestItemStyles>
  );
};

export default PostNewestItem;  