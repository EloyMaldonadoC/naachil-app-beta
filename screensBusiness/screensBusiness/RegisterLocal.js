import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TextInput,
  BackHandler,
  Alert,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AwesomeAlert from "react-native-awesome-alerts";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
//Firebase
import { db, auth, storage } from "../utils/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, collection, setDoc, getDoc, addDoc } from "firebase/firestore";
//Toma las dimensiones de la pantalla
const { width, height } = Dimensions.get("screen");

const RegistroLocal = () => {
  //Navigacion
  const navigation = useNavigation();
  //Inicio de Sesion
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [uid, setUid] = useState("");
  //Atributos
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [image, setImage] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertPick, setShowAlertPick] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  //Ubicacion
  const [state, setState] = React.useState("");
  const [town, setTown] = React.useState("");
  const [townShip, setTownShip] = React.useState("");
  const [addressStreet, setAddressStreet] = React.useState("");
  const [stateLocation, setStateLocation] = React.useState(false);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.0903,
    longitudeDelta: 0.0421,
  });
  //Logica de renderizado
  const [renderComponent0, setRenderComponent0] = useState("render");
  const [renderComponent1, setRenderComponent1] = useState(null);
  const [renderComponent2, setRenderComponent2] = useState(null);
  const [renderComponent3, setRenderComponent3] = useState(null);
  const [renderComponent4, setRenderComponent4] = useState(null);

  //Renderiza las vistas de los componentes hacia delante
  function renderLogic() {
    if (renderComponent0 === "render") {
      setRenderComponent0(null);
      setRenderComponent1("render");
    }
    if (renderComponent1 === "render") {
      setRenderComponent1(null);
      setRenderComponent2("render");
    }
    if (renderComponent2 === "render") {
      setRenderComponent2(null);
      setRenderComponent3("render");
    }
    if (renderComponent3 === "render") {
      setRenderComponent3(null);
      setRenderComponent4("render");
    }
  }
  //Renderiza las vistas de los componentes hacia atras
  function backRender() {
    if (renderComponent2 === "render") {
      setRenderComponent2(null);
      setRenderComponent1("render");
    }
    if (renderComponent3 === "render") {
      setRenderComponent3(null);
      setRenderComponent2("render");
    }
    if (renderComponent4 === "render") {
      setRenderComponent4(null);
      setRenderComponent3("render");
    }
  }
  //confirma que exista nombre
  function confirmNombre() {
    if (nombre === "") {
      setShowAlert(true);
      setAlertMessage("Aún no colocas un nombre para tu local");
      return;
    }
    renderLogic();
  }
  //Confirma que exista descripcion
  function confimDescripcion() {
    if (descripcion === "") {
      setShowAlert(true);
      setAlertMessage("Aún no colocas una descripción para tu local");
      return;
    }
    renderLogic();
  }
  //Confirma que exista una imagen seleccionada
  function confirmImagen() {
    if (image === "") {
      setShowAlert(true);
      setAlertMessage("Selecciona una imagen para usar como encabezado");
      return;
    }
    uploadImage();
    renderLogic();
  }
  //Confirma que exista la ubicación
  function confirmUbicacion() {
    if (
      stateLocation === false ||
      state === "" ||
      town === "" ||
      townShip === "" ||
      addressStreet === ""
    ) {
      setShowAlert(true);
      setAlertMessage("Faltan datos por llenar en el formulario");
      return;
    } else {
      setAlertMessage("¿Estas seguro que estos son los datos correctos?");
      setShowAlertPick(true);
    }
  }
  //Ejecuta la carga de datos y el redireccionamiento
  async function uploadData() {
    handlesRegisterLocal();
    handlesRegisterUbication();
    redirect(uid);
    setShowAlertPick(false);
  }
  //Toma una imagen de la galaeria
  const PickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 2],
      quality: 1,
    });
    if (result.canceled === true) {
      setShowAlert(true);
      return;
    } else {
      setImage(result.assets[0].uri);
    }
  };
  //Carga la imagen a storage de firebase
  const uploadImage = async () => {
    //Convierte imagen a blob
    const blobImage = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request error: " + xhr.response));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });
    //crea metadata de la imagen
    const metadata = {
      contentType: "image/jpeg",
    };
    //sube la imagen al almacenamiento
    // Upload file and metadata to the object 'images/mountains.jpg'
    //const storageRef = ref(storage, "images/" + Date.now());
    const storageRef = ref(storage, `headers/${uid}/` + "headerImage");
    const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageURL(downloadURL);
          console.log("File available at", downloadURL);
        });
      }
    );
  };
  //inicia la localizacion
  const startLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }
    const locationUB = await Location.getCurrentPositionAsync({});
    const lat = locationUB.coords.latitude;
    const lon = locationUB.coords.longitude;
    const latitude = Math.round(lat * 10000) / 10000;
    const longitude = Math.round(lon * 10000) / 10000;

    setLocation({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    console.log(location);
    setStateLocation(true);
  };
  //Registra la informacion en la base de datos
  const handlesRegisterLocal = () => {
    const docRef = doc(db, "partner/", `${uid}`);
    setDoc(docRef, {
      name: nombre,
      description: descripcion,
      photoHeader: imageURL,
      street: addressStreet,
      state: state,
      town: town,
      townShip: townShip,
    });
  };
  const handlesRegisterUbication = () => {
    const lat = location.latitude;
    const lon = location.longitude;
    const latit = Math.round(lat * 10000) / 10000;
    const longi = Math.round(lon * 10000) / 10000;
    const docRef = doc(db, "ubications/", `${uid}`);
    setDoc(docRef, {
      latitude: latit,
      longitude: longi,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    })
  };
  //Crea un usuario y lo registra en la base de datos
  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Account created");
        setUid(userCredential.user.uid);
        const docRef = doc(db, `users/${userCredential.user.uid}`);
        setDoc(docRef, { email: email, rol: "partner" });
        renderLogic();
      })
      .catch((error) => {
        console.log(error);
        setAlertMessage(error.message);
        setShowAlert(true);
      });
  };
  //autentifica la sesión
  const handlesSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Account Signed");
        redirect(userCredential.user.uid);
      })
      .catch((error) => {
        console.log(error);
        setAlertMessage(error.message);
        setShowAlert(true);
      });
  };
  //Redirecciona la vista para la sesión correspondiente al usuario
  async function redirect(uid) {
    console.log(uid);
    getRol(uid)
      .then((rol) => {
        if (rol === "user") {
          storeUser(uid);
          navigation.navigate("MainUser");
        } else {
          storePartner(uid);
          navigation.navigate("MainLocal");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  //Busca al usuario y obtiene su rol
  async function getRol(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data().rol;
  }
  //Carga las credenciales a el AsycStorage para el usuario
  const storeUser = async (uid) => {
    try {
      await AsyncStorage.setItem("@user", "render");
      await AsyncStorage.setItem("@partner", "");
      await AsyncStorage.setItem("@uid", uid);
    } catch (e) {
      console.log(e);
    }
  };
  //Carga las credenciales a el AsycStorage para el partner
  const storePartner = async (uid) => {
    try {
      await AsyncStorage.setItem("@partner", "render");
      await AsyncStorage.setItem("@user", "");
      await AsyncStorage.setItem("@uid", uid);
    } catch (e) {
      console.log(e);
    }
  };
  //Boqueo de hardware
  function handlesBackButtonClick() {
    return true;
  }
  //Se ejecuta mientras esta pantalla este en foco
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handlesBackButtonClick);
      return () => {
        BackHandler.removeEventListener(
          "hardwareBackPress",
          handlesBackButtonClick
        );
      };
    }, [])
  );

  /*<MapView
                  style={styles.map}
                  showsUserLocation={true}
                  followsUserLocation={true}
                  initialRegion={location}
                  onPress={(evento) =>
                    setLocation(evento.nativeEvent.coordinate)
                  }
                >
                  <Marker
                    coordinate={location}
                    draggable
                    onDragEnd={(direction) =>
                      setLocation(direction.nativeEvent.coordinate)
                    }
                    title="Ubicación seleccionada"
                  />
                </MapView>*/

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {renderComponent0 ? (
          <View style={styles.container}>
            <View style={styles.component1}>
              <Text style={styles.textHeader}>Bienvenido al apartado</Text>
              <Text style={styles.textHeader}> de locales</Text>
              <Text style={styles.textDesc}>
                Inicia sesión como dueño de un local o registra el tuyo aquí.
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Correo Electrónico"
                value={email}
                onChangeText={(email) => setEmail(email)}
                autoCorrect={true}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Contraseña"
                value={password}
                onChangeText={(password) => setPassword(password)}
                secureTextEntry={true}
                caretHidden={true}
              />
              <TouchableOpacity
                style={styles.buttonImage}
                onPress={() => {
                  handlesSignIn();
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>
              <View style={styles.linea} />
              <TouchableOpacity style={styles.buttonImage}>
                <Text
                  style={{ color: "white", fontWeight: "bold" }}
                  onPress={handleCreateAccount}
                >
                  Registrarse
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={{ color: "#9E758D", fontSize: 16 }}>
                  Iniciar sesión como usuario
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {renderComponent1 ? (
          <View style={styles.component1}>
            <Text style={styles.textHeader}> Bienvenido a Naáchil </Text>
            <Text style={styles.textDesc}>
              Para poder unirte a nuestros socios, ¿Cuál es el nombre de tu
              empresa o emprendimiento?
            </Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setNombre(text)}
              value={nombre}
              placeholder="Nombre de la Empresa"
            />
            <View style={styles.containerButtoms}>
              <TouchableOpacity
                style={styles.enterButton}
                onPress={() => confirmNombre()}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Aceptar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {renderComponent2 ? (
          <View style={styles.component1}>
            <Text style={styles.textHeader}>
              {" "}
              Escribe una Descripción de tú Empresa{" "}
            </Text>
            <Text style={styles.textDesc}>
              Tu descripción debera de ser breve y concreta, no debe de exceder
              los 100 caracteres
            </Text>
            <TextInput
              style={styles.textInputDes}
              onChangeText={(text) => setDescripcion(text)}
              value={descripcion}
              placeholder="Descripción de la Empresa"
              multiline={true}
              numberOfLines={3}
              maxLength={100}
            />
            <View style={styles.containerButtoms}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => backRender()}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Volver
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.enterButton}
                onPress={() => confimDescripcion()}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Aceptar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {renderComponent3 ? (
          <View style={styles.component1}>
            <Text style={styles.textHeader}>Selecciona una portada</Text>
            <Text style={styles.textDesc}>
              La imagen seleccionada se mostrara en la portada de la vista
              previa de tu negocio
            </Text>
            {image && (
              <Image
                source={{
                  uri: image,
                }}
                style={{
                  width: 350,
                  height: 150,
                  marginTop: 8,
                  marginBottom: 8,
                }}
              />
            )}
            <TouchableOpacity
              style={styles.buttonImage}
              onPress={() => PickImage()}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Selecciona
              </Text>
            </TouchableOpacity>
            <View style={styles.containerButtoms}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => backRender()}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Volver
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.enterButton}
                onPress={() => confirmImagen()}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Aceptar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {renderComponent4 ? (
          <View style={styles.container}>
            <View style={styles.component1}>
              <Text style={styles.textHeader}>
                ¿Dondé se encuentra tu local?
              </Text>
              <Text style={styles.textDesc}>
                Coloca en el mapa la localización de tu local, es recomendable
                estar en el local, despues agrega tu dirección.
              </Text>
              {location.latitude ? (
                <></>
              ) : (
                <TouchableOpacity
                  style={styles.buttonImage}
                  onPress={startLocation}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Selecciona la Ubicación
                  </Text>
                </TouchableOpacity>
              )}
              <TextInput
                style={styles.textInput}
                onChangeText={(state) => setState(state)}
                value={state}
                placeholder="Nombre de el Estado"
              />
              <TextInput
                style={styles.textInput}
                onChangeText={(town) => setTown(town)}
                value={town}
                placeholder="Nombre de el Municipio"
              />
              <TextInput
                style={styles.textInput}
                onChangeText={(townShip) => setTownShip(townShip)}
                value={townShip}
                placeholder="Nombre de la Ciudad o localidad"
              />
              <TextInput
                style={styles.textInput}
                onChangeText={(addressStreet) =>
                  setAddressStreet(addressStreet)
                }
                value={addressStreet}
                placeholder="Dirección de la Calle"
              />
              <View style={styles.containerButtoms}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => backRender()}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Volver
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.enterButton}
                  onPress={() => confirmUbicacion()}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Aceptar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}
      </View>

      <AwesomeAlert
        show={showAlert}
        title="Campos no válidos"
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="Aceptar"
        confirmButtonColor="#9E758D"
        confirmButtonStyle={{ color: "#FFFFFF", fontWeight: "bold" }}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
      <AwesomeAlert
        show={showAlertPick}
        title="Advertencia"
        message={alertMessage}
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
          uploadData();
        }}
        onCancelPressed={() => {
          setShowAlertPick(false);
        }}
      />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  component1: {
    width: "92%",
    height: "91%",
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
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "92%",
    height: "20%",
    alignSelf: "center",
    borderRadius: 8,
    margin: 16,
  },

  textHeader: {
    fontSize: 30,
    marginBottom: 8,
    fontWeight: "bold",
  },
  textDesc: {
    fontSize: 16,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
    marginRight: 16,
    marginLeft: 16,
  },
  textInput: {
    width: "84%",
    height: 40,
    marginBottom: 8,
    marginRight: 16,
    marginLeft: 16,
    marginTop: 8,
    borderWidth: 0.3,
    padding: 10,
    borderRadius: 8,
  },
  textInputDes: {
    width: "84%",
    height: 80,
    marginBottom: 8,
    marginRight: 16,
    marginLeft: 16,
    marginTop: 8,
    borderWidth: 0.3,
    padding: 10,
    borderRadius: 8,
  },
  textLabel: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
    marginRight: 16,
    marginLeft: 16,
  },
  containerButtoms: {
    width: "90%",
    height: 70,
  },
  backButton: {
    backgroundColor: "#9E758D",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 16,
    width: "auto",
    alignSelf: "flex-start",
    position: "absolute",
    borderRadius: 8,
  },
  enterButton: {
    backgroundColor: "#9E758D",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    margin: 16,
    width: "auto",
    alignSelf: "flex-end",
    position: "absolute",
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#9E758D",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    margin: 16,
    width: "auto",
    alignSelf: "flex-end",
    borderRadius: 8,
  },
  buttonImage: {
    backgroundColor: "#9E758D",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    margin: 16,
    width: "auto",
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
});

export default RegistroLocal;
