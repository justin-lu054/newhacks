import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, Dimensions } from 'react-native';
import MapView from 'react-native-maps'; 
import MapViewDirections from 'react-native-maps-directions'; 

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

const coordinates = [
    {
        latitude: 37.798790, 
        longitude: -122.442753
    }, 
    {
        latitude: 37.790651, 
        longitude: -122.422497
    }
];


class Food extends Component {
    state = {  }
    render() { 
        return (
            <View style={styles.container}>
                <MapView style={styles.mapStyle}>
                    <MapViewDirections origin={coordinates[0]}
                                        destination={coordinates[1]}
                                        apikey={"AIzaSyCp19sWPQVlG1V8m9cUB9gLGszUAwNXa4U"}
                                        strokeWidth={3}
                                        strokeColor="hotpink">
                    </MapViewDirections>
                </MapView>
            </View>
        );
    }
}
 
export default Food;