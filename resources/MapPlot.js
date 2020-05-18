import React from 'react';
import MapView from 'react-native-maps'; 
import {Dimensions, StyleSheet, View, ActivityIndicator, TouchableOpacity, Text} from 'react-native'; 

const MapPlot = (props) => {

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
        }, 
        loadingContainer: {
            flex: 1,
            justifyContent: "center"
        }, 
        loadingHorizontal: {
            flexDirection: "row", 
            justifyContent: "center"
        }
    });

    const {startLocation, 
        endLocation, 
        directionCoordinates, 
        buttonText, 
        buttonFunction, 
        topButtonText} = props; 
    
    //loading circle
    if (!(startLocation && endLocation)) {
        return(
            <View style={[styles.loadingContainer, styles.loadingHorizontal]}>
                <ActivityIndicator size="large"></ActivityIndicator>
            </View>
        )
    }

    return (
        <React.Fragment>
            <View style={styles.container}>
                <TouchableOpacity title="Home" onPress={buttonFunction}
                style={{ height: 100, width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 290, backgroundColor: '#454545', borderRadius: 30, opacity: 0.75 }}>
                    <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Suisse-Intl-Medium', marginLeft: 15, marginRight: 10}}>
                        {topButtonText}
                    </Text>
                </TouchableOpacity>
                <MapView style={styles.mapStyle}
                    region={{
                        latitude: startLocation.latitude, 
                        longitude: startLocation.longitude,
                        latitudeDelta: 0.01, 
                        longitudeDelta: 0.01 
                    }}>
                    <MapView.Marker coordinate={startLocation}></MapView.Marker>
                    <MapView.Marker coordinate={endLocation}></MapView.Marker>
                    {directionCoordinates.map((coords, index) => (
                        <MapView.Polyline key={index}
                            index={index}
                            coordinates={coords}
                            strokeWidth={2}
                            strokeColor="blue"/>
                    ))}
                </MapView>
                
            </View>
            <View>
                <TouchableOpacity title="test" style={styles.buttonStyle} onPress={buttonFunction} >
                    <Text style={{ color: '#fff', fontSize: 30, fontFamily: 'Suisse-Intl-Medium' }}>{buttonText}</Text>
                </TouchableOpacity>
            </View>
        </React.Fragment>
    );
}

export default MapPlot; 

