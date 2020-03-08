import * as fetch from 'node-fetch';
import * as SMS from 'expo-sms';
import * as  GetLocation from 'react-native-get-location'
import * as fs from 'react-native-fs'

function getRestaurant (latitude, longitude) {
    return new Promise((resolve, reject) => {
        fetch("https://maps.googleapis.com/maps/api/place/nearbysearch/json?rankby=distance&key=AIzaSyCp19sWPQVlG1V8m9cUB9gLGszUAwNXa4U&location=${latitude},${longitude}&type=restaurant&fields=name&keyword=fast%20food&opennow=true")
        .then(res => res.json())
        .then(
            json => {
                var output = {
                    "latitude": json.results[0].geometry.location.lat,
                    "longitude": json.results[0].geometry.location.lng
                }
                resolve(output)
            }
        ); 
    });
}

function encodeAddress (address) {
    return address.replace(' ', '%20')
}

function setHome (address) {
    return new Promise((resolve, reject) => {
        fetch("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&key=AIzaSyCp19sWPQVlG1V8m9cUB9gLGszUAwNXa4U&input=${encodeAddress(address)}&fields=geometry")
        .then(res => res.json())
        .then(
            json => {
                var newAddress = {
                    "latitude": json.results[0].geometry.location.lat,
                    "longitude": json.results[0].geometry.location.lng
                }
                fs.readFile("./Settings/settings.json", "ascii").then(res => {
                    var settings = JSON.parse(res)
                    settings.homeAddress.latitude = newAddress.latitude
                    settings.homeAddress.longitude = newAddress.longitude
                    fs.writeFile("./Settings/settings.json", JSON.stringify(settings), "ascii")
                })
            }
        )
    })
}