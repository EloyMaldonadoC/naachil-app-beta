import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
//Components
import Card from "../components/Card";
import CardItem from "../components/CardItem";
//Firebase
import { db } from "../utils/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

const { width, height } = Dimensions.get("screen");

const LocalPreview = () => {
  const route = useRoute();
  const localId = route.params.item.id;

  const [dataLocal, setDataLocal] = React.useState("");
  const [productos, setProductos] = React.useState("");

  const obtenerDatosLocal = async () => {
    const docRef = doc(db, "partner", localId);
    const docSnap = await getDoc(docRef);
    setDataLocal(docSnap.data());
  };
  const obtenerProductoLocal = async () => {
    const data = [];
    const collectionRef = collection(db, `partner/${localId}/product`);
    const collectionSnap = await getDocs(collectionRef);
    if(collectionSnap.size > 0) {
      collectionSnap.forEach((doc) => {
        const { name, price, imageAsset } = doc.data();
        data.push({
          id: doc.id,
          name: name,
          imageAsset: imageAsset,
          price: price,
        });
      });
      setProductos(data);
    }
  };
  
  useEffect(() => {
    obtenerDatosLocal();
    obtenerProductoLocal();
  }, [route]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Card item={dataLocal} />
        <View style={styles.datosUsuario}>
          <Text style={styles.textoDatos}>productos disponibles</Text>
        </View>
        {productos ? (
          <FlatList
            data={productos}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <CardItem item={item} />}
            scrollEnabled={false}
          />
        ) : (
          <>
            <View style={{ padding: 16, alignItems: "center", marginTop: 100 }}>
              <Ionicons name="pricetags" size={50} color={"#808080"} />
              <Text style={{ fontSize: 16, color: "#808080", padding: 8 }}>
                Esta tienda aún no tiene productos a la venta.
              </Text>
            </View>
          </>
        )}
      </View>
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
    alignSelf: "center",
  },
});

export default LocalPreview;
