import React, { Component } from 'react';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import MainMenu from './screens/mainmenu'
import GetHome from './screens/home';
import Food from './screens/food';
import { StyleSheet, Image, Text, View } from "react-native";
import Header from "./header/Header";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Settings from './screens/settings'; 



function sendMessage(message, to) {
  const TWILIO_USER_SID = "ACe06cff5e6ae59a9e0311556e95a91ce4"
  const TWILIO_NUMBER_SID = "SK4479d9aec8b67ee4c4e8f515d1dcdf37"
  const TWILIO_API_KEY = "GKtLSZc47Rs8e3G9wXP8GbvdB7Z4Rzar"
  const TWILIO_API_URL = "https://api.twilio.com/2010-04-01"

  fetch(TWILIO_API_URL, {


  })

  fetch(`${TWILIO_API_URL}/Accounts/${TWILIO_USER_SID}/Messages.json`, {
        method: 'POST',
        body: `From=+12262402314To=${to}Body=${message}`,
        user: {TWILIO_NUMBER_SID: TWILIO_API_KEY},
    }).then((res) => alert(res))
    .catch((err) => alert(err)); 
}



const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

//Stack Navigator for App Button Navigation
export default class App extends Component {

  state = {
    screen: "main",
    isLoadingComplete: false
  };
  onComponentMount() {
  }

  getHeader = () => {
    return <Header>placement='right'</Header>;
  };

  // Async stands for an asychronous function, the time it takes to complete is unknown at runtime
  async _loadResourcesAsync() {
    // We must always await a Promise as we do not know when it will be fulfilled or denied
    await Promise.all([
      Asset.loadAsync([
        require('./assets/hammrd.png'),
      ]),
      Font.loadAsync({
        'Suisse-Intl-Medium': require('./assets/fonts/Suisse-Intl-Medium.ttf'),
      }),
    ]);
  }
  
  handleLoadingError(error) {
    console.warn(error);
  }

  handleFinishLoading() {
    this.setState({ isLoadingComplete: true })
  }

  myStack() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainMenu">
          <Stack.Screen style={{flex: 1}} name="MainMenu" component={MainMenu} />
          <Stack.Screen name="GetHome" component={GetHome} />
          <Stack.Screen name="Food" component={Food} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }



  render() {
    const { isLoadingComplete } = this.state;
    if (!isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onFinish={() => this.setState({ isLoadingComplete: true })}
          onError={console.warn}
        />
      ); 
    }
    else {
      return (
        <React.Fragment>
          <Settings></Settings>
        </React.Fragment>
      );
    }      
  }
}
