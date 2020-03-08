const fetch = require("node-fetch"); 

const twilioSID = "SK4479d9aec8b67ee4c4e8f515d1dcdf37"
const twilioApiKey = "GKtLSZc47Rs8e3G9wXP8GbvdB7Z4Rzar"

function getRestaurant (latitude, longitude) {
    return new Promise((resolve, reject) => {
        fetch("https://maps.googleapis.com/maps/api/place/nearbysearch/json?rankby=distance&key=AIzaSyCp19sWPQVlG1V8m9cUB9gLGszUAwNXa4U&location=${latitude},${longitude}&type=restaurant&fields=name&keyword=fast%20food&opennow=true")
        .then(res => res.json())
        .then(
            json => {
                console.log(json); 
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
        fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&key=AIzaSyCp19sWPQVlG1V8m9cUB9gLGszUAwNXa4U&input=${encodeAddress(address)}&fields=geometry`)
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

getRestaurant("43.866756", "-79.348833"); 