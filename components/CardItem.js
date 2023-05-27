import react from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const CardItem = ({item}) => {
  const {name, imageAsset, price } = item;
  return (
    <View style={ styles.constainer }>
      <Image
        style={ styles.image }
        source={{
          uri: imageAsset
        }}
      />
      <Text style={ styles.textHeader }>{name}</Text>
      <Text style={ styles.textPrice }>{price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  constainer: {
    width: 'auto',
    height: 'auto',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
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
    marginLeft: 8,
    marginRight: 8,
  },
  image: {
    width: 150,
    height: 150,
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 8,
    borderRadius: 8
  },
  textHeader: {
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16,
    color: "#000000",
    fontWeight: 'bold',
  },
  textPrice: {
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
    color: "#008f39",
  }
});

export default CardItem;
