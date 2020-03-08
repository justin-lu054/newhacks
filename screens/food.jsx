import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, Dimensions, Icon, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import MapView from 'react-native-maps'; 
import Polyline from '@mapbox/polyline'; 
import * as Location from 'expo-location'; 
import * as Permissions from 'expo-permissions';
import getDirections from 'react-native-google-maps-directions'; 

const styles = StyleSheet.create({
    container: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center"
    },

    buttonContainer: {
        flex: 1, 
        
    }, 
    buttonStyle: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10
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
    state = {
        coordinates: [], 
        location: null, 
    }

    constructor() {
        super(); 
        this.getDirections = this.getDirections.bind(this); 
        this.handleGetDirections = this.handleGetDirections.bind(this); 
        this.getLocationAsync = this.getLocationAsync.bind(this); 
    }

    handleGetDirections = () => {
        const data = {
            source: {
                latitude: this.state.coordinates.latitude, 
                longitude: this.state.coordinates.longitude
            },
            destination: {
                latitude: 40.7359, 
                longitude: -73.9911
            }, 
            params: [
                {
                    key:"travelmode",
                    value:"walking"
                },
                {
                    key:"dir_action",
                    value:"navigate"
                }
            ],
        }
        getDirections(data); 
    }


    async getDirections(startLoc, destinationLoc) {
        try {
            let resp = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&mode=walking&key=AIzaSyCp19sWPQVlG1V8m9cUB9gLGszUAwNXa4U`
            );
            let respJson = await resp.json(); 
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points); 
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0], 
                    longitude: point[1]
                };
            }); 
            const newCoords = [...this.state.coordinates, coords]; 
            this.setState({coordinates: newCoords}); 
            return coords; 
        }
        catch (error) {
            alert(error); 
            return error; 
        }
    }

    
    async getLocationAsync() {
        var { status } = await Permissions.askAsync(Permissions.LOCATION); 
        if (status !== "granted") {
            alert("Permission to access location denied."); 
        }
        var location = await Location.getCurrentPositionAsync({}); 
        this.setState({location: {"latitude": location.coords.latitude, "longitude": location.coords.longitude}}); 
    }
    

    /*
    getLocationAsync() {
        return new Promise((resolve, reject) => {
            Permissions.askAsync(Permissions.LOCATION).then((status) => {
                console.log(status); 
                if (status !== "granted") {
                    alert("Permission to access location denied."); 
                }
                Location.getCurrentPositionAsync({}).then((location) => {
                    resolve(location);
                }); 
            });
        });
    }
    */
    componentDidMount() {
        this.getLocationAsync().then(() => {    
                                                var string1 = Object.values(this.state.location).join(","); 
                                                this.getDirections(string1, "40.7359, -73.9911")}); 
        /*
        this.getLocationAsync().then((location) => this.setState({
            location: {
                "latitude": location.coords.latitude,
                "longitude": location.coords.longitude
            }
        })); 
        */

    }

    render() { 
        console.log(this.state.location);
        return (
            <React.Fragment>
                <View style={styles.container}>
                    <MapView style={styles.mapStyle}>
                        {this.state.location && (
                            <MapView.Marker coordinate={this.state.location}>
                            </MapView.Marker>
                        )}
                        {this.state.coordinates.map((coords, index) => (
                            <MapView.Polyline key={index}
                                            index={index}
                                            coordinates={coords}
                                            strokeWidth={2}
                                            strokeColor="blue"></MapView.Polyline>
                        ))}
                    </MapView>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity title="test" style={styles.buttonStyle} onPress={this.handleGetDirections}></TouchableOpacity>
                </View>
            </React.Fragment>
        );
    }
}
 
export default Food;

/*
<MapViewDirections origin={coordinates[0]}
                                        destination={coordinates[1]}
                                        apikey={"AIzaSyCp19sWPQVlG1V8m9cUB9gLGszUAwNXa4U"}
                                        strokeWidth={3}
                                        strokeColor="hotpink">
                    </MapViewDirections>
*/