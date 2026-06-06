// src/hooks/useChannels.js
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

// Fetch all public channels (Explore)
export function usePublicChannels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "channels"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChannels(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { channels, loading };
}

// Fetch channels the current user is a member of
export function useMyChannels() {
  const { currentUser } = useAuth();
  const [myChannels, setMyChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setMyChannels([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "channel_members"), where("userId", "==", currentUser.uid), where("status", "==", "approved"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const channelIds = snapshot.docs.map(d => d.data().channelId);
      if (channelIds.length === 0) {
        setMyChannels([]);
        setLoading(false);
        return;
      }
      
      // Fetch actual channel data
      // Note: In a real large-scale app, you might want to fetch these efficiently, but for now we can subscribe to them or just fetch
      // For simplicity, we just fetch the channel docs
      const channelsData = await Promise.all(
        channelIds.map(async (id) => {
          const cDoc = await getDoc(doc(db, "channels", id));
          return cDoc.exists() ? { id: cDoc.id, ...cDoc.data() } : null;
        })
      );
      setMyChannels(channelsData.filter(c => c !== null));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return { myChannels, loading };
}

// Fetch a single channel by ID
export function useChannel(channelId) {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!channelId) return;
    const unsubscribe = onSnapshot(doc(db, "channels", channelId), (d) => {
      if (d.exists()) {
        setChannel({ id: d.id, ...d.data() });
      } else {
        setChannel(null);
      }
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [channelId]);

  return { channel, loading };
}

// Create a new channel
export async function createChannel(name, description, pfpUrl, isPrivate, userId) {
  const channelRef = doc(collection(db, "channels"));
  const channelId = channelRef.id;
  const inviteCode = Math.random().toString(36).substring(2, 10);
  
  await setDoc(channelRef, {
    name,
    description,
    pfpUrl: pfpUrl || "https://api.dicebear.com/7.x/shapes/svg?seed=" + channelId,
    ownerId: userId,
    isPrivate,
    inviteCode,
    createdAt: serverTimestamp()
  });

  // Add the owner as an approved member
  const memberRef = doc(db, "channel_members", `${channelId}_${userId}`);
  await setDoc(memberRef, {
    channelId,
    userId,
    role: "owner",
    status: "approved",
    joinedAt: serverTimestamp()
  });

  return channelId;
}

// Join a channel
export async function joinChannel(channelId, userId, isPrivate, forceApprove = false, providedCode = null) {
  const memberRef = doc(db, "channel_members", `${channelId}_${userId}`);
  const payload = {
    channelId,
    userId,
    role: "member",
    status: (isPrivate && !forceApprove && !providedCode) ? "pending" : "approved",
    joinedAt: serverTimestamp()
  };
  if (providedCode) payload.providedCode = providedCode;
  
  await setDoc(memberRef, payload);
}

// Leave a channel
export async function leaveChannel(channelId, userId) {
  const memberRef = doc(db, "channel_members", `${channelId}_${userId}`);
  await deleteDoc(memberRef);
}

// Delete a channel
export async function deleteChannel(channelId) {
  await deleteDoc(doc(db, "channels", channelId));
  // Note: in production, a Cloud Function should delete all subcollections/confessions and members.
}
