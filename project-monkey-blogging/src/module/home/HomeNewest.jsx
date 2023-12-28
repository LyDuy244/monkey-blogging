import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PostNewestLarge from "../post/PostNewestLarge";
import PostNewestItem from "../post/PostNewestItem";
import PostItem from "../post/PostItem";
import Heading from "../../components/layout/Heading";
import { collection, limit, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { postStatus } from "../../utils/constans";


const HomeNewestStyles = styled.div`
  .layout {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 40px;
    margin-bottom: 64px;
    align-items: start;
  }
  .sidebar {
    padding: 28px 20px;
    background-color: #f3edff;
    border-radius: 16px;
  }

  @media screen and (max-width: 767px){
    .layout{
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
  }
`;

const HomeNewest = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const colRef = collection(db, 'posts')
    const q = query(
      colRef,
      where('status', '==', postStatus.APPROVED),
      where('hot', '==', false),
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
  const [first, ...other] = posts.slice(0, 4)
  const postOther = posts.slice(4, 8)
  console.log(postOther)

  return (
    <HomeNewestStyles className="home-block">
      <div className="container">
        <Heading>Mới nhất</Heading>
        <div className="layout">
          <PostNewestLarge data={first}></PostNewestLarge>
          <div className="sidebar">
            {
              other.length > 0 && other.map(post => (
                <PostNewestItem key={post.id} data={post}></PostNewestItem>
              ))
            }
          </div>
        </div>
        <div className="grid-layout grid-layout--primary">
        { postOther.length > 0 &&
          postOther.map(item => (
            <PostItem key={item.id} data={item}></PostItem>
          ))
        }
        </div>
      </div>
    </HomeNewestStyles>
  );
};

export default HomeNewest;