// src/hooks/useChannels.js
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
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
export async function createChannel(name, userId) {
  // Normalize the name to create an Instagram-style handle
  const channelId = name.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  if (!channelId) throw new Error("Invalid room name.");

  const channelRef = doc(db, "channels", channelId);
  const docSnap = await getDoc(channelRef);
  
  if (docSnap.exists()) {
    throw new Error("ROOM_EXISTS");
  }
  
  await setDoc(channelRef, {
    name,
    pfpUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=" + channelId,
    ownerId: userId,
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
export async function joinChannel(channelId, userId) {
  const memberRef = doc(db, "channel_members", `${channelId}_${userId}`);
  const payload = {
    channelId,
    userId,
    role: "member",
    status: "approved",
    joinedAt: serverTimestamp()
  };
  await setDoc(memberRef, payload);
}

// Leave a channel
export async function leaveChannel(channelId, userId) {
  const memberRef = doc(db, "channel_members", `${channelId}_${userId}`);
  await deleteDoc(memberRef);
}

// Delete a channel and its sub-resources
export async function deleteChannel(channelId) {
  // 1. Delete all channel_members for this channel
  const memQuery = query(collection(db, "channel_members"), where("channelId", "==", channelId));
  const memSnap = await getDocs(memQuery);
  const deleteMemPromises = memSnap.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deleteMemPromises);

  // 2. Delete all confessions for this channel
  const confQuery = query(collection(db, "confessions"), where("channelId", "==", channelId));
  const confSnap = await getDocs(confQuery);
  const deleteConfPromises = confSnap.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deleteConfPromises);

  // 3. Delete the channel document
  await deleteDoc(doc(db, "channels", channelId));
}
