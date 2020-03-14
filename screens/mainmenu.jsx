import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Image, TouchableOpacity, Dimensions } from 'react-native';
import styled from 'styled-components';
import { LinearGradient } from 'expo-linear-gradient';



class MainMenu extends Component {
    state = {

    };


    render() {
        const { navigation } = this.props;
        return (
            <View style={{flex: 1, alignItems: "center", paddingTop:20, flexDirection:"column"}}>
                <View style={{flex: 3, alignItems: "center"}}>
                    <Text style={{ color: '#000000', fontFamily: 'Suisse-Intl-Medium', fontSize: 50 }}>Hello!</Text>
                    <Text style={{ color: '#9ea3a3', fontFamily: 'Suisse-Intl-Medium', fontSize: 25 }}> You must be faded asffff</Text>
                    <Text style={{ color: '#9ea3a3', fontFamily: 'Suisse-Intl-Medium', fontSize: 25, marginBottom: 65 }}> to be using this app</Text>
                </View>
                <View style={{flex: 3, flexDirection:"column"}}>
                    <TouchableOpacity onPress={() => navigation.navigate("Food")} title="Food"
                        style={{ height: 125, width: (Dimensions.get("screen").width - 30), justifyContent: 'center', alignItems: 'center' }}>
                        <LinearGradient
                            colors={['#c471f5', '#fa71cd']}
                            style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                            <Text style={{ color: '#fff', fontSize: 40, fontFamily: 'Suisse-Intl-Medium' }}>FOOD</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 3}}>
                    <TouchableOpacity onPress={() => navigation.navigate("GetHome")} title="Home"
                        style={{ height: 125, width: (Dimensions.get("screen").width - 30), justifyContent: 'center', alignItems: 'center' }}>
                        <LinearGradient
                            colors={['#c471f5', '#fa71cd']}
                            style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                            <Text style={{ color: '#fff', fontSize: 40, fontFamily: 'Suisse-Intl-Medium' }}>HOME</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 2}}>
                    <TouchableOpacity
                            onPress={() => navigation.navigate("Settings")}
                            title="Settings">
                        <LinearGradient
                            colors={['#454545', '#757575']}
                            style={{ height: 60, width: (Dimensions.get("screen").width - 30), justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                            <Text style={{ color: '#fff', fontSize: 30, fontFamily: 'Suisse-Intl-Medium' }}>SETTINGS</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


export default MainMenu;
