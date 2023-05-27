import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
//Firebase
import { db } from "../utils/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const { width, height } = Dimensions.get("screen");

const LocalLocalization = () => {
  const route = useRoute();
  const localId = route.params.item.id;

  const [dataLocal, setDataLocal] = useState("");
  const [ubicacionLocal, setUbicacionLocal] = useState({
    latitude: 0.000,
    longitude: 0.000,
  });

  const obtenerDatosLocal = async () => {
    const docRef = doc(db, "partner", localId);
    const docSnap = await getDoc(docRef);
    setDataLocal(docSnap.data());
  };

  const obtenerUbicacion = async () => {
    const docRef = doc(db, "ubications", localId);
    const docSnap = await getDoc(docRef);
    setUbicacionLocal(docSnap.data());
    console.log(docSnap.data());
  };

  useEffect(() => {
    obtenerUbicacion();
    obtenerDatosLocal();

  }, [route]);

  /*<MapView style={styles.mapView} initialRegion={ubicacionLocal}>
          <Marker
            coordinate={ubicacionLocal}
            title={dataLocal.name}
            description={dataLocal.description}
          />
        </MapView>*/
  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>

      </View>
      <View style={styles.dataContainer}>
        <Text styles={styles.container}>
          Ubicado en: {dataLocal.street}, {dataLocal.townShip}, {dataLocal.town}
          , {dataLocal.state}.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    alignItems: "center",
  },
  mapContainer: {
    width: "94%",
    height: "60%",
    backgroundColor: "#FFFFFF",
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    elevation: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 8,
  },
  mapView: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  dataContainer: {
    width: "94%",
    height: "auto",
    padding: 16,
    marginTop: 8,
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
});

export default LocalLocalization;
