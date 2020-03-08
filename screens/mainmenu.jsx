import React, { Component } from "react";
import { View, StyleSheet, Button } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  buttonContainer: {
    margin: 20
  }
});

class MainMenu extends Component {
  state = {};

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button title="Food" onPress={() => navigation.navigate("Food")} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Home" onPress={() => navigation.navigate("GetHome")} />
        </View>
      </View>
    );
  }
}

export default MainMenu;
