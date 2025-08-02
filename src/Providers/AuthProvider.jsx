import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import { auth } from '../Auth/firebase.config';
import axiosSecure from '../api/axiosSecure';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const googleProvider = new GoogleAuthProvider();


    // set user role
    useEffect(() => {
        if (user?.email) {
            axiosSecure.get(`/users/${user.email}`).then(res => {
                
                if(res?.data){
                    
                    setUserRole(res.data.role);
                }
            });
            
        }
    }, [user]);

    
    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password);
    }


    const signInWithGoogle = () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }


    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    // update user information
    // await updateDisplayNameAndPhoto(data.name, avatarUrl); // only needed if editing name and photo
    // await updateUserEmail(data.email); // only needed if editing email
    // await updateUserPassword(data.password); // only needed if changing password

    const updateDisplayNameAndPhoto = async (name, photoURL) => {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        await updateProfile(user, {
            displayName: name,
            photoURL,
        });
    };


    const updateUserEmail = async (newEmail) => {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        await updateEmail(user, newEmail);
    };

    const updateUserPassword = async (newPassword) => {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        await updatePassword(user, newPassword);
    };

    const signOutUser = () => {
        return signOut(auth)
    }

    // observe user
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        })
        return () => {
            unSubscribe();
        }
    }, [])

    const authInfo = {
        user,
        setUser,
        loading,
        setLoading,
        userRole,
        setUserRole,
        signIn,
        signInWithGoogle,
        createUser,
        updateDisplayNameAndPhoto,
        updateUserEmail,
        updateUserPassword,
        signOutUser
    }

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;