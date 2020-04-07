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
import * as TaskManager from 'expo-task-manager';
import Settings from './screens/settings';
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
    onComponentMount() { }

    getHeader = () => {
        return <Header>placement='right'</Header>;
    };

    // Async stands for an asychronous function, the time it takes to complete is unknown at runtime
    async _loadResourcesAsync() {
        // We must always await a Promise as we do not know when it will be fulfilled or denied
        await Promise.all([
            Asset.loadAsync([require("./assets/hammrd.png")]),
            Font.loadAsync({
                "Suisse-Intl-Medium": require("./assets/fonts/Suisse-Intl-Medium.ttf")
            })
        ]);
    }

    handleLoadingError(error) {
        console.warn(error);
    }

    handleFinishLoading() {
        this.setState({ isLoadingComplete: true });
    }

    myStack() {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Main Menu">
                    <Stack.Screen style={{ flex: 1 }} name="Main Menu" component={MainMenu} />
                    <Stack.Screen name="GetHome" component={GetHome} />
                    <Stack.Screen name="Food" component={Food} />
                    <Stack.Screen name="Settings" component={Settings} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    async componentDidMount() {
        //if the location tracking task is still persistent.... remove it
        const isLocationTracking = await TaskManager.isTaskRegisteredAsync("trackLocation");
        if (isLocationTracking) {
            await TaskManager.unregisterAllTasksAsync(); 
        }
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
                    {this.myStack()}
                </React.Fragment>
            );
        }
    }
}
