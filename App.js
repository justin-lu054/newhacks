import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainMenu from './screens/mainmenu'
import GetHome from './screens/home';
import Food from './screens/food';

export default class App extends Component {

  state = {
    screen: "main"
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

  render() {
    
    return (
      <React.Fragment>
        
        {this.getComponent()}
      </React.Fragment>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
