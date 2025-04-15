import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getAuth, signInWithEmailAndPassword,auth,firestore } from "../firebase/Config.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext.js";

export default function Login() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("test1@foo.com");
  const [password, setPassword] = useState("123456");
  const { setUser } = useAuth();

  const signin = async () => {
    const auth = getAuth();
    const db = firestore;
  
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, username, password);
      const loggedInUser = userCredentials.user;
  
      // Try getting both user and company documents
      const userDoc = await getDoc(doc(db, "users", loggedInUser.uid));
      const companyDoc = await getDoc(doc(db, "companies", loggedInUser.uid));
  
      let userData = {
        uid: loggedInUser.uid,
        email: loggedInUser.email,
      };
  
      if (userDoc.exists()) {
        console.log("Logged in as user");
        userData.accountType = "user";
        userData.profile = userDoc.data();
        setUser(userData); 
        navigation.navigate("Aloitus");
      } else if (companyDoc.exists()) {
        console.log("Logged in as company");
        userData.accountType = "company";
        userData.profile = companyDoc.data();
        setUser(userData); 
        navigation.navigate("Aloitus");
      } else {
        console.log("Account type not found in Firestore.");
        Alert.alert("Tiliä ei löytynyt", "Tarkista kirjautumistietosi.");
      }
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        console.log("Invalid credentials.");
        Alert.alert("Väärä tunnus/salasana", "Tarkista kirjautumistietosi");
      } else if (error.code === "auth/too-many-requests") {
        console.log("Too many attempts to login.");
        Alert.alert("Liian monta kirjautumisyritystä", "Yritä myöhemmin uudestaan");
      } else {
        console.log(error.code, error.message);
        Alert.alert("Virhe", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kirjaudu sisään</Text>

      <Text style={styles.label}>Käyttäjätunnus</Text>
      <TextInput
        style={styles.input}
        placeholder="Tunnus"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Salasana</Text>
      <TextInput
        style={styles.input}
        placeholder="Salasana"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={signin}>
        <Text style={styles.buttonText}>Kirjaudu</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Oletko uusi käyttäjä?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
          Rekisteröidy
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    color: "#ff6b6b",
    marginTop: 10,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#ff6b6b",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 20,
    color: "#555",
  },
  link: {
    color: "#ff6b6b",
    fontWeight: "bold",
  },
});
