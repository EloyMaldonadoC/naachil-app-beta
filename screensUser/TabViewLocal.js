import * as React from 'react';
import { View, useWindowDimensions, StyleSheet, TouchableOpacity, Animated, Text } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
//Screens 
import LocalPreview from '../screensUser/LocalPreview';
import LocalLocalization from '../screensUser/LocalLocalization';
import LocalGalery from '../screensUser/LocalGalery';

const PreviewRoute = () => (
    <LocalPreview />
);

const galleryRoute = () => (
    <LocalGalery />
);

const localizationRoute = () => (
    <LocalLocalization />
);

const RenderScene = SceneMap({
    first: PreviewRoute,
    second: galleryRoute,
    third: localizationRoute,
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
        { key: 'second', title: 'Galería' },
        { key: 'third', title: 'Ubicación' },
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



