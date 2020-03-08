import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, Dimensions } from 'react-native';
import MapView from 'react-native-maps'; 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonContainer: {
        margin: 20
    }, 
    mapStyle: {
        width: Dimensions.get("window").width, 
        height: Dimensions.get("window").height
    }
});


class Food extends Component {
    state = {  }
    render() { 
        return (
            <View style={styles.container}>
                <MapView style={styles.mapStyle}></MapView>
            </View>
        );
    }
}
 
export default Food;