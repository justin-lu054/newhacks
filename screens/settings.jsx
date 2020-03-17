import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, TextInput, Keyboard, AsyncStorage, KeyboardAvoidingView, TouchableHighlight, ScrollView, FlatList, ListRenderItem} from 'react-native';
import apikeys from '../apikeys.json';
import _ from "lodash";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column", 
        margin: 10,
        marginBottom:10,
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
    },
    locationSuggestion: {
        backgroundColor: "white", 
        padding: 8,
        width: "100%",
        borderWidth: 0.5, 
        fontSize: 20
    }
});


class Settings extends Component {
    state = {
        yourname: "",
        yourcontact: "",
        address: "", 
        name: "", 
        contact: "",
        locationSuggestions: []
    };

    constructor(props) {
        super(props); 
        this.onChangeAddressDebounced = _.debounce(this.onChangeAddress, 1000); 
    }

    handleChange = (key, text) => {
        this.setState({[key]: text}); 
    }
    
    saveData = async () => {
        const {address, name, contact, yourname, yourcontact} = this.state;
        if (!(address && name && contact && yourname && yourcontact)) {
            alert("Please fill in all fields");
            return; 
        }
        if (address.trim === "" || name.trim === "" || contact.trim === "" || yourname.trim === "" || yourcontact.trim === "") {
            alert("Please fill in all fields"); 
            return; 
        }
        await AsyncStorage.setItem("yourname", yourname); 
        await AsyncStorage.setItem("yourcontact", yourcontact); 
        await AsyncStorage.setItem("address", address); //.then(console.log("test")); 
        await AsyncStorage.setItem("name", name); //.then(console.log("test2")); 
        await AsyncStorage.setItem("contact", contact); //.then(console.log("test3")).then(alert("Information saved!")); 
        alert("Information saved!"); 
    }

    componentDidMount = async () => {
        address = await AsyncStorage.getItem("address");
        name = await AsyncStorage.getItem("name"); 
        contact = await AsyncStorage.getItem("contact"); 
        yourname = await AsyncStorage.getItem("yourname"); 
        yourcontact = await AsyncStorage.getItem("yourcontact"); 
        this.setState({"address": address, "name": name, "contact": contact, "yourname": yourname, "yourcontact": yourcontact}); 
    }

    onChangeAddress = async (address) => {
        //this.setState({address: address}); 
        const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apikeys.GOOGLE_MAPS_API_KEY}&input={${address}}`;
        const result = await fetch(apiUrl); 
        const json = await result.json(); 
        this.setState({locationSuggestions: json.predictions}); 
    }

    

    render() {

        const locationSuggestions = this.state.locationSuggestions.map(
            prediction => (
                <TouchableHighlight key={prediction.id}
                                    onPress = {() => this.setState({address: prediction.description, locationSuggestions: []})}>
                    <Text style={styles.locationSuggestion}>
                        {prediction.description}
                    </Text>
                </TouchableHighlight>
            )
        );
        
        return (
           <KeyboardAvoidingView style={styles.container} behavior="padding">
                <ScrollView>
                    <View>
                        <Text>Your Name</Text>
                        <TextInput 
                            style={styles.address}
                            placeholder="Your Name"
                            maxLength={30}
                            value={this.state.yourname}
                            onChangeText={(text) => {
                                this.handleChange("yourname", text);
                            }}>
                        </TextInput>
                        <Text>Your Number</Text>
                        <TextInput
                            style={styles.address}
                            placeholder="Your Number"
                            maxLength={30}
                            value={this.state.yourcontact}
                            onChangeText = {(text) => {
                                this.handleChange("yourcontact", text); 
                            }}>
                        </TextInput>
                        <Text>Emergency Contact Name</Text>
                        <TextInput
                            style={styles.address}
                            placeholder="Contact Name"
                            maxLength={30}
                            value={this.state.name}
                            onChangeText={(text) =>  {
                                this.handleChange("name", text); 
                            }}>
                        </TextInput>
                        <Text>Emergency Contact Number</Text>
                        <TextInput
                            style={styles.address}
                            placeholder="Phone Number"
                            maxLength={20}
                            value={this.state.contact}
                            onChangeText={(text) => this.handleChange("contact", text)}>
                        </TextInput>

                        <Text>Address</Text>
                        <TextInput
                            style={styles.address}
                            placeholder="Address"
                            maxLength={100}
                            value={this.state.address}
                            onChangeText={(address) => {
                                this.setState({address: address});
                                this.onChangeAddressDebounced(address); 
                            }}>
                        </TextInput>
                        {locationSuggestions}
                        <TouchableOpacity style={styles.saveButton}
                                        onPress={this.saveData}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
           </KeyboardAvoidingView>
        );
    }
}

export default Settings;
