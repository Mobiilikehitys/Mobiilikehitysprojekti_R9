import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext.js';
import { firestore, collection, addDoc, serverTimestamp, doc } from '../firebase/Config.js';
import { query, orderBy, onSnapshot, deleteDoc } from 'firebase/firestore';
import { Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from 'react-native-paper';

export default function Tiedotteet() {
  const { user } = useAuth();
  const [announcement, setAnnouncement] = useState('');
  const [title, setTitle] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  
  useEffect(() => {
    const announcementsRef = collection(firestore, 'announcements');
    const q = query(announcementsRef, orderBy('luotu', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedAnnouncements = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(fetchedAnnouncements);
    });

    return () => unsubscribe(); 
  }, []);

  const handlePostAnnouncement = async () => {
    if (!title || !announcement) {
      Alert.alert('Virhe', 'Täytä kaikki kentät ennen julkaisua.');
      return;
    }
    try {
      const announcementsRef = collection(firestore, 'announcements');
      await addDoc(announcementsRef, {
        luotu: serverTimestamp(),
        otsikko: title,
        viesti: announcement,
      });
      setTitle('');
      setAnnouncement('');
      Alert.alert('Onnistui', 'Tiedote julkaistu');
    } catch (error) {
      console.error('Error posting announcement:', error);
      Alert.alert('Virhe', 'Tiedotteen julkaisu epäonnistui.');
    }
  };

  const deleteAnnouncement = async (announcementId) => {
    try {
      const announcementDocRef = doc(firestore, 'announcements', announcementId);
      await deleteDoc(announcementDocRef);
      setModalVisible(false);
      Alert.alert('Onnistui', 'Tiedote poistettu');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      Alert.alert('Virhe', 'Tiedotteen poisto epäonnistui.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Taloyhtiön tiedotteet</Text>

      {user?.accountType === 'company' && (
        <View style={styles.announcementForm}>
          <Text style={styles.formTitle}>Julkaise uusi tiedote</Text>
          <TextInput
            style={styles.input}
            placeholder="Otsikko"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Kirjoita tiedote..."
            value={announcement}
            onChangeText={setAnnouncement}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={handlePostAnnouncement}>
            <Text style={styles.buttonText}>Julkaise</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.announcementCard}>
            <Text style={styles.cardTitle}>{item.otsikko}</Text>
            <Text style={styles.cardText}>{item.viesti}</Text>
            <Text style={styles.cardFooter}>
              {item.luotu && item.luotu.toDate
                ? item.luotu.toDate().toLocaleDateString()
                : 'Päivämäärä ei saatavilla'}
            </Text>
            {user?.accountType === 'company' && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedAnnouncement(item);
                  setModalVisible(true);
                }}
              >
                <Text style={{ color: '#ff6b6b', marginTop: 10 }}>Poista tiedote</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noAnnouncements}>Ei tiedotteita.</Text>}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Haluatko varmasti poistaa tiedotteen?</Text>
            <View style={styles.modalButtons}>
              <Button
                onPress={() => setModalVisible(false)}
                color="gray"
              >
                Peruuta
              </Button>
              <Button
                onPress={() => {
                  if (selectedAnnouncement) {
                    deleteAnnouncement(selectedAnnouncement.id);
                  }
                }}
                color="#ff6b6b"
              >
                Poista
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
  },
  announcementForm: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  announcementCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  cardFooter: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  noAnnouncements: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});