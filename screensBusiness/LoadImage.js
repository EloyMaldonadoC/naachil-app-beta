import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
} from "react-native";
import Collapsible from "react-native-collapsible";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import ImageContainer from "../components/ImageContainer";
import AwesomeAlert from "react-native-awesome-alerts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, storage } from "../utils/firebaseConfig";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  doc,
  getDocs,
  getDoc,
  collection,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

const { width, height } = Dimensions.get("screen");

const LoadImage = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [singleAlert, setSingleAlert] = useState(false);
  const [messgeAlert, setMessageAlert] = useState("");
  const [image, setImage] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagenes, setImagenes] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [eliminar, setEliminar] = useState("");
  const [time, setTime] = useState("");
  const [uid, setUid] = useState(null);
  const [actualizar, setActualizar] = useState(0);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

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
    const hr = Date.now();
    setTime(hr);
    const storageRef = ref(storage, `gallery/${uid}/` + hr);
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
          console.log("File available at", downloadURL);
          setImageUrl(downloadURL);
        });
      }
    );
  };

  async function uploadDataImage() {
    //obtiene la ruta a el documento del local
    const docRef = doc(db, "partner/", `${uid}`);
    //agrega una coleccion nueva al documento del local
    const galSubRef = collection(docRef, "gallery");
    await addDoc(galSubRef, {
      descripcion: descripcion,
      time: time,
      imageAsset: imageUrl,
    });
    /*setImagenes([{
      id: galSubRef.id,
      descripcion: descripcion,
      imageAsset: imageUrl,
      time: time
    }, ...imagenes])*/
    setActualizar(actualizar + 1);
    resetData();
    setShowAlert(false);
    setMessageAlert("Se a agregado la nueva fotografía");
    setSingleAlert(true);
  }

  function comprobarCampos() {
    if (imageUrl === "" || descripcion == "") {
      setMessageAlert("Aún no se llenan todos los campos");
      setSingleAlert(true);
    } else {
      setShowAlert(true);
    }
  }

  async function resetData() {
    setCollapsed(!collapsed);
    setImage("");
    setImageUrl("");
    setTime("");
    setDescripcion("");
  }

  const PickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.canceled === false) {
      setImage(result.assets[0].uri);
    }
  };

  const getUid = async () => {
    const data = await AsyncStorage.getItem("@uid");
    return data;
  };

  const getDataImage = async (idUser) => {
    const dataImg = [];
    const collectionRef = collection(db, `partner/${idUser}/gallery`);
    //Toma los datos que existen en la galeria
    const collectionSnap = await getDocs(collectionRef);
    collectionSnap.forEach((doc) => {
      const { descripcion, imageAsset, time } = doc.data();
      dataImg.push({
        id: doc.id,
        descripcion: descripcion,
        imageAsset: imageAsset,
        time: time,
      });
    });
    setImagenes(dataImg);
  };

  useEffect(() => {
    if (uid === null) {
      getUid().then((uidUser) => {
        console.log("obtuvo el uid");
        getDataImage(uidUser);
        setUid(uidUser);
      });
    } else{
      getDataImage(uid);
    }
  }, [actualizar]);

  const deleteProduct = () => {
    console.log("Se eliminara");
    console.log(eliminar.imagen);
    const assetRef = ref(storage, `gallery/${uid}/${eliminar.asset}`);
    const docRef = doc(db, `partner/${uid}/gallery/${eliminar.imagen}`);
    deleteObject(assetRef)
      .then(() => {
        console.log("Ah sido eliminado la imagen");
      })
      .catch((e) => {
        console.log(e);
      });
    deleteDoc(docRef)
      .then(() => {
        console.log("Se ha eliminado el producto");
      })
      .catch((e) => {
        console.log(e);
      });
    setActualizar(actualizar + 1);
    setEliminar("");
    setShowDelete(false);
  };

  const handleLongPress = (item) => {
    const { id, time, descripcion, imageAsset } = item;
    setEliminar({
      imagen: id,
      asset: time,
    });
    setShowDelete(true);
  };

  const ImageContainerEx = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => {
        handleLongPress(item);
      }}
    >
      <ImageContainer item={item} />
    </TouchableOpacity>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.collapsedContainer}>
          <TouchableOpacity onPress={toggleCollapse}>
            <Text style={styles.textlabel}>
              {collapsed ? "Agregar un nueva foto" : "Ocultar"}
            </Text>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed}>
            <View style={styles.collapsedlist}>
              {!image ? (
                <TouchableOpacity
                  style={{ alignSelf: "center" }}
                  onPress={() => {
                    PickImage();
                  }}
                >
                  <Image
                    style={styles.image}
                    source={require("../assets/defaultImage.jpg")}
                  />
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={{ alignSelf: "center" }}
                    onPress={() => {
                      PickImage();
                    }}
                  >
                    <Image style={styles.image} source={{ uri: image }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      uploadImage();
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      Subir
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              <Text style={styles.textlabel}>Descripción</Text>
              <TextInput
                placeholder="Da una descripción a la foto"
                style={styles.textInput}
                value={descripcion}
                onChangeText={(descripcion) => setDescripcion(descripcion)}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  comprobarCampos();
                }}
              >
                <Text
                  style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 16 }}
                >
                  Aceptar
                </Text>
              </TouchableOpacity>
            </View>
          </Collapsible>
        </View>
        {imagenes ? (
          <View style={{ flex: 1, zIndex: 1 }}>
            <FlatList
              data={imagenes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <ImageContainerEx item={item} />}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View style={{ padding: 16, alignItems: "center" }}>
            <Ionicons name="images" size={50} color={"#808080"} />
            <Text style={{ fontSize: 16, color: "#808080", padding: 8 }}>
              Parece que aún no tienes ningúna fotografía.
            </Text>
          </View>
        )}
      </View>
      <AwesomeAlert
        show={showAlert}
        title="Advertencia"
        message="¿Quieres agregar esta nueva fotografía?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        confirmText="Aceptar"
        cancelText="Cancelar"
        cancelButtonColor="#c2c2c2"
        cancelButtonTextStyle={{ color: "#000000", fontWeight: "bold" }}
        confirmButtonTextStyle={{ color: "#FFFFFF", fontWeight: "bold" }}
        confirmButtonColor="#9E758D"
        onConfirmPressed={() => {
          uploadDataImage();
        }}
        onCancelPressed={() => {
          setShowAlert(false);
        }}
      />
      <AwesomeAlert
        show={singleAlert}
        title="Advertencia"
        message={messgeAlert}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="Aceptar"
        confirmButtonTextStyle={{ color: "#FFFFFF", fontWeight: "bold" }}
        confirmButtonColor="#9E758D"
        onConfirmPressed={() => {
          setSingleAlert(false);
        }}
      />
      <AwesomeAlert
        show={showDelete}
        title="Eliminar"
        message="¿Quieres eliminar el producto?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        confirmText="Eliminar"
        cancelText="Cancelar"
        cancelButtonColor="#c2c2c2"
        cancelButtonTextStyle={{ color: "#000000", fontWeight: "bold" }}
        confirmButtonTextStyle={{ color: "#FFFFFF", fontWeight: "bold" }}
        confirmButtonColor="#9E758D"
        onConfirmPressed={() => {
          deleteProduct();
        }}
        onCancelPressed={() => {
          setShowDelete(false);
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: "auto",
    alignItems: "center",
  },
  collapsedContainer: {
    width: "92%",
    height: "auto",
    padding: 8,
    margin: 8,
    backgroundColor: "#FFFFFF",
    elevation: 5,
    borderRadius: 8,
    shadowColor: "#000000",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  collapsedlist: {
    width: "92%",
    height: "auto",
    padding: 8,
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
  },
  textlabel: {
    fontSize: 16,
    padding: 8,
  },
  textInput: {
    width: "100%",
    height: 40,
    borderWidth: 0.3,
    padding: 10,
    borderRadius: 8,
  },
  image: {
    width: 300,
    height: 200,
  },
  button: {
    width: "auto",
    height: "auto",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#9E758D",
    margin: 8,
    alignItems: "center",
    borderRadius: 8,
  },
});

export default LoadImage;
