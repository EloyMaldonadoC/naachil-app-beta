import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Card from "../components/Card";
import CardItem from "../components/CardItem";
import ImageContainer from "../components/ImageContainer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import AwesomeAlert from "react-native-awesome-alerts";
//Firestore database
import { db } from "../utils/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

const { width, height } = Dimensions.get("screen");

const MainPageBusiness = () => {
  const [data, setData] = useState([]);
  const [productos, setProductos] = useState("");
  const [galeria, setGaleria] = useState("");
  const [actualizar, setActualizar] = useState(0);
  const [user, setUser] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  async function getUid() {
    const uid = await AsyncStorage.getItem("@uid");
    return uid;
  }

  async function getData(uid) {
    const docRef = doc(db, "partner", uid);
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    const userSnap = await getDoc(userRef);
    setUser(userSnap.data().email);
    return docSnap.data();
  }
  const getDataProduct = async (idUser) => {
    const dataProduct = [];
    const collectionRef = collection(db, `partner/${idUser}/product`);
    //Toma los datos que existen en la galeria
    const collectionSnap = await getDocs(collectionRef);
    if (collectionSnap.size > 0) {
      collectionSnap.forEach((doc) => {
        const { name, imageAsset, price } = doc.data();
        dataProduct.push({
          id: doc.id,
          name: name,
          imageAsset: imageAsset,
          price: price,
        });
      });
      setProductos(dataProduct);
    }
  };
  const getDataImage = async (idUser) => {
    const dataImg = [];
    const collectionRef = collection(db, `partner/${idUser}/gallery`);
    //Toma los datos que existen en la galeria
    const collectionSnap = await getDocs(collectionRef);
    if (collectionSnap.size > 0) {
      collectionSnap.forEach((doc) => {
        const { descripcion, imageAsset, time } = doc.data();
        dataImg.push({
          id: doc.id,
          descripcion: descripcion,
          imageAsset: imageAsset,
        });
      });
      setGaleria(dataImg);
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
    getUid().then((uid) => {
      getData(uid).then((data) => {
        setData(data);
      });
      getDataImage(uid);
      getDataProduct(uid);
    });
    const interval = setInterval(() => {
      console.log("Actuaizando");
      setActualizar(actualizar + 1);
    }, 5000); // actualiza cada 5 segundos
    return () => clearInterval(interval);
  }, [actualizar]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.datosUsuario}>
          <Text style={styles.textoDatos}>
            Bienvenido, los datos de tu local se visualizaran de la siguiente
            tarjeta para todos los usuarios cercanos.
          </Text>
          <View style={{ width: "92%", height: 40 }}>
            <Text
              style={{
                padding: 8,
                fontSize: 16,
                color: "#808080",
                position: "absolute",
                alignSelf: "flex-start",
              }}
            >
              Sesión Actual: {user}
            </Text>
            <TouchableOpacity
              style={{ position: "absolute", alignSelf: "flex-end" }}
              onPress={() => setShowAlert(true)}
            >
              <Ionicons name="log-out-outline" size={32} color={"#B2B2B2"} />
            </TouchableOpacity>
          </View>
        </View>
        <Card item={data} />
        <View style={styles.datosUsuario}>
          <Text style={styles.textoVista}>Vista previa de tus productos.</Text>
        </View>
        {productos ? (
          <View style={{ flex: 1, zIndex: 1 }}>
            <FlatList
              data={productos}
              numColumns={2}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <CardItem item={item} />}
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
        <View style={styles.datosUsuario}>
          <Text style={styles.textoVista}>
            Vista previa de las fotos del local.
          </Text>
        </View>
        {galeria ? (
          <View style={{ flex: 1, zIndex: 1 }}>
            <FlatList
              data={galeria}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <ImageContainer item={item} />}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View style={{ padding: 16, alignItems: "center" }}>
            <Ionicons name="images" size={50} color={"#808080"} />
            <Text style={{ fontSize: 16, color: "#808080", padding: 8 }}>
              Parece que aún no tienes ningúna foto del local.
            </Text>
          </View>
        )}
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
          logOut();
        }}
        onCancelPressed={() => {
          setShowAlert(false);
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
  datosUsuario: {
    width: "92%",
    height: "auto",
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
    elevation: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 8,
  },
  textoDatos: {
    padding: 8,
    fontSize: 16,
    color: "#808080",
  },
  textoVista: {
    padding: 8,
    fontSize: 16,
    textAlign: "center",
    color: "#808080",
  },
});

export default MainPageBusiness;
