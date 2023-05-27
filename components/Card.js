import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Card = ({item}) => {

  const { name, description, photoHeader, state, street, town, townShip} = item;

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: photoHeader,
        }}
      />
      <Text style={styles.textHeader}>{name}</Text>
      <Text style={styles.texteDescrip}>{description}</Text>
      <Text style={styles.textAddress}>
        <Ionicons name="location-sharp" size={16} />
        {street}, {town}, {townShip}, {state}.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "auto",
    height: "auto",
    //border: '1px solid',
    borderRadius: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  textHeader: {
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16,
    color: "#000000",
    fontWeight: "bold",
    fontSize: 18
  },
  texteDescrip: {
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 8,
    padding: 8,
    fontSize: 16
  },
  textAddress: {
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
    color: "#9E758D",
    fontSize: 14
  },
  image: {
    width: 350,
    height: 160,
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
});

export default Card;
