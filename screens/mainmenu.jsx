import React, { Component } from 'react';
import { View, StyleSheet, Button } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    buttonContainer: {
        margin: 20
    }
});


class MainMenu extends Component {
    state = {
        
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <Button title="Food" onPress={this.props.showFood} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Home" onPress={this.props.showHome} />
                </View>
            </View>
        );
    }
}


export default MainMenu;
