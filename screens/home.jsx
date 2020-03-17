import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, Dimensions, Icon, TouchableOpacity, AsyncStorage } from 'react-native';
import MapView from 'react-native-maps'; 
import Polyline from '@mapbox/polyline'; 
import * as Location from 'expo-location'; 
import * as Permissions from 'expo-permissions';
import getDirections from 'react-native-google-maps-directions'; 
import apikeys from '../apikeys.json'; 
import * as TaskManager from 'expo-task-manager'; 
import haversine from 'haversine';

const styles = StyleSheet.create({
  container: {
      flex: 2,
      justifyContent: "center",
      alignItems: "center"
  },

   
  buttonStyle: {
      height: 100, 
      width: '100%', 
      backgroundColor: '#c471f5',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.75,
      borderRadius: 30
  },

  mapStyle: {
      width: Dimensions.get("window").width, 
      height: Dimensions.get("window").height
  }
});

class GetHome extends Component {
    state = {
        coordinates: [], 
        userLocation : null, 
        homeLocation: null, 
        address: null
    };

    constructor() {
        super(); 
        this.mapDirections = this.mapDirections.bind(this); 
        this.handleGetDirections = this.handleGetDirections.bind(this); 
        this.getLocationAsync = this.getLocationAsync.bind(this); 
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    handleGetDirections = () => {
        const data = {
            source: {
                latitude: this.state.userLocation.latitude, 
                longitude: this.state.userLocation.longitude
            },
            destination: {
                latitude: this.state.homeLocation.latitude, 
                longitude: this.state.homeLocation.longitude
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

    mapDirections = async (startLoc, destinationLoc) => {
        try {
            let resp = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&mode=walking&key=${apikeys.GOOGLE_MAPS_API_KEY}`
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
        this.setState({userLocation: {"latitude": location.coords.latitude, "longitude": location.coords.longitude}}); 
    }
    
    getHomeCoords = async (address) => {
        return new Promise((resolve, reject) => {
            fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&key=${apikeys.GOOGLE_MAPS_API_KEY}&input=${encodeURI(address)}&fields=geometry`)
            .then(res => res.json())
            .then(json => {
                var coordinates = {"latitude": json.candidates[0].geometry.location.lat, "longitude": json.candidates[0].geometry.location.lng}
                resolve(coordinates); 
            })
        })
    }
    

    async componentDidMount() {
        await this.getLocationAsync(); 
        const address = await AsyncStorage.getItem("address"); 
        const homeCoords = await this.getHomeCoords(address); 

        //begin location tracking every 100 seconds
        await Location.startLocationUpdatesAsync("firstTask", {
            accuracy: Location.Accuracy.BestForNavigation, 
            timeInterval: 1
        });

        this.setState({address: address}, () => {
            this.setState({homeLocation: homeCoords}, () => {
                const userLocationString = Object.values(this.state.userLocation).join(","); 
                var homeLocationString = Object.values(this.state.homeLocation).join(","); 
                this.mapDirections(userLocationString, homeLocationString); 
            });
        });
    }

    render() {
        const {userLocation, homeLocation} = this.state; 
        return (
            <React.Fragment>
                <View style={styles.container}>
                    <MapView style={styles.mapStyle}
                            region={{
                                latitude: userLocation!=null ? userLocation.latitude : 37.78825,
                                longitude: userLocation!=null ? userLocation.longitude : -122.4234,
                                latitudeDelta: 0.01, 
                                longitudeDelta: 0.01
                            }}>
                        {(userLocation) && (
                            <MapView.Marker coordinate={userLocation}>
                            </MapView.Marker>
                        )}
                        {(homeLocation) && (
                            <MapView.Marker coordinate={homeLocation}>
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
                {userLocation && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity title="test" style={styles.buttonStyle} onPress={this.handleGetDirections} >
                            <Text style={{ color: '#fff', fontSize: 30, fontFamily: 'Suisse-Intl-Medium' }}>take me to home</Text>
                        </TouchableOpacity>
                    </View>
                )}     
            </React.Fragment>);
    }
}

var distanceTravelled = 0; 
var counter = 0; 
var locationHistory = []; 
TaskManager.defineTask("firstTask", ({data, error}) => {
    if (error) {
        console.log("error", error); 
        return; 
    }
    if (data) {
        const {locations} = data; 
        counter++; 
        console.log("counter", counter); 
        
        locationHistory.push([locations[0].coords.latitude, locations[0].coords.longitude]); 
        if (locationHistory.length > 1) {
            distanceTravelled += haversine(locationHistory[locationHistory.length - 1], locationHistory[locationHistory.length - 2], {
                format: "[lat,lon]"
            });
            locationHistory.shift(); 
        }
        console.log(distanceTravelled);
    }
})


export default GetHome;
