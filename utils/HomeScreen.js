import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Dimensions,
  BackHandler,
  AppRegistry,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
//component
import Card from "../components/Card";
//Firebase
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const { width, height } = Dimensions.get("screen");

const HomeScreen = () => {
  const navigation = useNavigation();

  const [locales, setLocales] = useState("");

  const obtenerLocalesCercanos = async () => {
    const data = [];
    const collectionRef = collection(db, "partner");
    const collectionSnap = await getDocs(collectionRef);
    if (collectionSnap.size > 0) {
      collectionSnap.forEach((doc) => {
        const {
          name,
          description,
          photoHeader,
          state,
          street,
          town,
          townShip,
          location,
        } = doc.data();
        data.push({
          id: doc.id,
          name: name,
          description: description,
          photoHeader: photoHeader,
          state: state,
          street: street,
          town: town,
          townShip: townShip,
          location: location,
        })
      });
      setLocales(data);
    };
  };

  const CardEx = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("Local", { item })}>
      <Card item={item} />
    </TouchableOpacity>
  );

  useEffect(() => {
    obtenerLocalesCercanos();
  }, [])

  return (
    <ScrollView>
      <StatusBar backgroundColor={"#F2F2F2"} style="dark" />
      <View style={styles.container}>
        {locales ? (
          <>
            <View style={{ height: 20 }} />
            <FlatList
              data={locales}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <CardEx item={item} />}
              scrollEnabled={false}
            />
            <View style={{ height: 100 }} />
          </>
        ) : (
          <>
            <View style={styles.noLocales}>
              <Ionicons
                name="search"
                size={80}
                color={"#B2B2B2"}
                style={{ alignSelf: "center" }}
              />
              <Text style={{ fontSize: 16, color: "#B2B2B2" }}>
                Parece que no hay ningun local cercas
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
  noLocales: {
    width: width,
    height: height,
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
