import DashboardHeading from "../dashboard/DashboardHeading";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/button";
import { useAuthContext } from "../../context/auth-context";
import { userRole, userStatus } from "../../utils/constans";
import { LabelStatus } from "../../components/Label";
import Swal from "sweetalert2";
import { collection, deleteDoc, doc, getDocs, limit, onSnapshot, query, startAfter, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import { Table } from "../../components/table";
import { ActionDelete, ActionEdit } from "../../components/action";
import { debounce } from "lodash";
const USER_PER_PAGE = 5

const UserManage = () => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const [filter, setFilter] = useState('')
  const [lastDoc, setLastDoc] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, 'users');

      const newRef = filter ?
        query(
          colRef,
          where('fullname', '>=', filter),
          where('fullname', "<=", filter + 'utf8'),
        )
        : query(colRef, limit(USER_PER_PAGE))

      // Query the first page of docs
      const documentSnapshots = await getDocs(newRef);

      // Get the last visible document
      const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

      setLastDoc(lastVisible)

      onSnapshot(colRef, (snapShot) => {
        setTotal(snapShot.size)
      })


      onSnapshot(newRef, (snapShot) => {
        const results = [];
        snapShot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data()
          })
        })
        setUserList(results)
      })
    }

    fetchData()
  }, [filter])

  const handleLoadMoreUser = async () => {
    const nextRef = query(collection(db, "users"),
      startAfter(lastDoc),
      limit(USER_PER_PAGE));

    onSnapshot(nextRef, (snapShot) => {
      const results = []
      snapShot.forEach(doc => {
        results.push({
          id: doc.id,
          ...doc.data()
        })
      })
      setUserList([...userList, ...results])
    })
    // Query the first page of docs
    const documentSnapshots = await getDocs(nextRef);

    // Get the last visible document
    const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible)
  }

  const handleDeleteUser = async (user) => {
    const singleDoc = doc(db, 'users', user?.id)
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
        await deleteDoc(singleDoc)
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  }

  const renderLabelStatus = (status) => {
    switch (status) {
      case userStatus.ACTIVE:
        return <LabelStatus type='success'>Active</LabelStatus>
      case userStatus.PENDING:
        return <LabelStatus type='warning'>Pending</LabelStatus>
      case userStatus.BAN:
        return <LabelStatus type='danger'>Rejected</LabelStatus>

      default:
        break;
    }
  }

  const renderRoleLabel = (role) => {
    switch (role) {
      case userRole.ADMIN:
        return 'Admin'
      case userRole.USER:
        return 'User'

      default:
        break;
    }
  }

  const handleInputFilter = debounce((e) => {
    setFilter(e.target.value)
  }, 500)

  const { userInfo } = useAuthContext();
  if (userInfo.role !== userRole.ADMIN) return;

  return (
    <div>
      <DashboardHeading
        title="Users"
        desc="Manage your user"
      >
        <Button type='button' kind='ghost' to='manage/add-user'>Add new user</Button>
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
        <thead >
          <tr>
            <th>Id</th>
            <th>Info</th>
            <th>Username</th>
            <th>Email address</th>
            <th>Status</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 && userList.map(user => (
            <tr key={user.id}>
              <td title={user.id}>{user.id.slice(0, 6) + '...'}</td>
              <td className='whitespace-nowrap'>
                <div className="flex items-center gap-x-3">
                  <img src={user?.avatar} alt="" className='w-10 h-10 object-cover rounded-md flex-shrink-0' />
                  <div className="flex-1">
                    <h3 className='hidden lg:block'>{user?.fullname}</h3>
                    <time className='text-sm text-gray-400 hidden lg:block'>{new Date(user?.createdAt?.seconds * 1000).toLocaleDateString('vi-VI')}</time>
                  </div>
                </div>
              </td>
              <td>{user?.username}</td>
              <td title={user.email}>{user?.email}</td>
              <td>
                {renderLabelStatus(Number(user?.status))}
              </td>
              <td>
                {renderRoleLabel(Number(user?.role))}
              </td>
              <td>
                <div className="flex items-center gap-x-3">
                  <ActionEdit onClick={() => navigate(`/manage/update-user?id=${user.id}`)}></ActionEdit>
                  <ActionDelete onClick={() => handleDeleteUser(user)}></ActionDelete>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {total > userList.length && <div className="mt-10">
        <Button className='mx-auto' kind='primary' onClick={handleLoadMoreUser}>Load more</Button>
      </div>}
    </div>
  );
};

export default UserManage;