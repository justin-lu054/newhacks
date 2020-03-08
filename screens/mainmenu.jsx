import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Image, TouchableOpacity, Dimensions } from 'react-native';
import styled from 'styled-components';
import { LinearGradient } from 'expo-linear-gradient';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column", 
        margin: 10,
        justifyContent: "center",
    },

    buttonContainer: {
        margin: 20,
        paddingRight: 80,
        paddingLeft: 80,
        paddingTop: 30,
        paddingBottom: 30,
        backgroundColor: "#636363",
        borderRadius: 20,
    },

    headline: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: "center",
    },

   
});

class MainMenu extends Component {
    state = {

    };


    render() {
        const { navigation } = this.props;
        return (
            <Container>
                <Text style={{ color: '#000000', fontFamily: 'Suisse-Intl-Medium', fontSize: 50}}>Hello!</Text>
                <Text style={{ color: '#9ea3a3', fontFamily: 'Suisse-Intl-Medium', fontSize: 25}}> You must be faded asffff</Text>
                <Text style={{ color: '#9ea3a3', fontFamily: 'Suisse-Intl-Medium', fontSize: 25, marginBottom: 100}}> to be using this app</Text>
               
                <TouchableOpacity onPress={() => navigation.navigate("Food")} title ="Food"
                    style={{ marginBottom: 30, height: 200, width: 300, justifyContent: 'center', alignItems: 'center' }}>
                    <LinearGradient
                        colors={['#c471f5', '#fa71cd']}
                        style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                            <Text style={{ color: '#fff', fontSize: 40, fontFamily: 'Suisse-Intl-Medium' }}>FOOD</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("GetHome")} title="Home"
                    style={{ height: 200, width: 300, justifyContent: 'center', alignItems: 'center' }}>
                    <LinearGradient
                        colors={['#c471f5', '#fa71cd']}
                        style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                            <Text style={{ color: '#fff', fontSize: 40, fontFamily: 'Suisse-Intl-Medium'}}>HOME</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Container>
        );
    }
}

const Container = styled.View`
    flex: 1;
    background-color: #fbfaff;
    justify-content: center;
    align-items: center;
`;


const Title = styled.Text`
    font-size: 30px;
    color: #000000;

`;



export default MainMenu;
