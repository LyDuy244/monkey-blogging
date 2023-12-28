import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const authContext = createContext()

const AuthProvider = (props) => {
    const [userInfo, setUserInfo] = useState({})
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = query(
                    collection(db, "users"),
                    where("email", "==", user.email)
                  );
                  onSnapshot(docRef, (snapshot) => {
                    snapshot.forEach((doc) => {
                      setUserInfo({
                        id: doc.id,
                        ...user,
                        ...doc.data(),
                      });
                    });
                  });
            }
            else {
                setUserInfo(null)
            }
        })
    }, [])

    return <authContext.Provider {...props} value={{ userInfo, setUserInfo }}></authContext.Provider>
}

const useAuthContext = () => {
    const context = useContext(authContext);
    if (typeof context === 'undefined') throw new Error('useAuthContext must used within AuthProvider')

    return context
}

export { AuthProvider, useAuthContext } 