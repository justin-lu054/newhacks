import * as fetch from 'node-fetch';
import * as SMS from 'expo-sms';
import * as  GetLocation from 'react-native-get-location'

function getRestaurant (latitude, longitude) {
    return new Promise((resolve, reject) => {
        fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?rankby=distance&key=AIzaSyCp19sWPQVlG1V8m9cUB9gLGszUAwNXa4U&location=${latitude},${longitude}&type=restaurant&fields=name&keyword=fast%20food&opennow=true`)
        .then(res => res.json())
        .then(json => resolve(json.results[0].vicinity)); 
    });
}

function getLocation () {
    //return new Promise((resolve,reject) => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
        })
        .then(location => {
            console.log(location);
        })
        .catch(error => {
            console.log("uwu a wittle fucky wucky");
        })
    //})
}




