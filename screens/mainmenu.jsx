import React, { Component } from "react";
import { View, StyleSheet, Button, TouchableOpacity, Text } from "react-native";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  buttonContainer: {
    margin: 20,
    paddingRight: 80,
    paddingLeft: 80,
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: "#636363",
    borderRadius: 20
  },

  headline: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },
  headingButton: {
    justifyContent: "flex-start",
    margin: "5%",
    color: "black"
  },
  footer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-end"
  }
});

class MainMenu extends Component {
  state = {};

  render() {
    const { navigation } = this.props;
    return (
      <Container>
        <Container>
          {/* <Image source={require('assets/hammrd.png')} /> */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Food")}
            title="Food"
            style={{
              marginBottom: 30,
              height: 200,
              width: 300,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <LinearGradient
              colors={["#c471f5", "#fa71cd"]}
              style={{
                height: "100%",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 40,
                  fontFamily: "Suisse-Intl-Medium"
                }}
              >
                FOOD
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("GetHome")}
            title="Home"
            style={{
              height: 200,
              width: 300,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <LinearGradient
              colors={["#c471f5", "#fa71cd"]}
              style={{
                height: "100%",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 40,
                  fontFamily: "Suisse-Intl-Medium"
                }}
              >
                HOME
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Container>
        <Container style={styles.footer}>
          <Button
            onPress={() => Alert.alert("null")}
            title="Settings"
            style={{ backgroundColor: "black" }}
          ></Button>
          <Button
            onPress={() => navigation.navigate("Settings")}
            title="Settings"
            style={{ backgroundColor: "black" }}
          ></Button>
          <Button
            onPress={() => Alert.alert("null")}
            title="Settings"
            style={{ backgroundColor: "black" }}
          ></Button>
        </Container>
      </Container>
    );
  }
}

const Container = styled.View`
  flex: 1;
  background-color: #fbfaff;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 30px;
  color: #000000;
`;
export default MainMenu;
