import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { firestore, doc } from '../firebase/Config.js'; 
import { onSnapshot } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { useAuth } from '../context/AuthContext.js'; 

export default function Tiedot() {
  const { user } = useAuth(); 
  const [creationDate, setCreationDate] = useState(null);

  useEffect(() => {
    function fetchCreationDate(userId) {
      const userDocRef = doc(firestore, 'users', userId); 
      const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          console.log("User data:", userData);
          const createdAt = userData.createdAt?.toDate(); 
          setCreationDate(createdAt);
        } else {
          console.log('No such document!');
        }
      });

      return () => unsubscribe();
    }

    if (user?.uid) {
      fetchCreationDate(user.uid); 
    }
  }, [user?.uid]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Omat tiedot</Text>
      <View style={styles.userInfo}>
        <View style={styles.infoRow}>
          <Icon name="email" size={24} color="#ff6b6b" style={styles.icon} />
          <Text style={styles.infoText}>Sähköposti: {user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="person" size={24} color="#ff6b6b" style={styles.icon} />
          <Text style={styles.infoText}>
            Käyttäjä luotu: {creationDate ? creationDate.toLocaleDateString() : 'Ladataan...'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="account-circle" size={24} color="#ff6b6b" style={styles.icon} />
          <Text style={styles.infoText}>Käyttäjä ID: {user?.uid}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff6b6b',
    textAlign: 'center',
  },
  userInfo: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    flex: 1,
    flexWrap: 'wrap',
  },
});