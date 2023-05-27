import React from "react";
import { View, Text, TextInput, StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
//RegisterLocal
import RegistroLocal from "./RegisterLocal";
//Screens
import LoginScreen from "../utils/LoginScreen";
import TabViewBusiness from "./TabViewBusiness";
//Screens User
import HomeScreen from "../utils/HomeScreen";
import TabViewLocal from "../screensUser/TabViewLocal";
import UserConfig from "../utils/UserConfig";
import PantallaPrueba from "../screensUser/PantallaPrueba";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MyStackLogin() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="JoinBusiness"
        component={RegistroLocal}
      />
      <Stack.Screen
        name="MainLocal"
        component={TabViewBusiness}
      />
      <Stack.Screen
        name="MainUser"
        component={MyTabsUser}
        options={{ tabBarStyle: { display: "none" } }}
      />
    </Stack.Navigator>
  );
}
function MyTabsUser() {
  return (
    <Tab.Navigator
      initialRouteName="MainPage"
      screenOptions={{
        tabBarActiveTintColor: "#9E758D",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "white",
          borderTopWidth: 0,

          bottom: 20,
          left: 16,
          right: 16,
          elevation: 8,
          borderRadius: 8,
          height: 48,
        },
      }}
    >
      <Tab.Screen
        name="MainPage"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={25} color={color} />
          ),
          headerLeft: null,
        }}
      />
      <Tab.Screen
      name="Local"
      component={TabViewLocal}
      options={{ tabBarButton: () => null, tabBarStyle: { display: "none" } }}
      />
      <Tab.Screen
        name="userConfig"
        component={UserConfig}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={25} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const [listener, setListener] = React.useState(0);
  const [sesion, setSesio] = React.useState("");

  const getUid = async () => {
    try {
      const dataUid = await AsyncStorage.getItem("@uid");
      const dataUser = await AsyncStorage.getItem("@user");
      const dataPartner = await AsyncStorage.getItem("@partner");
      setSesio({ uid: dataUid, user: dataUser, partner: dataPartner });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUid();
    console.log("buscando usuario");
    const interval = setInterval(() => {
      setListener(listener + 1);
    }, 2000);
    return () => clearImmediate(interval);
  }, [listener]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {!sesion.uid ? <MyStackLogin /> : null}
        {sesion.user ? <MyTabsUser /> : null}
        {sesion.partner ? <TabViewBusiness /> : null}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
