import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import MainMenu from './screens/mainmenu'
import GetHome from './screens/home';
import Food from './screens/food';
import GetLocation from 'react-native-get-location'


function getLocation () {
  //return new Promise((resolve,reject) => {
      GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
      })
      .then(location => {
          console.log(location);
      })
      .catch(error => {
          console.log(error);
      })
  //})
}

export default class App extends Component {
  state = {
    screen: "main",
    isLoadingComplete: false
  }

  showFood = () => {
    this.setState({screen: "food"});
  }

  showHome = () => {
    this.setState({screen: "home"}); 
  }

  getComponent = () => {
    var component; 
    if (this.state.screen === "main") {
      component = <MainMenu showFood={this.showFood} showHome={this.showHome}></MainMenu>;
    }
    else if (this.state.screen === "food") {
      component = <Food></Food>;
    }
    else if (this.state.screen === "home") {
      component = <GetHome></GetHome>
    }
    return component; 
  }

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

  componentDidMount(){ 
    getLocation()
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

    return (
      <>
        {this.getComponent()}
      </>
      
    );
  }
}
