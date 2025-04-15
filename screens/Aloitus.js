import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import { useAuth } from '../context/AuthContext.js';
import { firestore, collection, doc } from '../firebase/Config.js'; 
import { onSnapshot, deleteDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

export default function Aloitus() {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false); 
  const { user } = useAuth();

  useEffect(() => {
    function fetchReservations(userEmail) {
      const reservationsRef = collection(firestore, 'reservations');
      const unsubscribe = onSnapshot(reservationsRef, (querySnapshot) => {
        const userReservations = [];
        querySnapshot.forEach((doc) => {
          const reservation = doc.data();
          if (reservation.henkilo === userEmail) {
            userReservations.push({ id: doc.id, ...reservation });
          }
        });
        setReservations(userReservations);
      });

      return () => unsubscribe();
    }

    if (user?.email) {
      fetchReservations(user.email);
    }
  }, [user?.email]);

  const deleteReservation = async (reservationId) => {
    try {
      const reservationDoc = doc(firestore, 'reservations', reservationId);
      await deleteDoc(reservationDoc); 
      setModalVisible(false); 
      console.log('Reservation deleted successfully!!');
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
  {user?.accountType === 'company' ? (
    <>
      Tervetuloa, {user?.email} <Text style={{ fontSize: 15, color: '#555' }}>(Yritystili)</Text>
    </>
  ) : (
    <>Tervetuloa, {user?.email}!</>
  )}
</Text>
      <Text style={styles.subtitle}>Nykyiset varauksesi:</Text>
      {reservations.length > 0 ? (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reservationItem}>
              <View style={styles.reservationDetails}>
                <Text style={styles.reservationText}>{item.resurssi}</Text>
                <Text style={styles.reservationText}>
                  Alkaa: {item.aloituspaiva} {item.aloitusaika}
                </Text>
                <Text style={styles.reservationText}>
                  Päättyy: {item.lopetuspaiva} {item.lopetusaika}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.trashIcon}
                onPress={() => {
                  setSelectedReservation(item); 
                  setModalVisible(true); 
                }}
              >
                <Icon name="delete" size={24} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noReservations}>Sinulla ei ole varauksia!</Text>
      )}

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Haluatko varmasti poistaa varauksen "{selectedReservation?.aloituspaiva} {selectedReservation?.aloitusaika} 
              - {selectedReservation?.lopetuspaiva} {selectedReservation?.lopetusaika}"?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Peruuta"
                onPress={() => setModalVisible(false)}
                color="gray"
              />
              <Button
                title="Poista"
                onPress={() => deleteReservation(selectedReservation?.id)}
                color="#ff6b6b"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  reservationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  reservationDetails: {
    flex: 1,
  },
  reservationText: {
    fontSize: 14,
    color: '#555',
  },
  trashIcon: {
    marginLeft: 10,
  },
  noReservations: {
    marginTop: 20,
    fontSize: 14,
    color: '#555',
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