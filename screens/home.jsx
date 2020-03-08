import React, { Component } from "react";
import { View, StyleSheet, Button, Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonContainer: {
    margin: 20
  }
});

class GetHome extends Component {
  state = {};
  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to the home screen!</Text>
      </View>
    );
  }
}

export default GetHome;
