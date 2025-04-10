import React, { useState } from "react";
import { View, Button, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { getAuth, createUserWithEmailAndPassword} from "../firebase/Config.js";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function Register() {
    
    const navigation = useNavigation();
    //const [isResident, setIsResident] = useState(false);
    //const [isCompany, setIsCompany] = useState(false);
    const [username, setUsername] = useState("test@foo.com");
    const [password, setPassword] = useState("123456");
    const [accountType, setAccountType] = useState("user");

    const signup = async () => {
      const auth = getAuth();
      const db = getFirestore();
      
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, username, password);
        const user = userCredential.user;
    
        const userData = {
          email: username,
          createdAt: new Date(),
        };
    
        const docRef = doc(db, accountType === "company" ? `companies/${user.uid}` : `users/${user.uid}`);
        await setDoc(docRef, userData);
    
        console.log('User registered and data saved!');
        navigation.navigate("Login");
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        console.error(error);
      }
    };

    return (
        <View style={styles.container}>
          <Text style={styles.title}>Rekisteröidy</Text>
          
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
          </View>*/}
          
          <View style={styles.accountTypeContainer}>
            <Text style={styles.label}>Tilin tyyppi</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  accountType === "user" && styles.radioButtonSelected,
                ]}
                onPress={() => setAccountType("user")}
              >
                <Text style={styles.radioText}>Asukas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  accountType === "company" && styles.radioButtonSelected,
                ]}
                onPress={() => setAccountType("company")}
              >
                <Text style={styles.radioText}>Taloyhtiö</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={signup}>
            <Text style={styles.buttonText}>Jatka</Text>
          </TouchableOpacity>
          
          <Text style={styles.footerText}>
            Oletko jo rekisteröitynyt?{" "}
            <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
                Kirjaudu
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
      accountTypeContainer: {
        width: "100%",
        marginTop: 10,
      },
      radioGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
      },
      radioButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginRight: 10,
      },
      radioButtonSelected: {
        backgroundColor: "#ff6b6b",
      },
      radioText: {
        color: "#000",
      },
    });

