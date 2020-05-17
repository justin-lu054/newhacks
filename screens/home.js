import React, { Component } from 'react';
import { AsyncStorage, Platform, Alert } from 'react-native';
import Polyline from '@mapbox/polyline'; 
import * as Location from 'expo-location'; 
import * as Permissions from 'expo-permissions';
import getDirections from 'react-native-google-maps-directions'; 
import apikeys from '../apikeys.json'; 
import * as TaskManager from 'expo-task-manager'; 
import haversine from 'haversine';
import { Notifications } from 'expo';
import LocationTaskTrackers from '../resources/LocationTaskTracker'; 
import MapPlot from '../resources/MapPlot'; 

//global instance of trackers
var locationTaskTrackers = new LocationTaskTrackers(); 

async function getHomeCoords(address){
    var result = await Location.geocodeAsync(address); 
    //console.log(result);  
    if (result.length === 0) {
        const err = new Error("Invalid home address entered.");
        return Promise.reject(err); 
    }
    return {"latitude": result[0].latitude, "longitude": result[0].longitude}; 
}

async function watchMovement(newLocation) {
    //in case the user remounts the application before the first run of the task is successfully run
    if (!locationTaskTrackers) {
        return; 
    }
    const currentTime = new Date(); 
    locationTaskTrackers.addLocationHistory([newLocation[0].coords.latitude, newLocation[0].coords.longitude]); 
    locationTaskTrackers.addTimeHistory(currentTime.getTime()); 

    console.log("Time of execution: " + currentTime.getHours().toString() + " " + currentTime.getMinutes().toString()); 
    console.log("counter", locationTaskTrackers.counter); 

    //avoid destructuring due to modification of class properties
    if (locationTaskTrackers.locationHistory.length > 1) {
        var newDistance = haversine(locationTaskTrackers.locationHistory[locationTaskTrackers.locationHistory.length - 1], 
            locationTaskTrackers.locationHistory[locationTaskTrackers.locationHistory.length - 2], 
            {
            format: "[lat,lon]"
            }
        );

        var elapsedTime = locationTaskTrackers.timeHistory[locationTaskTrackers.timeHistory.length - 1] - locationTaskTrackers.timeHistory[locationTaskTrackers.timeHistory.length - 2]; 

        locationTaskTrackers.addDistanceTravelled(newDistance); 
        locationTaskTrackers.popLocationHistory(); 

        locationTaskTrackers.addTimeElapsed(elapsedTime); 
        locationTaskTrackers.popTimeHistory(); 

        const addressCoordsObj = locationTaskTrackers.addresscoords; 
        const addressCoords = [addressCoordsObj.latitude, addressCoordsObj.longitude]; 
        var distanceFromHome = haversine(locationTaskTrackers.locationHistory[locationTaskTrackers.locationHistory.length - 1], addressCoords, {
            format: "[lat,lon]"
        });
        if (distanceFromHome < 0.2) {
            const safeNotification = {
                title: "Welcome home!",
                body: "Glad to see that you got home safe. We will stop tracking your location",
                ios: {
                    sound: true
                }, 
                android: {
                    channelId: "notifications"
                }
            }
            //kill the task and reset counters
            await Notifications.presentLocalNotificationAsync(safeNotification);
            await Location.stopLocationUpdatesAsync("trackLocation"); 
            locationTaskTrackers.resetTrackers(); 
        } 
    }
    //~10 minutes without significant movement (note there are inaccuracies of ~1 minute due to backgroundfetch limitations)
    //careful dereferencing as the value may not be updated...
    if (locationTaskTrackers.timeElapsed > (10 * 60 * 1000) && locationTaskTrackers.distanceTravelled < 0.1 && !locationTaskTrackers.warningShowed) {
        console.log("Inactivity detected"); 
        const warnNotification = {
            title: "Are you alright?", 
            body: "We have not detected movement in a while. We will reach out to your emergency contact soon.", 
            ios: {
                sound: true
            },
            android: {
                channelId: "notifications"
            }
        }
        await Notifications.presentLocalNotificationAsync(warnNotification);
        locationTaskTrackers.setWarningShowed(); 
    }
    //~25 minutes without significant movement
    if (locationTaskTrackers.timeElapsed > (25 * 60 * 1000)) {
        if (locationTaskTrackers.distanceTravelled < 0.1) {
            console.log("Sending text message...."); 
            const alertNotification = {
                title: "Don't Worry", 
                body: "We are reaching out to your emergency contact with your location right now", 
                ios: {
                    sound: true
                },
                android: {
                    channelId: "notifications"
                }
            }
            await Notifications.presentLocalNotificationAsync(alertNotification);
            const contact = await AsyncStorage.getItem("contact"); 
            const yourcontact = await AsyncStorage.getItem("yourcontact"); 
            const yourname = await AsyncStorage.getItem("yourname"); 
            const name = await AsyncStorage.getItem("name"); 
            sendSMS(contact, yourcontact, yourname, name);
        }
        //reset counters
        locationTaskTrackers.resetTrackers(); 
    }
    console.log(locationTaskTrackers.distanceTravelled);
    console.log(locationTaskTrackers.timeElapsed); 
    locationTaskTrackers.incrementCounter(); 
}

async function sendSMS(contact, yourcontact, yourname, name) {
    const {locationHistory} = locationTaskTrackers; 
    const options = {
        method : "POST",
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
            content: `Hi ${name}, ${yourname} has been outside and motionless for over 20 minutes\
                    at ${locationHistory[locationHistory.length - 1]}. You can contact them at ${yourcontact}`, 
            to: contact
        })
    };
    fetch("https://hammrdtwilioservice.herokuapp.com/text", options)
    .then(() => {
        console.log("Message sent."); 
    })
    .catch(err => console.log(err)); 
}

