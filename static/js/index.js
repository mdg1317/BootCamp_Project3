function init(data){
    // Store all unique years in array
    let years = [];
    for(let i = 0; i < data.length; i++){
        if(!years.includes(data[i].datetime.slice(0, 4))){
            years.push(data[i].datetime.slice(0, 4));
        }
    }

    // Sort the years and add them to the dropdown select
    // Then initialize the map markers for the starting year
    years.sort().map(year => d3.select("#selDataset").append("option").text(year));
    setMarkers(data, d3.select("#selDataset").property("value"));

    return data;
}

function optionChanged(data, value){
    // Reset the markers every time a new year is selected
    setMarkers(data, value);
}

function setMarkers(data, value){
    // Remove all current markers
    markerGroup.clearLayers();

    // Add markers for all data within selected year to marker group
    let markerData = data.filter(d => parseInt(d.datetime.slice(0, 4)) == value);
    for(let i = 0; i < markerData.length; i++){
        markerGroup.addLayer(L.marker([markerData[i].latitude, markerData[i].longitude])
        .bindPopup(`Location: ${markerData[i].city}, ${markerData[i].state.toUpperCase()}<br>Date/Time: ${markerData[i].datetime}`));
    }
}

// Create the map object
var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5
});

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create the marker cluster group
let markerGroup = L.markerClusterGroup().addTo(myMap);

// Get the data from the file
d3.csv("static/resources/ufo.csv").then(function(data) {
    jsonData = init(data);
});