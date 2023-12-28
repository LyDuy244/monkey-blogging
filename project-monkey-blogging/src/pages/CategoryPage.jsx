import { useEffect, useState } from 'react';
import Heading from '../components/layout/Heading'
import Layout from '../components/layout/Layout'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { useParams } from 'react-router-dom';
import PostItem from '../module/post/PostItem';

const CategoryPage = () => {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const q = query(collection(db, 'posts'), where('category.slug', '==', slug))
    onSnapshot(q, (snapshot) => {
      let results = []
      snapshot.forEach(doc => {
        results.push({
          id: doc.id,
          ...doc.data()
        })
      })
      setPosts(results)
    })
  }, [slug])

  if (posts.length <= 0) return null;
  return (
    <Layout>
      <div className="container">
        <div className="pt-10"></div>
        <Heading>Danh mục</Heading>
        <div className="grid-layout grid-layout--primary">
          {
            posts.map(post => (
              <PostItem key={post.id} data={post} />
            ))
          }
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;