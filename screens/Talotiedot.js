import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { firestore, collection, getDocs, addDoc } from '../firebase/Config';

export default function Talotiedot() {
  const { user } = useAuth();
  const [info, setInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const collectionRef = collection(firestore, "info");
        const querySnapshot = await getDocs(collectionRef);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setInfo(data[0] || {}); 
      } catch (error) {
        console.error("Error fetching info:", error);
      }
    };
    fetchInfo();
  }, []);

  const handleSave = async () => {
    try {
      const collectionRef = collection(firestore, "info");
      await addDoc(collectionRef, info); // tässä vaiheessa vielä tallentaa aina uuden dokumentin eikä siis päivitä vanhaa
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving info:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Talon tiedot</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Yhtiön nimi:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={info.name || ''}
            onChangeText={(text) => setInfo({ ...info, name: text })}
          />
        ) : (
          <Text style={styles.text}>{info.name || 'Ei tietoja'}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Osoite:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={info.address || ''}
            onChangeText={(text) => setInfo({ ...info, address: text })}
          />
        ) : (
          <Text style={styles.text}>{info.address || 'Ei tietoja'}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Yhteystiedot:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={info.contactinfo || ''}
            onChangeText={(text) => setInfo({ ...info, contactinfo: text })}
          />
        ) : (
          <Text style={styles.text}>{info.contactinfo || 'Ei tietoja'}</Text>
        )}
      </View>
    
          <View style={styles.section}>
            <Text style={styles.label}>Rakennukset:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={info.buildings || ''}
                onChangeText={(text) => setInfo({ ...info, buildings: text })}
              />
            ) : (
              <Text style={styles.text}>{info.buildings || 'Ei tietoja'}</Text>
            )}
          </View>
    
          <View style={styles.section}>
            <Text style={styles.label}>Lämmitys:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={info.heating || ''}
                onChangeText={(text) => setInfo({ ...info, heating: text })}
              />
            ) : (
              <Text style={styles.text}>{info.heating || 'Ei tietoja'}</Text>
            )}
          </View>
    
          <View style={styles.section}>
            <Text style={styles.label}>Autopaikat:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={info.parking || ''}
                onChangeText={(text) => setInfo({ ...info, parking: text })}
              />
            ) : (
              <Text style={styles.text}>{info.parking || 'Ei tietoja'}</Text>
            )}
          </View>
    
          <View style={styles.section}>
            <Text style={styles.label}>Varattavat tilat:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={info.reservablespaces || ''}
                onChangeText={(text) => setInfo({ ...info, reservablespaces: text })}
              />
            ) : (
              <Text style={styles.text}>{info.reservablespaces || 'Ei tietoja'}</Text>
            )}
          </View>
    
          <View style={styles.section}>
            <Text style={styles.label}>Asukkaita:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={info.occupants || ''}
                onChangeText={(text) => setInfo({ ...info, occupants: text })}
              />
            ) : (
              <Text style={styles.text}>{info.occupants || 'Ei tietoja'}</Text>
            )}
          </View>
    
          <View style={styles.section}>
            <Text style={styles.label}>Valmistusvuosi:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={info.constructionyear || ''}
                onChangeText={(text) => setInfo({ ...info, constructionyear: text })}
              />
            ) : (
              <Text style={styles.text}>{info.constructionyear || 'Ei tietoja'}</Text>
            )}
          </View>
    
          <View style={styles.section}>
            <Text style={styles.label}>Ovikoodi:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={info.doorcode || ''}
                onChangeText={(text) => setInfo({ ...info, doorcode: text })}
              />
            ) : (
              <Text style={styles.text}>{info.doorcode || 'Ei tietoja'}</Text>
            )}
          </View>
    
          <View style={styles.section}>
            <Text style={styles.label}>Muut tiedot:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={info.otherinfo || ''}
                onChangeText={(text) => setInfo({ ...info, otherinfo: text })}
                multiline
              />
            ) : (
              <Text style={styles.text}>{info.otherinfo || 'Ei tietoja'}</Text>
            )}
          </View>
    
          {user?.accountType === 'company' && (
        <View style={styles.buttonContainer}>
          {isEditing ? (
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Tallenna</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
              <Text style={styles.buttonText}>Muokkaa</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', 
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b', 
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
    backgroundColor: '#fff', 
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, 
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff', 
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center', 
  },
  button: {
    backgroundColor: '#ff6b6b', 
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});