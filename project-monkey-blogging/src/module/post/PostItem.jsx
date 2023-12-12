import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import slugify from "slugify";
const PostItemStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .post {
    &-image {
      height: 202px;
      margin-bottom: 20px;
      display: block;
      width: 100%;
      border-radius: 16px;
      
    }
    &-category {
      margin-bottom: 16px;
    }
  }
`;

const PostItem = ({ data = {} }) => {
  if (!data) return null;
  return (
    <PostItemStyles>
      <PostImage  
        url={data?.image}
        alt={data?.title}
        className="post-image"
        to={data.slug}
      >
      </PostImage>
      <PostCategory to={data.category?.slug} className="post-category">{data.category?.name}</PostCategory>
      <PostTitle className="post-title"  to={data.slug}>
        {data?.title}
      </PostTitle>
      <PostMeta to={slugify(data.user?.fullname || "", { lower: true })} author={data.user?.fullname} date={new Date(data.createdAt?.seconds * 1000).toLocaleDateString('vi-VI')}></PostMeta>
    </PostItemStyles>
  );
};

export default PostItem;