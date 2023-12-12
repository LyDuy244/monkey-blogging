import React, { useEffect, useState } from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import Table from "../../components/table/Table"
import { LabelStatus } from "../../components/Label";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import { collection, deleteDoc, doc, getDocs, limit, onSnapshot, query, startAfter, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { categoryStatus, userRole } from "../../utils/constans";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { debounce } from "lodash";
import { useAuthContext } from "../../context/auth-context";

const CATEGORY_PER_PAGE = 10

const CategoryManage = () => {

  const [categoryList, setCategoryList] = useState([])
  const navigate = useNavigate();
  const [filter, setFilter] = useState('')
  const [lastDoc, setLastDoc] = useState('')
  const [total, setTotal] = useState(0)

  const handleLoadMoreCategory = async () => {
    const nextRef = query(collection(db, "category"),
      startAfter(lastDoc),
      limit(CATEGORY_PER_PAGE));

    onSnapshot(nextRef, (snapShot) => {
      const results = []
      snapShot.forEach(doc => {
        results.push({
          id: doc.id,
          ...doc.data()
        })
      })
      setCategoryList([...categoryList, ...results])
    })
    // Query the first page of docs
    const documentSnapshots = await getDocs(nextRef);

    // Get the last visible document
    const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible)
  }

  useEffect(() => {

    async function fetchData() {


      const colRef = collection(db, 'category');

      const newRef = filter ?
        query(
          colRef,
          where('name', '>=', filter),
          where('name', "<=", filter + 'utf8'),
        )
        : query(colRef, limit(CATEGORY_PER_PAGE))

      // Query the first page of docs
      const documentSnapshots = await getDocs(newRef);

      // Get the last visible document
      const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      
      setLastDoc(lastVisible)

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
        setCategoryList(results)
      })
    }
    fetchData()
  }, [filter])

  const handleDeleteCategory = async (docId) => {

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
        const singleDoc = doc(db, 'category', docId)
        await deleteDoc(singleDoc);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  }

  const handleInputFilter = debounce((e) => {
    setFilter(e.target.value)
  }, 500)


  const {userInfo} = useAuthContext();
  if(userInfo.role !== userRole.ADMIN) return;
  
  return (
    <div>
      <DashboardHeading
        title="Categories"
        desc="Manage your category"
      >
        <Button kind='ghost' height='60px' to='manage/add-category'>Create category</Button>
      </DashboardHeading>

      <div className="mb-10 flex justify-end">
        <input
          type="text"
          className="py-4 px-5 border border-gray-400 rounded-lg"
          placeholder="Search category..."
          onChange={handleInputFilter}
        />
      </div>

      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categoryList.length > 0 && categoryList.map(category => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>
                <span className="italic text-gray-400">{category.slug}</span>
              </td>
              <td>
                {category.status === categoryStatus.APPROVED && (
                  <LabelStatus type="success">APPROVED</LabelStatus>
                )}
                {category.status === categoryStatus.UNAPPROVED && (
                  <LabelStatus type="warning">UNAPPROVED</LabelStatus>
                )}
              </td>
              <td>
                <div className="flex items-center gap-x-3">
                  <ActionView></ActionView>
                  <ActionEdit onClick={() => navigate(`/manage/update-category?id=${category.id}`)}></ActionEdit>
                  <ActionDelete onClick={() => handleDeleteCategory(category.id)}></ActionDelete>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {total > categoryList.length && <div className="mt-10">
        <Button className='mx-auto' kind='primary' onClick={handleLoadMoreCategory}>Load more</Button>
      </div>}
    </div>
  );
};

export default CategoryManage;