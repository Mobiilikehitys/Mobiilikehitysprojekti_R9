import React, { useState } from "react";
import { View, Button, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { getAuth, signInWithEmailAndPassword} from "../firebase/Config.js";
import { useNavigation } from "@react-navigation/native";


export default function Login() {
    const navigation = useNavigation();
    //const [isResident, setIsResident] = useState(false);
    //const [isCompany, setIsCompany] = useState(false);
    const [username, setUsername] = useState("test@foo.com");
    const [password, setPassword] = useState("123456");

    const signin = () => {
        const auth = getAuth()

        signInWithEmailAndPassword(auth, username, password)
        .then((userCredentials) => {
          navigation.navigate("Aloitus")
            console.log('Login OK')
        }).catch((error) => {
            if (error.code === 'auth/invalid-credential') {
                console.log('Invalid credentials.')
            } else if (error.code === 'auth/too-many-requests') {
                console.log('Too many attempts to login.')
            } else {
                console.log(error.code,error.message)
            }
        })
    }

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
      
      {/*<View style={styles.checkboxContainer}>
        <CheckBox value={isResident} onValueChange={setIsResident} />
        <Text>Asukas</Text>
      </View>
      
      <View style={styles.checkboxContainer}>
        <CheckBox value={isCompany} onValueChange={setIsCompany} />
        <Text>Taloyhtiö</Text>
      </View> */}
      
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
};

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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 5,
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
  


