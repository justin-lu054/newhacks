import React, { Component } from 'react';
import { Alert} from 'react-native';
import Polyline from '@mapbox/polyline';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import getDirections from 'react-native-google-maps-directions';
import apikeys from '../apikeys.json'; 
import MapPlot from '../resources/MapPlot'; 


class Food extends Component {
    state = {
        coordinates: [],
        userLocation: null,
        foodLocation: null,
        foodName: null
    }

    constructor() {
        super();
        this.mapDirections = this.mapDirections.bind(this);
        this.handleGetDirections = this.handleGetDirections.bind(this);
        this.getLocationAsync = this.getLocationAsync.bind(this);
    }

    handleGetDirections = () => {
        const data = {
            source: {
                latitude: this.state.userLocation.latitude,
                longitude: this.state.userLocation.longitude
            },
            destination: {
                latitude: this.state.foodLocation.latitude,
                longitude: this.state.foodLocation.longitude
            },
            params: [
                {
                    key: "travelmode",
                    value: "walking"
                },
                {
                    key: "dir_action",
                    value: "navigate"
                }
            ],
        }
        getDirections(data);
    }

    async mapDirections(startLoc, destinationLoc) {
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
            if (this.mounted) {
                this.setState({ coordinates: newCoords });
            }
            return coords;
        }
        catch (error) {
            Alert.alert("Error", error);
            return error;
        }
    }

    async getLocationAsync() {
        var location = await Location.getCurrentPositionAsync({});
        if (this.mounted) {
            this.setState({ userLocation: { "latitude": location.coords.latitude, "longitude": location.coords.longitude } });
        } 
    }

    getNearestRestaurant(latitude, longitude) {
        return new Promise((resolve, reject) => {
            fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?rankby=distance&key=${apikeys.GOOGLE_MAPS_API_KEY}&location=${latitude},${longitude}&type=restaurant&fields=name&keyword=fast%20food&opennow=true`)
                .then(res => res.json())
                .then(
                    json => {
                        var coordinates = {
                            "latitude": json.results[0].geometry.location.lat,
                            "longitude": json.results[0].geometry.location.lng,
                            "name": json.results[0].name
                        }
                        resolve(coordinates);
                    }
                );
        });
    }

    async componentDidMount() {
        this.mounted = true; 
        var { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== "granted") {
            Alert.alert("Error", "Permission to access location denied.");
            return; 
        }
        await this.getLocationAsync(); 
        //in case the state property is not set due to unmounting
        if (this.state.userLocation) {
            var userLocation = Object.values(this.state.userLocation).join(",");
            var coordinates = await this.getNearestRestaurant(this.state.userLocation.latitude, this.state.userLocation.longitude); 
            if (this.mounted) {
                this.setState({foodLocation: {latitude: coordinates.latitude, longitude: coordinates.longitude}, foodName: coordinates.name});
            } 
            var restaurantLocation = Object.values(coordinates).slice(0, 2).join(",");
            this.mapDirections(userLocation, restaurantLocation); 
        }
        
    }

    componentWillUnmount() {
        this.mounted = false; 
    }

    render() {
        const { userLocation, foodLocation, foodName, coordinates } = this.state;
        return (
            <MapPlot startLocation={userLocation}
                    endLocation={foodLocation}
                    directionCoordinates={coordinates}
                    buttonText="Take me to food!"
                    buttonFunction={this.handleGetDirections}
                    topButtonText={"The nearest food is at " + foodName}></MapPlot>
        );
    }
}

export default Food;
