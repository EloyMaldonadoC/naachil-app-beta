import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
//components
import ImageContainer from "../components/ImageContainer";
//Firebase
import { db } from "../utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const { width, height } = Dimensions.get("screen");

const LocalGalery = () => {
  const route = useRoute();
  const localId = route.params.item.id;

  const [imagenes, setImagenes] = useState("");

  const obtenerImagenesLocal = async () => {
    const data = [];
    const collectionRef = collection(db, `partner/${localId}/gallery`);
    const collectionSnap = await getDocs(collectionRef);
    if (collectionSnap.size > 0) {
      collectionSnap.forEach((doc) => {
        const { imageAsset, descripcion } = doc.data();
        data.push({
          id: doc.id,
          imageAsset: imageAsset,
          descripcion: descripcion,
        });
      });
      setImagenes(data);
    }
  };

  useEffect(() => {
    obtenerImagenesLocal();
  }, [route]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.datosUsuario}>
          <Text style={styles.textoDatos}>Vista previa de tus productos.</Text>
        </View>
        {imagenes ? (
          <View style={{ flex: 1, zIndex: 1 }}>
            <FlatList
              data={imagenes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <ImageContainer item={item} />}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View style={{ padding: 16, alignItems: "center", marginTop: "75%" }}>
            <Ionicons name="images" size={50} color={"#808080"} />
            <Text style={{ fontSize: 16, color: "#808080", padding: 8 }}>
              Parece que aún no tienes ningúna fotografía.
            </Text>
          </View>
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

export default LocalGalery;
