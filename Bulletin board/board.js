import useData from "../calendar/useData";
import { BULLETINS, addDoc, deleteField, firestore, updateDoc, getDocs , deleteDoc, collection, doc} from "../firebase/Config";
import {Text, View, StyleSheet, Button, FlatList, Pressable, Modal } from "react-native"
import newBulletin from "./newBulletin";
import BulletinModal from "./newBulModal";
import React, { useState } from "react";
import useDataOrder from "./useDataOrder";
import { convertFirebaseTimeStampJS } from "./serverTimeStampToJSON";
import Icon from 'react-native-vector-icons/FontAwesome'
import deleteItem from "../firebase/Delete";
import CommentModal from "./newCommentModal";
import { useAuth } from "../context/AuthContext";

export default function Board(){
    const { user } = useAuth()
    const [modalVisible, setModalVisible] = useState(false)
    const oldData = useDataOrder(collection(firestore, BULLETINS))
    const [comModalVisible, setComModalVisible] = useState(false)
    const [commentsVisible, setCommentsVisible] = useState({})


    const deleteItemFully = async (id) => {
        console.log("DeleteItemFully started");
        try {
            const bulletRef = collection(firestore, BULLETINS, id, "comments");
            const querySnapshot = await getDocs(bulletRef);
            querySnapshot.forEach(async (doc) => {
                console.log("Deleting comment:", doc.id);
                await deleteDoc(doc(firestore, BULLETINS, id, "comments", doc.id));
            });
    
            await deleteDoc(doc(firestore, BULLETINS, id)); 
            console.log("Bulletin fully deleted");
        } catch (error) {
            console.error("Error deleting bulletin:", error);
        }
    };

    const showComments = (id) => {
        const tempJSON = {...commentsVisible}
        tempJSON[id] = !commentsVisible[id]
        setCommentsVisible(tempJSON)

    }

    const Comments = ({docID}) => {
        console.log("Comments started")
        const commentData = useDataOrder(collection(firestore, BULLETINS, docID, "comments"))
        console.log("CommentData:", commentData)
        return(
            <View style={styles.comments}>
            {commentData.map((data,index) => (
                <View key={index}>
                    <Text style={styles.commentPersonText}>{data.henkilo}{" "}{convertFirebaseTimeStampJS(data.luotu)}</Text>
                    <Text style={styles.commentText}>{data.kommentti}</Text>
                </View>
        ))}
        </View>)
    }


    const RenderItem = (item) => {
        const timeStamp = convertFirebaseTimeStampJS(item.luotu);
        return (
            <View style={styles.renderItem}>
                <View style={styles.centerView}>
                    <View style={styles.bulletin}>
                        <View style={styles.createdView}>
                            <Text style={styles.createdText}>{item.henkilo}{" "}{timeStamp}</Text>
                        </View>
                        {user?.accountType === 'company' ? (
                            <View style={styles.closeButton}>
                                <Pressable onPress={() => { deleteItemFully(item.id); }}>
                                    <Icon name="trash" size={30} color="#ff6b6b" />
                                </Pressable>
                            </View>
                        ) : (
                            
                            item.henkilo === user.email && (
                                <View style={styles.closeButton}>
                                    <Pressable onPress={() => { deleteItemFully(item.id); }}>
                                        <Icon name="times" size={30} color="#000" />
                                    </Pressable>
                                </View>
                            )
                        )}
                        {item.otsikko && (
                            <View style={styles.headerView}>
                                <Text style={styles.headerText}>{item.otsikko}</Text>
                            </View>
                        )}
                        <View style={styles.messageView}>
                            <Text style={styles.messageText}>{item.viesti}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };
    return(
        <View style={styles.centerView}>
            <View style={styles.centerView}>
            <View>
            <View style={styles.button}>
            <Button title="Uusi ilmoitus"
            onPress={() => setModalVisible(true)}/></View>
            <FlatList
                        data={oldData}
                        renderItem={({item, index}) => RenderItem(item) }
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.flatlistContainer}
                        />
            <BulletinModal user={user} modalVisible={modalVisible} setModalVisible={setModalVisible}/>
            </View></View>
        </View>
    )


}

const styles = StyleSheet.create({
    commentText: {
        marginLeft: 10
    },
    commentPersonText: {
        fontSize: 10,
        marginTop: 20,
        marginLeft: 10,
    },
    comments: {

    },
    bottomLine: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 10
    },
    headerView: {
        marginLeft: 10,
        marginTop: 5
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold"
    },
    centerView: {
        flexDirection: "row",
        justifyContent: 'center'
    },
    button: {
        marginTop: 5,
        width: 450,
        flexDirection: "row",
        justifyContent: 'center'
    },
    messageView: {
        padding: 10
    },
    createdView: {
        paddingLeft: 10
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 5
    },
    bulletin: {
        marginTop: 5,
        marginBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 5,
        backgroundColor: "rgb(20, 167, 215)",
        borderRadius: 10,
        width: 300
    },
    flatlistContainer:{

    },
    messageText:{
        fontSize: 15
    },
    createdText: {
        fontSize: 10
    },
})