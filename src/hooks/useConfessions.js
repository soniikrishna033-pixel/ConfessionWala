// src/hooks/useConfessions.js
// Custom hook for Firestore confession operations:
// fetching approved confessions, adding new entries, incrementing counters,
// reporting, and replying.

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  increment,
  serverTimestamp,
  getDocs,
  arrayUnion,
  arrayRemove,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// ─── Public Feed Hook ────────────────────────────────────────────
export function useApprovedConfessions() {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "confessions"),
      where("status", "in", ["approved", "hidden"])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => {
        const timeA = a.timestamp?.toMillis?.() || a.createdAt?.toMillis?.() || 0;
        const timeB = b.timestamp?.toMillis?.() || b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      setConfessions(docs);
      setLoading(false);
    }, (error) => {
      console.error("Firebase fetch error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { confessions, loading };
}

// ─── Admin Hook – all confessions ────────────────────────────────
export function useAllConfessions() {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "confessions")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => {
        const timeA = a.timestamp?.toMillis?.() || a.createdAt?.toMillis?.() || 0;
        const timeB = b.timestamp?.toMillis?.() || b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      setConfessions(docs);
      setLoading(false);
    }, (error) => {
      console.error("Firebase fetch error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { confessions, loading };
}

// ─── Admin: Fetch all users for de-anonymization ─────────────────
export function useAllUsers() {
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const snapshot = await getDocs(collection(db, "users"));
      const map = {};
      snapshot.docs.forEach((d) => {
        map[d.id] = d.data();
      });
      setUsers(map);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  return { users, loading };
}

// ─── Mutation helpers ────────────────────────────────────────────

/** Submit a new confession with a sequentially numbered ID */
export async function submitConfession(uid, content, category = "general") {
  try {
    const counterRef = doc(db, "metadata", "counters");
    const newConfessionRef = doc(collection(db, "confessions"));
    
    await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      
      let currentCount = 0;
      if (counterDoc.exists()) {
        currentCount = counterDoc.data().confessionCount || 0;
      }
      
      const nextCount = currentCount + 1;
      
      transaction.set(counterRef, { confessionCount: nextCount }, { merge: true });
      
      transaction.set(newConfessionRef, {
        uid,
        content,
        category,
        confessionNum: nextCount,
        status: "approved",
        likes: 0,
        likedBy: [],
        reports: 0,
        reportedBy: [],
        replies: [],
        timestamp: serverTimestamp(),
      });
    });
    
    return newConfessionRef;
  } catch (error) {
    console.error("Submission failed: ", error.message);
    throw error;
  }
}

/** Toggle like on a confession */
export async function toggleLike(confessionId, userId, isLiked) {
  const ref = doc(db, "confessions", confessionId);
  if (isLiked) {
    await updateDoc(ref, {
      likes: increment(-1),
      likedBy: arrayRemove(userId),
    });
  } else {
    await updateDoc(ref, {
      likes: increment(1),
      likedBy: arrayUnion(userId),
    });
  }
}

/** Report a confession */
export async function reportConfession(confessionId, userId) {
  const ref = doc(db, "confessions", confessionId);
  await updateDoc(ref, {
    reports: increment(1),
    reportedBy: arrayUnion(userId),
  });
}

/** Submit a detailed report to a dedicated collection */
export async function submitDetailedReport(confessionId, userId, reason) {
  const reportsRef = collection(db, "reports");
  await addDoc(reportsRef, {
    confessionId,
    reason,
    reportedAt: serverTimestamp(),
    reportedBy: userId || 'anonymous',
    status: 'pending'
  });

  const ref = doc(db, "confessions", confessionId);
  await runTransaction(db, async (transaction) => {
    const docSnap = await transaction.get(ref);
    if (!docSnap.exists()) return;
    
    const data = docSnap.data();
    const currentReports = data.reports || 0;
    const nextReports = currentReports + 1;
    
    const updatePayload = {
      reports: nextReports,
      reportedBy: arrayUnion(userId || 'anonymous'),
      reportReasons: arrayUnion(reason)
    };
    
    // Auto-hide if more than 3 reports (which means nextReports >= 3)
    if (nextReports >= 3) {
      updatePayload.status = "hidden";
    }
    
    transaction.update(ref, updatePayload);
  });
}

/** Dismiss all reports on a confession */
export async function dismissReports(confessionId) {
  const ref = doc(db, "confessions", confessionId);
  await updateDoc(ref, {
    reports: 0,
    reportedBy: [],
    reportReasons: []
  });
}

/** Add a reply to a confession */
export async function addReply(confessionId, userId, text) {
  const ref = doc(db, "confessions", confessionId);
  await updateDoc(ref, {
    replies: arrayUnion({
      userId,
      text,
      createdAt: new Date().toISOString(),
    }),
  });
}

// ─── Admin Mutations ─────────────────────────────────────────────

/** Update confession status (approve / hide) */
export async function updateConfessionStatus(confessionId, status) {
  const ref = doc(db, "confessions", confessionId);
  await updateDoc(ref, { status });
}

/** Hard delete a confession */
export async function hardDeleteConfession(confessionId) {
  const ref = doc(db, "confessions", confessionId);
  await deleteDoc(ref);
}

/** Delete a reply from a confession */
export async function deleteReply(confessionId, replyObj) {
  const ref = doc(db, "confessions", confessionId);
  await updateDoc(ref, {
    replies: arrayRemove(replyObj),
  });
}
