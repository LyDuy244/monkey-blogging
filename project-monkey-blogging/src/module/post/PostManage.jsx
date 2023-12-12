
import React, { useEffect, useState } from "react";
import { Table } from "../../components/table";
import { collection, deleteDoc, doc, getDocs, limit, onSnapshot, query, startAfter, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import { Button } from "../../components/button";
import Swal from "sweetalert2";
import DashboardHeading from "../dashboard/DashboardHeading";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { postStatus, userRole } from "../../utils/constans";
import { LabelStatus } from "../../components/Label";
import { useAuthContext } from "../../context/auth-context";

const POSTS_PER_PAGE = 10

const PostManage = () => {

  const [postList, setPostList] = useState([]);
  const [filter, setFilter] = useState('')
  const [lastDoc, setLastDoc] = useState('')
  const [total, setTotal] = useState(0)
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, 'posts');
      const newRef = filter ? query(colRef, where("title", ">=", filter), where('title', '<=', filter + 'utf8')) : query(colRef, limit(POSTS_PER_PAGE))

      const documentSnapshots = await getDocs(newRef);
      const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

      setLastDoc(lastVisible);

      onSnapshot(colRef, (snapShot) => {
        setTotal(snapShot.size)
      })

      onSnapshot(newRef, (snapShot) => {
        const results = []
        snapShot.forEach(doc => {
          results.push({
            id: doc.id,
            ...doc.data()
          })
        })
        setPostList(results)
      })

      setLastDoc(newRef);
    }

    fetchData()

  }, [filter])

  const handleLoadMorePosts = async () => {
    const nextRef = query(collection(db, 'posts'), startAfter(lastDoc), limit(POSTS_PER_PAGE))

    onSnapshot(nextRef, (snapShot) => {
      const results = []
      snapShot.forEach(doc => {
        results.push({
          id: doc.id,
          ...doc.data()
        })
      })
      setPostList([...postList, ...results])
    })
    // Query the first page of docs
    const documentSnapshots = await getDocs(nextRef);

    // Get the last visible document
    const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible)
  }

  const handleDeletePost = async (docId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const docRef = doc(db, 'posts', docId);
        await deleteDoc(docRef);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  }

  const handleChangeFilter = debounce((e) => {
    setFilter(e.target.value)
  }, 500)

  const renderPostStatus = (status) => {
    switch (status) {
      case postStatus.APPROVED:
        return <LabelStatus type="success">Approved</LabelStatus>
      case postStatus.PENDING:
        return <LabelStatus type="warning">Pending</LabelStatus>
      case postStatus.REJECTED:
        return <LabelStatus type="error">Rejected</LabelStatus>
    
      default:
        break;
    }
    
  }
  const {userInfo} = useAuthContext();
  if(userInfo.role !== userRole.ADMIN) return;

  return (
    <div>
        
      <DashboardHeading title="Manage post" desc="Manage posts user">

      </DashboardHeading>
      <div className="mb-10 flex justify-end">
        <div className="w-full max-w-[300px]">
          <input
            type="text"
            className="w-full p-4 rounded-lg border border-solid border-gray-300"
            placeholder="Search post..."
            onChange={handleChangeFilter}
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            postList.length > 0 && postList.map(post => (
              <tr key={post.id}>
                <td title={post.id}>{post.id.slice(0, 6)}...</td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <img
                      src={post.image}
                      alt="post-img"
                      className="w-[66px] h-[55px] rounded object-cover"
                    />
                    <div className="flex-1  max-w-[250px] whitespace-pre-wrap">
                      <h3 className="font-semibold">{post.title}</h3>
                      <time className="text-sm text-gray-500">
                        Date: {new Date(post.createdAt.seconds * 1000).toLocaleDateString("vi-VI")}
                      </time>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-gray-500">{post?.category?.name}</span>
                </td>
                <td>
                  <span className="text-gray-500">{post?.user?.username}</span>
                </td>
                <td>
                  {renderPostStatus(Number(post.status))}
                </td>
                <td>
                  <div className="flex items-center gap-x-3 text-gray-500">
                    <ActionView onClick={() => navigate(`/${post.slug}`)}></ActionView>
                    <ActionEdit onClick={() => navigate(`/manage/update-post?id=${post.id}`)}></ActionEdit>
                    <ActionDelete onClick={() => handleDeletePost(post.id)}></ActionDelete>
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
      {total > postList.length && <div className="mt-10">
        <Button className='mx-auto' kind='primary' onClick={handleLoadMorePosts}>Load more</Button>
      </div>}
    </div>
  );
};

export default PostManage;