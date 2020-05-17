import React, { Component } from 'react';
import { AppLoading, Notifications } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import MainMenu from './screens/mainmenu'
import GetHome from './screens/home';
import Food from './screens/food';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as TaskManager from 'expo-task-manager';
import Settings from './screens/settings';
import * as Sentry from 'sentry-expo';
import apikeys from './apikeys.json';

//load sentry error logging service (in production apk builds)
Sentry.init({
    dsn: apikeys.SENTRY_DSN, 
    enableInExpoDevelopment: true, 
    debug: true
});


const Stack = createStackNavigator();

//Stack Navigator for App Button Navigation
export default class App extends Component {
    state = {
        screen: "main",
        isLoadingComplete: false
    };

    // Async stands for an asychronous function, the time it takes to complete is unknown at runtime
    async loadResourcesAsync() {
        // We must always await a Promise as we do not know when it will be fulfilled or denied
        await Promise.all([
            Asset.loadAsync([require("./assets/hammrd.png")]),
            Font.loadAsync({
                "Suisse-Intl-Medium": require("./assets/fonts/Suisse-Intl-Medium.ttf")
            })
        ]);
    }

    async componentDidMount() {
        //remove any persisting tasks
        await TaskManager.unregisterAllTasksAsync(); 
        //clear all notifications persisting
        await Notifications.dismissAllNotificationsAsync(); 

    }

    render() {
        const { isLoadingComplete } = this.state;
        if (!isLoadingComplete) {
            return (
                <AppLoading
                    startAsync={this.loadResourcesAsync}
                    onFinish={() => this.setState({isLoadingComplete: true})}
                    onError={console.warn}
                />
            );
        } 
        else {
            return (
                <React.Fragment>
                    <NavigationContainer>
                        <Stack.Navigator initialRouteName="Main Menu">
                            <Stack.Screen style={{ flex: 1 }} name="Main Menu" component={MainMenu} />
                            <Stack.Screen name="GetHome" component={GetHome} />
                            <Stack.Screen name="Food" component={Food} />
                            <Stack.Screen name="Settings" component={Settings} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </React.Fragment>
            );
        }
    }
}
