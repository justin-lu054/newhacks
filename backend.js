const fetch = require('node-fetch');

function getRestaurant (latitude, longitude) {
    return new Promise((resolve, reject) => {
        fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?rankby=distance&key=AIzaSyCp19sWPQVlG1V8m9cUB9gLGszUAwNXa4U&location=${latitude},${longitude}&type=restaurant&fields=name&keyword=fast%20food&opennow=true`)
        .then(res => res.json())
        .then(json => resolve(json.results[0].vicinity)); 
    });
}

getRestaurant("51.5074", "-0.1278").then((json) => console.log(json)); 
