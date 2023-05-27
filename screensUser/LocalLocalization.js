import React, {useEffect} from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');

const LocalLocalization = () => {

  const route = useRoute();
  const id = route.params.item.id

  return(
    <View style={styles.container}>
      <Text>{id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default LocalLocalization;