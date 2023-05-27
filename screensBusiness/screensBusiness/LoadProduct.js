import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
} from "react-native";
import Collapsible from "react-native-collapsible";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import CardItem from "../components/CardItem";
import AwesomeAlert from "react-native-awesome-alerts";
import AsyncStorage from "@react-native-async-storage/async-storage";
//firebase
import { db, storage } from "../utils/firebaseConfig";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

const { width, height } = Dimensions.get("screen");

const LoadProduct = () => {
  const [uid, setUid] = useState(null);
  const [actualizar, setActualizar] = useState(0);
  const [collapsed, setCollapsed] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [singleAlert, setSingleAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [foto, setFoto] = useState("");
  const [time, setTime] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [productos, setProductos] = useState("");

  const [showDelete, setShowDelete] = useState(false);
  const [eliminar, setEliminar] = useState("");

  const PickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (result.canceled === false) {
      setFoto(result.assets[0].uri);
    }
  };

  //carga la imagen a la base de datos
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
      xhr.open("GET", foto, true);
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
    const storageRef = ref(storage, `products/${uid}/` + hr);
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
          setFotoUrl(downloadURL);
        });
      }
    );
  };

  async function uploadDataProduct() {
    //obtiene la ruta a el documento del local
    const docRef = doc(db, "partner/", `${uid}`);
    //agrega una coleccion nueva al documento del local
    const productSubRef = collection(docRef, "product");
    await addDoc(productSubRef, {
      name: nombre,
      imageAsset: fotoUrl,
      price: `$ ${precio}`,
      time: time,
    });
    /*setProductos([
      {
        id: productSubRef.id,
        name: nombre,
        imageAsset: fotoUrl,
        price: `$ ${precio}`,
        time: time,
      },
      ...productos,
    ]);*/
    setActualizar(actualizar + 1);
    resetData();
    setShowAlert(false);
    setMessageAlert("Se a agregado el nuevo producto");
    setSingleAlert(true);
  }
  async function resetData() {
    setFoto("");
    setFotoUrl("");
    setNombre("");
    setPrecio("");
    setCollapsed(!collapsed);
  }

  function comprobarCampos() {
    if (fotoUrl === "" || nombre == "" || precio == "") {
      setMessageAlert("Aún no se llenan todos los campos");
      setSingleAlert(true);
    } else {
      setShowAlert(true);
    }
  }

  const getUid = async () => {
    const data = await AsyncStorage.getItem("@uid");
    return data;
  };

  const getDataProduct = async (idUser) => {
    const dataProduct = [];
    const collectionRef = collection(db, `partner/${idUser}/product`);
    //Toma los datos que existen en la galeria
    const collectionSnap = await getDocs(collectionRef);
    if (collectionSnap.size > 0) {
      collectionSnap.forEach((doc) => {
        const { name, imageAsset, price, time } = doc.data();
        dataProduct.push({
          id: doc.id,
          name: name,
          imageAsset: imageAsset,
          price: price,
          time: time,
        });
      });
      setProductos(dataProduct);
    }
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    if (uid === null) {
      getUid().then((idUsuario) => {
        console.log("uid actualizado");
        getDataProduct(idUsuario);
        setUid(idUsuario);
      });
    } else {
      getDataProduct(uid);
    }
  }, [actualizar]);

  const handleLongPress = (item) => {
    const { name, imageAsset, price, id, time } = item;
    setEliminar({
      producto: id,
      imagen: time,
    });
    setShowDelete(true);
  };

  const deleteProduct = () => {
    console.log("Se eliminara");
    console.log(eliminar.producto);
    const assetRef = ref(storage, `products/${uid}/${eliminar.imagen}`);
    const docRef = doc(db, `partner/${uid}/product/${eliminar.producto}`);
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

  const CardItemEx = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => {
        handleLongPress(item);
      }}
    >
      <CardItem item={item} />
    </TouchableOpacity>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.collapsedContainer}>
          <TouchableOpacity onPress={toggleCollapse}>
            <Text style={styles.textlabel}>
              {collapsed ? "Agregar producto" : "Ocultar"}
            </Text>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed}>
            <View style={styles.collapsedlist}>
              {!foto ? (
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
                    <Image style={styles.image} source={{ uri: foto }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      uploadImage();
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      Subir
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              <Text style={styles.textlabel}>Nombre</Text>
              <TextInput
                placeholder="Nombre del producto"
                style={styles.textInput}
                value={nombre}
                onChangeText={(nombre) => setNombre(nombre)}
              />
              <Text style={styles.textlabel}>Precio</Text>
              <TextInput
                placeholder="precio del producto"
                style={styles.textInput}
                value={precio}
                keyboardType="number-pad"
                onChangeText={(precio) => setPrecio(precio)}
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
        {productos ? (
          <View style={{ flex: 1, zIndex: 1 }}>
            <FlatList
              data={productos}
              numColumns={2}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <CardItemEx item={item} />}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View style={{ padding: 16, alignItems: "center" }}>
            <Ionicons name="pricetags" size={50} color={"#808080"} />
            <Text style={{ fontSize: 16, color: "#808080", padding: 8 }}>
              Parece que aún no tienes ningún producto.
            </Text>
          </View>
        )}
      </View>
      <AwesomeAlert
        show={showAlert}
        title="Advertencia"
        message="¿Quieres agregar este producto?"
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
          uploadDataProduct();
        }}
        onCancelPressed={() => {
          setShowAlert(false);
        }}
      />
      <AwesomeAlert
        show={singleAlert}
        title="Advertencia"
        message={messageAlert}
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
    width: 150,
    height: 150,
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

export default LoadProduct;
