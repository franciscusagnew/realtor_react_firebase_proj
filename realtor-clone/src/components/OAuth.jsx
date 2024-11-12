'use client'
import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";
import { doc, getDoc, serverTimestamp, setDoc } from '@firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from "react-router-dom";

export default function OAuth() {
    const navigate = useNavigate();

    async function onGoogleClick() {
        try {
            const auth = new getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            // Check for the user
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp(),
                });
            }

            navigate("/");
            // console.log(user);
        } catch (error) {
            toast.error("Could not authorize with Google!")
        }
    }

    return (
        <div>
            <button
                onClick={onGoogleClick}
                type="button"
                className="flex w-full items-center justify-center bg-red-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-red-700 transition duration-150 ease-in-out hover:shadow-lg active:shadow-lg active:bg-red-800"
            >
                <FcGoogle className='text-2xl bg-white rounded-full mr-2'/> Continue with Google
            </button>
        </div>
    );
}
