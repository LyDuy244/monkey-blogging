import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import slugify from "slugify";
const PostFeatureItemStyles = styled.div`
  width: 100%;
  border-radius: 16px;
  position: relative;
  height: 169px;
  .post {
    &-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 16px;
    }
    &-overlay {
      position: absolute;
      inset: 0;
      border-radius: 16px;
      background: linear-gradient(
        179.77deg,
        #6b6b6b 36.45%,
        rgba(163, 163, 163, 0.622265) 63.98%,
        rgba(255, 255, 255, 0) 99.8%
      );
      mix-blend-mode: multiply;
      opacity: 0.6;
    }
    &-content {
      position: absolute;
      inset: 0;
      z-index: 10;
      padding: 20px;
      color: white;
    }
    &-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
  }

  @media screen and (min-width: 1024px) {
    height: 272px;
  }
`;
const PostFeatureItem = ({ data = {} }) => {
  if (!data || !data.id) return null;
  // console.log("🚀 ~ file: PostFeatureItem.jsx:56 ~ PostFeatureItem ~ data:", data)
  const date = data?.createdAt?.seconds ? new Date(data?.createdAt?.seconds * 1000) : new Date()
  const formatDate = new Date(date).toLocaleDateString('vi-VI');

  
  return (
    <PostFeatureItemStyles>
      <PostImage
        url={data.image}
        alt="unsplash"
        className="post-image"
      >

      </PostImage>
      <div className="post-overlay"></div>
      <div className="post-content">
        <div className="post-top">
          {
            data?.category?.name && <PostCategory to={data?.category.slug}>{data?.category.name}</PostCategory>
          }
          <PostMeta author={data?.user?.fullname} to={slugify(data?.user?.fullname || '', { lower: true })} date={formatDate} ></PostMeta>
        </div>
        <PostTitle size="big" to={data.slug} className="post-title">
          {data.title}
        </PostTitle>
      </div>
    </PostFeatureItemStyles>
  );
};

export default PostFeatureItem;