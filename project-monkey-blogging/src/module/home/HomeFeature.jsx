import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Heading from "../../components/layout/Heading";
import PostFeatureItem from "../post/PostFeatureItem";
import { collection, limit, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { postStatus } from "../../utils/constans";
const HomeFeatureStyles = styled.div``;

const HomeFeature = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const colRef = collection(db, 'posts')
    const q = query(
      colRef,
      where('status', '==', postStatus.APPROVED),
      where('hot', '==', true),
      limit(3)
    )
    onSnapshot(q, (snapshot) => {
      let results = []
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data()
        })
      })
      setPosts(results)
    })

  }, [])


  if (posts.length <= 0) return null;


  return (
    <HomeFeatureStyles className="home-block">
      <div className="container">
        <Heading>Bài viết nổi bật</Heading>
        <div className="grid-layout">
          {
            posts.map(post => (
              <PostFeatureItem key={post.id} data={post} />
            ))
          }
        </div>
      </div>
    </HomeFeatureStyles>
  );
};

export default HomeFeature;