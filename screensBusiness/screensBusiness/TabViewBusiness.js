import * as React from 'react';
import { View, useWindowDimensions, StyleSheet, TouchableOpacity, Animated, Text } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
//Screens 
import MainPageBusiness from './MainPageBusiness';
import LoadProduct from './LoadProduct';
import LoadImage from './LoadImage';

const MainPageRoute = () => (
    <MainPageBusiness />
);

const ProductRoute = () => (
    <LoadProduct />
);

const ImageRoute = () => (
    <LoadImage />
);

const RenderScene = SceneMap({
    first: MainPageRoute,
    second: ProductRoute,
    third: ImageRoute,
});

const renderTabBar = props => (
    <TabBar 
        {...props}
        labelStyle={{fontSize: 16, fontWeight: 'bold'}}
        indicatorStyle={{backgroundColor: 'yellow'}}
        style={{backgroundColor: '#9E758D'}}
    />
);

export default function TabViewBusiness() {

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Vista Previa' },
        { key: 'second', title: 'Productos' },
        { key: 'third', title: 'Galería' },
    ]);

    return (
        <SafeAreaProvider>
            <View style={{height: 24 }}/>
            <StatusBar backgroundColor={'#9E758D'} style='light'/>
            <TabView
            navigationState={{ index, routes}}
            renderScene={RenderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width}}
            renderTabBar={renderTabBar}
            style={{backgroundColor: '#F2F2F2'}}
        />
        </SafeAreaProvider>
    );
}



