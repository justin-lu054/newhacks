<<<<<<< HEAD
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import MainMenu from "./screens/mainmenu";
import GetHome from "./screens/home";
import Food from "./screens/food";
import GetLocation from "react-native-get-location";
import Header from "./header/Header";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

async function send() {
  //DO THE THING HERE JUSTIN!!!!!
}

const Stack = createStackNavigator();
=======
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainMenu from './screens/mainmenu'
import GetHome from './screens/home';
import Food from './screens/food';


export default class App extends Component {

  state = {
    screen: "main"
  }
>>>>>>> 4a8862df799aae7c411f718aed1f36f7ddd85a7a

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

function getLocation() {
  //return new Promise((resolve,reject) => {
  GetLocation.getCurrentPosition({
    esnableHighAccuracy: true,
    timeout: 15000
  })
    .then(location => {
      console.log(location);
    })
    .catch(error => {
      console.log(error);
    });
  //})
}

//Stack Navigator for App Button Navigation
export default class App extends Component {
  onComponentMount() {
    getLocation();
  }

<<<<<<< HEAD
  getHeader = () => {
    return <Header>placement='right'</Header>;
  };

  myStack() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainMenu">
          <Stack.Screen name="MainMenu" component={MainMenu} />
          <Stack.Screen name="GetHome" component={GetHome} />
          <Stack.Screen name="Food" component={Food} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  render() {
    send();
    return (
      <React.Fragment>
        {this.getHeader()}
        {this.myStack()}
=======
  render() {
    return (
      <React.Fragment>

        <Food></Food>
>>>>>>> 4a8862df799aae7c411f718aed1f36f7ddd85a7a
      </React.Fragment>
    );
  }
}
<<<<<<< HEAD
=======

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
>>>>>>> 4a8862df799aae7c411f718aed1f36f7ddd85a7a
