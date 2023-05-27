import React from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, StatusBar } from 'react-native';
import { SceneMap } from 'react-native-tab-view';
//Screens 
import MainPageBusiness from '../screensBusiness/MainPageBusiness';
import LoadProduct from '../screensBusiness/LoadProduct';
import LoadImage from '../screensBusiness/LoadImage';

const MainPageRoute = () => (
    <MainPageBusiness />
);

const ProductRoute = () => (
    <LoadProduct />
);

const ImageRoute = () => (
    <LoadImage />
);

export default class CostumTabView extends React.Component {

    _renderScene = SceneMap({
        first: MainPageRoute,
        second: ProductRoute,
        third: ImageRoute,
    });

    state = {
        index: 0,
        routes: [
            { key: 'first', title: 'First' },
            { key: 'second', title: 'Second' },
            { key: 'third', title: 'Third' },
        ],
    };

    _handleIndexChange = (index) => this.setState({ index });

    _renderTabBar = (props) => {
        const inputRange = props.navigationState.routes.map((x, i) => i);

        this.return(
            <View style={styles.tabBar}>
                {props.navigationState.routes.map((route, i) => {
                    const opacity = props.position.interpolate({
                        inputRange,
                        outputRange: inputRange.map((inputIndex) => inputIndex === i ? 1 : 0.5),
                    });
                    this.return(
                        <TouchableOpacity
                            style={styles.tabItem}
                        >
                            <Animated.Text style={{ opacity }}>{route.title}</Animated.Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    tabBar: {
      flexDirection: 'row',
      paddingTop: StatusBar.currentHeight,
      backgroundColor: 'green'
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      padding: 16,
    },
  });