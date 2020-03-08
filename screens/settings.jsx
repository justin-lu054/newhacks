import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Image, TouchableOpacity, Dimensions, TextInput, Keyboard, AsyncStorage} from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'; 
import styled from 'styled-components';
import { LinearGradient } from 'expo-linear-gradient';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column", 
        margin: 10,
        justifyContent: "center",
    }, 
    address: {
        borderWidth: 1,
        borderColor: "#CCCCCC",  
        padding: 15, 
        margin: 5
    }, 
    saveButton: {
        borderWidth: 1,
        borderColor: "#007BFF", 
        backgroundColor: "#007BFF", 
        padding: 15, 
        margin: 5
    }, 
    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 20, 
        textAlign: "center"
    }
});


class Settings extends Component {
    state = {
        address: "", 
        name: "", 
        contact: ""
    };

    onChangeText() {
        console.log("yo");
    }

    handleAddressChange = (text) => {
        this.setState({"address": text}); 
    }

    handleNameChange = (text) => {
        this.setState({"name": text});
    }

    handlePhoneChange = (text) => {
        this.setState({"contact": text}); 
    }

    saveData = () => {
        AsyncStorage.setItem("address", this.state.address).then(console.log("test")); 
        AsyncStorage.setItem("name", this.state.name).then(console.log("test2")); 
        AsyncStorage.setItem("contact", this.state.contact).then(console.log("test3")); 
    }

    onComponentMount() {
        console.log("mount")
        AsyncStorage.getAllKeys((keys) => {
            console.log(keys);
        }); 
    }

    render() {
        return (
           <View style={styles.container}>
                <Text>Emergency Contact Name</Text>
                <TextInput
                    style={styles.address}
                    placeholder="Contact Name"
                    maxLength={20}
                    onBlur={Keyboard.dismiss}
                    value={this.state.name}
                    onChangeText={this.handleNameChange}>
                </TextInput>

                <Text>Emergency Contact Number</Text>
                <TextInput
                    style={styles.address}
                    placeholder="Phone Number"
                    maxLength={20}
                    onBlur={Keyboard.dismiss}
                    value={this.state.contact}
                    onChangeText={this.handlePhoneChange}>
                </TextInput>

                <Text>Address</Text>
                <TextInput
                    style={styles.address}
                    placeholder="Address"
                    maxLength={20}
                    onBlur={Keyboard.dismiss}
                    value={this.state.address}
                    onChangeText={this.handleAddressChange}>
                </TextInput>
                <TouchableOpacity style={styles.saveButton}
                                onPress={this.saveData}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
           </View>
        );
    }
}

export default Settings;
