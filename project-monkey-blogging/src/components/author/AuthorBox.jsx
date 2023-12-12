import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase-config';

const AuthorBox = ({ userId = '' }) => {
    const [user, setUser] = useState({})
    useEffect(() => {
       async function fetchUserData(){
        const colRef = doc(db, 'users', userId)
        const singleDoc = await getDoc(colRef);
        if(singleDoc.data())
            setUser(singleDoc.data())
       }
       fetchUserData()
    }, [userId])

    if (!userId || !user.username) return;
    return (
        <div className="author">
            <div className="author-image">
                <img
                    src={user?.avatar}
                    alt=""
                />
            </div>
            <div className="author-content">
                <h3 className="author-name">{user?.fullname}</h3>
                <p className="author-desc">
                    {user?.description}
                </p>
            </div>
        </div>
    );
};

export default AuthorBox;