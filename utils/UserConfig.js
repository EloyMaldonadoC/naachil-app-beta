import React, { useState, useEffect, } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AwesomeAlert from "react-native-awesome-alerts";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("screen");

const UserConfig = () => {
  const navigation = useNavigation();

  const [userEmail, setUserEmail] = useState("Usuario");
  const [showAlert, setShowAlert] = useState(false);

  async function getEmail(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data().email;
  }
  const getUid = async () => {
    try {
      const uid = await AsyncStorage.getItem("@uid");
      return uid;
    } catch (e) {
      console.log(e);
    }
  };
  function logOut() {
    delateCredentials();
    setShowAlert(false);
  }
  const delateCredentials = async () => {
    try {
      await AsyncStorage.setItem("@uid", "");
      await AsyncStorage.setItem("@user", "");
      await AsyncStorage.setItem("@partner", "");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUid()
      .then((uid) => {
        getEmail(uid)
          .then((email) => {
            setUserEmail(email);
          })
          .catch((e) => console.log(e));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.aboutUser}>
          <Ionicons name="person-circle-outline" size={120} color={"#B2B2B2"} />
          <Text
            style={{
              position: "absolute",
              paddingLeft: 150,
              paddingTop: 40,
              fontSize: 16,
              color: '#b2b2b2'
            }}
          >
            {userEmail}
          </Text>
        </View>
        <TouchableOpacity style={styles.loginOutUser} onPress={() => {setShowAlert(true)}}>
          <Text
            style={{
              fontSize: 16,
              position: "absolute",
              margin: 16,
              alignSelf: "flex-start",
            }}
          >
            Cerrar Sesión
          </Text>
          <Ionicons
            name="log-out-outline"
            size={32}
            color={"#B2B2B2"}
            style={{
              position: "absolute",
              alignSelf: "flex-end",
              margin: 8,
              paddingRight: 16,
            }}
          />
        </TouchableOpacity>
      </View>
      <AwesomeAlert
        show={showAlert}
        title="Cierre de Sesión"
        message={"¿Estas seguro que quieres cerrar la sesión?"}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        confirmText="Aceptar"
        cancelText="Cancelar"
        confirmButtonColor="#9E758D"
        cancelButtonTextStyle={{ color: "#000000", fontWeight: "bold" }}
        confirmButtonTextStyle={{ color: "#FFFFFF", fontWeight: "bold" }}
        onConfirmPressed={() => {
            logOut()
        }}
        onCancelPressed={() => {
          setShowAlert(false);
        }}
      />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    alignItems: "center",
    marginTop: 20,
  },
  aboutUser: {
    width: "92%",
    height: "18%",
    marginTop: 16,
    marginBottom: 8,
    marginRight: 8,
    marginLeft: 8,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  loginOutUser: {
    width: "92%",
    height: "6%",
    marginTop: 16,
    marginBottom: 8,
    marginRight: 8,
    marginLeft: 8,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
});

export default UserConfig;