//change this to check every 15 minutes -> this will allow for background execution

//foreground/background task to track user distance travelled
TaskManager.defineTask("trackLocation", async ({data, error}) => {
    if (error) {
        console.log("error", error); 
        return; 
    }
    if (data) {
        const {locations} = data; 
        watchMovement(locations); 
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
        this.navigateHome = this.navigateHome.bind(this); 
        this.getLocationAsync = this.getLocationAsync.bind(this); 
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    beginLocationTracking = async() => {
        const {navigation} = this.props; 
        const alreadyTracking = await TaskManager.isTaskRegisteredAsync("trackLocation"); 
        if(!alreadyTracking) {
            //begin location tracking every minute
            console.log("Beginning tracking..."); 
            await Location.startLocationUpdatesAsync("trackLocation", {
                accuracy: Location.Accuracy.BestForNavigation, 
                timeInterval: 15 * 60 * 1000, 
                foregroundService: {
                    notificationTitle: "Tracking your location",
                    notificationBody: "We're doing this to keep you safe!", 
                }
            });
            //create a sticky notification category for killing location tracking services
            await Notifications.createCategoryAsync("stopTracking", 
                                                    [{actionId: "stopTracking", 
                                                    buttonTitle: "Stop Tracking"}]);
            const trackNotification = {
                title: "Cancel location tracking",
                body: "To cancel location tracking at any time, simply hit the stop button below!",
                categoryId: "stopTracking",
                data: {"actionId": "stopTracking"}, 
                ios: {
                    sound: true
                }, 
                android: {
                    sticky: true
                }
            }
            await Notifications.presentLocalNotificationAsync(trackNotification); 
            const stopTrackingListener = Notifications.addListener(async(data) => {
                const alreadyTracking = await TaskManager.isTaskRegisteredAsync("trackLocation"); 
                if ((data.data.actionId === "stopTracking" && data.origin === "selected") && alreadyTracking) {
                    await Location.stopLocationUpdatesAsync("trackLocation");
                    await Notifications.deleteCategoryAsync("stopTracking"); 
                    //clear all notifications
                    await Notifications.dismissAllNotificationsAsync(); 
                    locationTaskTrackers.resetTrackers(); 
                    Alert.alert("Stopped location tracking.", "We've stopped location tracking services for you."); 
                    navigation.navigate("Main Menu"); 
                    //prevent duplicate listeners
                    stopTrackingListener.remove(); 
                }
            }); 
        }
    }

    navigateHome = async() => {
        this.beginLocationTracking(); 
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

        var resp = await fetch(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&mode=walking&key=${apikeys.GOOGLE_MAPS_API_KEY}`
        );
        var respJson = await resp.json();
        //there will be no coordinates in the route array if there is no existing route...
        if (respJson.routes.length === 0) {
            const err = new Error("No walking route found to this location!");
            return Promise.reject(err); 
        }
        var points = Polyline.decode(respJson.routes[0].overview_polyline.points);
        var coords = points.map((point, index) => {
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

    getLocationAsync = async () => {
        var location = await Location.getCurrentPositionAsync({}); 
        if (this.mounted) {
            this.setState({userLocation: {"latitude": location.coords.latitude, "longitude": location.coords.longitude}}); 
        }
    }
    
    async componentDidMount() {
        this.mounted = true;
        //get permissions
        const { navigation } = this.props; 
        var { status } = await Permissions.askAsync(Permissions.LOCATION); 
        if (status !== "granted") {
            Alert.alert("Error", "Permission to access location denied. This function will not work."); 
            navigation.goBack(); 
            return; 
        }
        var { status } = await Permissions.askAsync(
            Permissions.NOTIFICATIONS
        ); 
        if (status !== "granted") {
            Alert.alert("Error", "Permission for notifications denied. This function will not work."); 
            navigation.goBack(); 
            return; 
        }

        const address = await AsyncStorage.getItem("address"); 
        const name = await AsyncStorage.getItem("name");
        const yourname = await AsyncStorage.getItem("yourname"); 
        const contact = await AsyncStorage.getItem("contact"); 
        const yourcontact = await AsyncStorage.getItem("yourcontact"); 

        //ensure that settings rae filled out1 
        if (!(address && name && yourname && contact && yourcontact)) {
            Alert.alert("Error", "Please fill out all the fields in settings first!"); 
            navigation.goBack(); 
            return; 
        }

        //create local notification channel if android
        if (Platform.OS === "android") {
            await Notifications.createChannelAndroidAsync("notifications", {
                name: "Notifications", 
                sound: true, 
                priority: "high",
                vibrate: [0, 500] 
            });
        }
        
        try {
            await this.getLocationAsync(); 
            var homeCoords = await getHomeCoords(address); 
            //update location task trackers
            locationTaskTrackers.setAddressCoords(homeCoords); 

            //in case the state property was not set due to unmounting
            if (this.state.userLocation) {
                const userLocationString = Object.values(this.state.userLocation); 
                const homeLocationString = Object.values(homeCoords); 

                await this.mapDirections(userLocationString, homeLocationString);

                if (this.mounted) {
                    this.setState({address: address}); 
                    this.setState({homeLocation: homeCoords}); 
                }
            }    
        }   
        catch (error) {
            Alert.alert("Error", error.message); 
            navigation.goBack(); 
            return;
        }
    }

    componentWillUnmount() {
        this.mounted = false; 
    }

    render() {
        const {userLocation, homeLocation, coordinates} = this.state; 
        return(
            <MapPlot startLocation={userLocation}
                    endLocation={homeLocation}
                    directionCoordinates={coordinates}
                    buttonText="Take me home!"
                    buttonFunction={this.navigateHome}>
            </MapPlot>
        );
    }
}

export default GetHome;
