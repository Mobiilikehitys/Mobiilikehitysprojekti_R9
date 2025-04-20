import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firestore, collection, query, onSnapshot } from '../firebase/Config.js';

export default function useAnnouncementTracker(user) {
  const [hasNew, setHasNew] = useState(false);
  const [seenIds, setSeenIds] = useState(null);

  useEffect(() => {
    if (!user || user.accountType !== 'user') return;

    const seenKey = `seenAnnouncementIds_${user.uid}`;
    const hasNewKey = `hasNewAnnouncements_${user.uid}`;
    let unsubscribe;

    const init = async () => {
      try {
        const storedSeen = await AsyncStorage.getItem(seenKey);
        const storedHasNew = await AsyncStorage.getItem(hasNewKey);

        const initialSeenIds = storedSeen ? JSON.parse(storedSeen) : [];
        setSeenIds(initialSeenIds);
        setHasNew(storedHasNew === 'true');

        const q = query(collection(firestore, 'announcements'));

        unsubscribe = onSnapshot(q, async (snapshot) => {
          const newDocs = snapshot.docChanges().filter(
            (c) => c.type === 'added' && !initialSeenIds.includes(c.doc.id)
          );

          if (newDocs.length > 0) {
            const newIds = newDocs.map((c) => c.doc.id);
            const updatedIds = [...new Set([...initialSeenIds, ...newIds])];

            setHasNew(true);
            setSeenIds(updatedIds);

            await AsyncStorage.setItem(seenKey, JSON.stringify(updatedIds));
            await AsyncStorage.setItem(hasNewKey, 'true');
          }
        });
      } catch (e) {
        console.error('Error loading announcements:', e);
      }
    };

    init();

    return () => unsubscribe?.();
  }, [user]);

  const clearHasNew = async () => {
    const hasNewKey = `hasNewAnnouncements_${user.uid}`;
    setHasNew(false);
    await AsyncStorage.setItem(hasNewKey, 'false');
  };

  return [hasNew, clearHasNew];
}
