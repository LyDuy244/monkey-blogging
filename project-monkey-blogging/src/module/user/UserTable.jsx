import React, { useEffect, useState } from 'react';
import { Table } from '../../components/table';
import Swal from 'sweetalert2';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { ActionDelete, ActionEdit } from '../../components/action';
import { userRole, userStatus } from '../../utils/constans';
import { LabelStatus } from '../../components/Label';
import { useNavigate } from 'react-router-dom';

const UserTable = () => {
    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const colRef = collection(db, 'users');
        onSnapshot(colRef, (snapShot) => {
            const results = [];
            snapShot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            setUserList(results)
        })
    }, [])

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
            case userRole.MOD:
                return 'Mod'
            case userRole.USER:
                return 'User'

            default:
                break;
        }
    }

    return (
        <div>
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
                                        <h3>{user?.fullname}</h3>
                                        <time className='text-sm text-gray-400'>{new Date(user?.createdAt?.seconds * 1000).toLocaleDateString('vi-VI')}</time>
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
        </div>
    );
};

export default UserTable;