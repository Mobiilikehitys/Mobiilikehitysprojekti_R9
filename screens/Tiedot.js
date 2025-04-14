import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { firestore} from '../firebase/Config.js'; 
import { getDocs, collection, doc, onSnapshot } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { useAuth } from '../context/AuthContext.js'; 

export default function Tiedot() {
  const { user } = useAuth(); 
  const [creationDate, setCreationDate] = useState(null);
  const [allAccounts, setAllAccounts] = useState([]); 

  useEffect(() => {
    async function fetchAccountInfo(userId, accountType) {
      if (accountType === 'company') {
        try {
         
          const usersCollectionRef = collection(firestore, 'users');
          const querySnapshot = await getDocs(usersCollectionRef);
          const accounts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("Fetched accounts:", accounts); 
          setAllAccounts(accounts);
        } catch (error) {
          console.error("Error fetching user accounts:", error);
        }
      } else {
        const accountDocRef = doc(firestore, 'users', userId);
        const unsubscribe = onSnapshot(accountDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const accountData = docSnapshot.data();
            console.log("Account data:", accountData);

            const createdAt = accountData.createdAt?.toDate(); 
            setCreationDate(createdAt);
          } else {
            console.log('No such document!');
          }
        });

        return () => unsubscribe();
      }
    }

    if (user?.uid && user?.accountType) {
      fetchAccountInfo(user.uid, user.accountType); 
    }
  }, [user?.uid, user?.accountType]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {user?.accountType === 'company' ? 'Asukkaat' : 'Omat tiedot'}
      </Text>
      {user?.accountType === 'company' ? (
        
        <FlatList
        data={allAccounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userInfo}>
            {[
              { icon: "email", label: "Sähköposti", value: item.email },
              { icon: "person", label: "Käyttäjä luotu", value: item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Ei saatavilla' },
              { icon: "account-circle", label: "Käyttäjä ID", value: item.id },
            ].map((info, index) => (
              <View key={index} style={styles.infoRow}>
                <Icon name={info.icon} size={24} color="#ff6b6b" style={styles.icon} />
                <Text style={styles.infoText}>{info.label}: {info.value}</Text>
              </View>
            ))}
          </View>
        )}
      />
      ) : (
       
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
      )}
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
    marginBottom: 15,
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