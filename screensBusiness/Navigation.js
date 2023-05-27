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
//import JoinBusiness from "./JoinBusiness";
import LoginScreen from "../utils/LoginScreen";
//import JoinBusiness2 from "./JoinBusiness2";
//import JoinBusiness3 from "./JoinBusiness3";
//import JoinPickImage from "./JoinPickImage";
import LoadImage from "./LoadImage";
import LoadProduct from "./LoadProduct";
import MainPageBusiness from "./MainPageBusiness";
import TabViewBusiness from "./TabViewBusiness";
//Screens User
import HomeScreen from "../utils/HomeScreen";
import TabViewLocal from "../screensUser/TabViewLocal";
import UserConfig from "../utils/UserConfig";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MyStackLogin() {
  return (
    <Stack.Navigator
      //screenListeners={{ focus: (altura = 0) }}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        //options={{ tabBarStyle: { display: "none" } }}
      />
      <Stack.Screen
        name="JoinBusiness"
        component={RegistroLocal}
        //options={{ tabBarStyle: { display: "none" } }}
      />
      <Stack.Screen
        name="MainLocal"
        component={TabViewBusiness}
        //options={{ tabBarStyle: { display: "none" } }}
      />
      <Stack.Screen
        name="MainUser"
        component={MyTabsUser}
        options={{ tabBarStyle: { display: "none" } }}
      />
    </Stack.Navigator>
  );
}

/*function MyStackBusiness() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Join" component={JoinBusiness} />
      <Stack.Screen name="Join2" component={JoinBusiness2} />
      <Stack.Screen name="Join3" component={JoinPickImage} />
      <Stack.Screen name="Join4" children={JoinBusiness3} />
      <Stack.Screen name="Main" component={TabViewBusiness} />
    </Stack.Navigator>
  );
}*/
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
  const [uid, setUid] = React.useState("");
  const [user, setUser] = React.useState("");
  const [partner, setPartner] = React.useState("");
  const [listener, setListener] = React.useState(0);
  const [sesion, setSesio] = React.useState("");

  const getUid = async () => {
    try {
      const dataUid = await AsyncStorage.getItem("@uid");
      const dataUser = await AsyncStorage.getItem("@user");
      const dataPartner = await AsyncStorage.getItem("@partner");
      //setUser(dataUser);
      //setPartner(dataPartner);
      //setUid(dataUid);
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
