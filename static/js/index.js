const LIMIT = 1000;

function createMap(data){
    console.log(data);

    // Creating the map object
    var myMap = L.map("map", {
        center: [39.8283, -98.5795],
        zoom: 5
    });

    // Adding the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    //let earthquakes = data.features;
    for(let i = 0; i < data.length; i++){
        L.marker([data[i].latitude, data[i].longitude])
        .bindPopup(`Location: ${data[i].city}, ${data[i].state.toUpperCase()}<br>Date/Time: ${data[i].datetime}`)
        .addTo(myMap);
    }
}

d3.csv("static/resources/ufo.csv").then(function(data) {
    createMap(data.slice(0, 1000));
});