import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Image } from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/FontAwesome';



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },

    buttonContainer: {
        margin: 20,
        backgroundColor: "#000000"
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
        return (
          <Container>


            <View style={styles.container}>
            <Text style={styles.headline}>Hello </Text>


                <View style={styles.buttonContainer.button}>
                    <Button title="Food" onPress={this.props.showFood} />

                </View>

                <View style={styles.buttonContainer}>
                    <Button style={styles.button} title="Home" onPress={this.props.showHome} />
                </View>
            </View>
            </Container>
        );
    }
}

const Container = styled.View`
    flex: 1;
    background-color: #303030;
    justify-content: center;
    align-items: center;
`;


const Title = styled.Text`
    font-size: 30px;
    color: #ffffff;
`;

export default MainMenu;
