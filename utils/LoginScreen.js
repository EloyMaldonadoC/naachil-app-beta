import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from '@react-navigation/native'
import AwesomeAlert from "react-native-awesome-alerts";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { auth, db } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, addDoc, collection, getDoc } from "firebase/firestore"; 

const { width, height } = Dimensions.get("screen");

const LoginScreen = () => {

  const navigation = useNavigation();

  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      console.log("Account created");
      console.log(userCredential.user);
      setErrorMessage("Cuenta Creada");
      setShowAlert(true);
      const docuRef = doc(db, `users/${userCredential.user.uid}`);
      setDoc(docuRef, {email: email, rol: 'user'});
    }).catch(error => {
      console.log(error);
      setErrorMessage(error.message);
      setShowAlert(true);
    })
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      console.log("Account signed")
      redirect(userCredential.user.uid);
    }).catch(error => {
      console.log(error);
      setErrorMessage(error.message);
      setShowAlert(true);
    })
  };

  async function redirect (uid) {
    console.log(uid);
    getRol(uid).then((rol) => {
      if(rol === 'user') {
        storeUser(uid);
      } else {
        storePartner(uid);
      }
    })
  }

  async function getRol(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data().rol;
  }
  const storeUser = async (uid) => {
    try {
      await AsyncStorage.setItem('@user', "render");
      await AsyncStorage.setItem('@partner', "");
      await AsyncStorage.setItem('@uid', uid);
    } catch(e){
      console.log(e);
    }
  }
  const storePartner = async (uid) => {
    try {
      await AsyncStorage.setItem('@partner', "render");
      await AsyncStorage.setItem('@user', "");
      await AsyncStorage.setItem('@uid', uid);
    } catch(e) {
      console.log(e);
    }
  } 

  return (
    <SafeAreaView>
      <StatusBar/>
      <View style={styles.container}>
        <View style={styles.component1}>
          <Text style={styles.text}>Bienvenido, es hora de inicar sesión</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(email) => onChangeEmail(email)}
            placeholder="Intoduce tu correo eletrónico"
            autoCorrect={true}
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(password) => onChangePassword(password)}
            placeholder="Intoduce tu contraseña"
            secureTextEntry={true}
            caretHidden={true}
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSignIn}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Iniciar Sesión
            </Text>
          </TouchableOpacity>
          <View style={styles.linea} />
          <TouchableOpacity 
            style={styles.button}
            onPress={handleCreateAccount}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Registrarse
            </Text>
          </TouchableOpacity>
          <Text style={{ marginTop: 56, fontSize: 16 }}>Iniciar sesión como usuario</Text>
          <TouchableOpacity onPress={() => navigation.navigate('JoinBusiness')}>
            <Text style={{ color: "#9E758D", fontSize: 16 }}>
              Registrate o unete aquí
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <AwesomeAlert
        show={showAlert}
        title="Campos no válidos"
        message={errorMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="Aceptar"
        confirmButtonColor="#9E758D"
        onConfirmPressed={ () => { setShowAlert(false) }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    marginTop: 8,
    marginBottom: 8,
    marginRight: 16,
    marginLeft: 16,
  },
  input: {
    height: 40,
    width: 252,
    margin: 8,
    borderWidth: 0.3,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#9E758D",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    margin: 8,
    width: "auto",
    alignSelf: "center",
    borderRadius: 8,
  },
  linea: {
    backgroundColor: "gray",
    height: 1,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 4,
    marginBottom: 4,
  },
  component1: {
    width: "92%",
    height: "92%",  
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    padding: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
});

export default LoginScreen;
