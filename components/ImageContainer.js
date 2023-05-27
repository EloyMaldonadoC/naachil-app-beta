import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const {width, height} = Dimensions.get('screen');

const ImageContainer = ({item}) => {

    const { imageAsset, descripcion } = item;

    return (
        <View style={styles.container}>
            <Image source={{uri: imageAsset}} style={styles.imagen}/>
            <Text style={styles.description}>{descripcion}</Text>
        </View>
    ); 
}

const styles = StyleSheet.create({
    container: {
        width: 'auto',
        height: 'auto',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        margin:8,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    imagen: {
        width: 360,
        height: 230,
        borderRadius: 8,
    },
    description: {
        fontSize: 16,
        padding: 8,
        alignSelf: 'flex-start'
    }
});

export default ImageContainer;