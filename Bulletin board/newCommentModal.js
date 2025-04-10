import newComment from "./newComment";
import {doc} from "../firebase/Config"
import { useState } from "react";
import { TextInput, Text, Modal, Button, StyleSheet, View } from "react-native";

export default function CommentModal({user,header,documentId, modalVisible, setModalVisible}){
    const [comment, setComment] = useState("")
    const [commentSuccess, setCommentSuccess] = useState("")

    return(
        <Modal transparent={true}
        visible={modalVisible}>
        <View style={styles.centerView}>
        <View style={styles.modalView}>
        <View style={styles.headerView}>
        <Text style={styles.header}>Kommentoi</Text>
        </View>
        <View style={styles.messageHeaderView}><Text style={styles.mesHed}>{"Ilmoitus: "}{header}</Text></View>
        <Text></Text>
        <TextInput placeholder="Kirjoita tähän"
        onChangeText={(text) => setComment(text)}
        value={comment}
        style={styles.commentInput}/>
        <View><Text>{commentSuccess}</Text></View>
        <View style={styles.buttonRow}>
        <View style={styles.button}>
        <Button title="Kommentoi"
        onPress={() => {newComment(setCommentSuccess,documentId, comment, user)
        }}/>
        </View>
        <View style={styles.button}>
        <Button title="Sulje"
        onPress={() => setModalVisible(false)}></Button>
        </View>
        </View>
        </View>
        </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    headerView: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20
    },
    modalView:{
        backgroundColor: "white",
        width: 300,
        height: 300,
        top: 200,
        borderColor: "black",
        borderRadius: 10,
    },
    centerView: {
        flexDirection: "row",
        justifyContent: "center"
    },
    buttonRow:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 40,
        marginRight: 40,
        marginTop: 50
    },
    button: {
        width: 100
    },
    mesHed: {
        fontSize: 15,
    },
    messageHeaderView: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center"
    },
    commentInput: {
        marginLeft: 40
    }
    }
)