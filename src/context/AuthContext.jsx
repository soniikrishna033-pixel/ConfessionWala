// src/context/AuthContext.jsx
// Global state provider using onAuthStateChanged to monitor login state
// and fetch user document to check for admin role.

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebaseConfig";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Provision or fetch user document from Firestore
  async function fetchOrCreateUserDoc(user) {
    if (!user) {
      setUserProfile(null);
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUserProfile({ id: userSnap.id, ...userSnap.data() });
    } else {
      // First login — provision user document
      const newProfile = {
        uid: user.uid,
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        role: "user",
        createdAt: serverTimestamp(),
      };
      await setDoc(userRef, newProfile);
      setUserProfile({ id: user.uid, ...newProfile });
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchOrCreateUserDoc(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    await fetchOrCreateUserDoc(result.user);
    return result;
  }

  async function logout() {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  }

  const isAdmin = userProfile?.role === "admin";

  const value = {
    currentUser,
    userProfile,
    isAdmin,
    loading,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen bg-[#fff9e9] flex items-center justify-center font-sans">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#3f0009]/20 border-t-[#3f0009] rounded-full animate-spin"></div>
            <p className="text-[#3f0009] font-bold tracking-widest uppercase text-sm animate-pulse">Loading Session...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
