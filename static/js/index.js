let traceBar = [
    {
      x: [],
      y: [],
      text: [],
      type: "bar",
      orientation: "h",
    },
  ];
  let layoutBar = [
    {
        title: 'Sighting Shapes per Year',
        height: 500,
        width: 500,
        xaxis: {
            type: "category",
      },
    },
  ];
Plotly.newPlot("bar_chart", traceBar, layoutBar);

let traceLine1 = [
    {
        x: [],
        y: [],
        mode: 'lines+markers'
    }
];

// let traceLine2 = [
//     {
//         x: [],
//         y: [],
//         mode: 'lines+markers'
//     }
// ]

// let lineData = [traceLine1, traceLine2]

let layoutLine = [
    {
        title: 'UFO Sightings per Month',
        height: 500,
        width: 800, 
        xaxis: {
            
        }
    },
  ];
Plotly.newPlot("line_chart", traceLine1, layoutLine);

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
    honeycomb_data(data, d3.select("#selDataset").property("value"));
    updateLineGraph(data, d3.select("#selDataset").property("value")); 
    updateBarGraph(data, d3.select("#selDataset").property("value")); 

    return data;
}

function optionChanged(data, value){
    // Reset the markers every time a new year is selected
    setMarkers(data, value);
    honeycomb_data(data, d3.select("#selDataset").property("value")); 
    updateLineGraph(data, d3.select("#selDataset").property("value"));
    updateBarGraph(data, d3.select("#selDataset").property("value"));    
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

function updateLineGraph(data, value) {
    let lgraphData = data.filter(d => parseInt(d.datetime.slice(0, 4)) == value);
    let monthCounts = {}
    
    let lineGraph1 = traceLine1[0];
    // let lineGraph2 = traceLine2[0];
    lgraphData.forEach(d => {
        d.month = new Date(d.datetime).getMonth();
    });
    lgraphData.sort((a, b) => a.month - b.month);

    const sortedMonths = lgraphData.map(d => ({
        datetime: d.datetime
    }));

    sortedMonths.forEach(function(d) {
        let date = new Date(d.datetime);
        let month = date.getMonth()+1

        if (month in monthCounts) {
            monthCounts[month]++
        } else {
            monthCounts[month] = 1
        }
    })
    // console.log(monthCounts)
    const lineX = Object.keys(monthCounts);
    const lineY  = Object.values(monthCounts);

    lineGraph1.x = lineX
    lineGraph1.y = lineY
    Plotly.react("line_chart", traceLine1, layoutLine);
}

function updateBarGraph(data, value) {
    let bgraphData = data.filter(d => parseInt(d.datetime.slice(0, 4)) == value);
    let shapeCounts = {}

    let barGraph = traceBar[0];

    bgraphData.forEach(function(s) {
        let shape = s.shape

        if(shape in shapeCounts) {
            shapeCounts[shape]++
        } else {
            shapeCounts[shape] = 1
        }
    });
    
    const shapeCountsArray = Object.entries(shapeCounts);
    shapeCountsArray.sort((a, b) => a[1] - b[1]);
    const sortedShapeCounts = Object.fromEntries(shapeCountsArray);
    // console.log(sortedShapeCounts)
    const barX = Object.values(sortedShapeCounts);
    const barY = Object.keys(sortedShapeCounts);

    barGraph.x = barX
    barGraph.y = barY
    Plotly.react("bar_chart", traceBar, layoutBar);
}

// Create the map object
var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4
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


// ################################################
// ############## Honeycomb Map Code ##############
// ################################################

// Retrieve's data for honecomb map
function honeycomb_data(data, year) {    
    let filteredData = data.filter(d => parseInt(d.datetime.slice(0, 4)) == year);
    // from https://d3js.org/d3-array/group#rollup
    let stateCounts = d3.rollup(filteredData, D => D.length, d => d.state);
    honeycomb_map(stateCounts, year);    
};

// Checks to see if there's a value for a state.  If not, it returns zero.
function honeycomb_count(stateCounts, state) {
    if (stateCounts.get(state)) {return stateCounts.get(state);}
    else {return 0}
};

// Updates Leaflet map view when hex tile is clicked
function update_view(zoom) { 
    myMap.setView(zoom[0], zoom[1]);
};

// Builds honeycomb map
function honeycomb_map(stateCounts, year) {
    Highcharts.chart('honeycomb_map', {
        chart: {
            type: 'tilemap',
            inverted: true,      
        },
    
        title: {
            text: `UFO Sightings by State in ${year}`,
            style: {fontSize: '1em'}
        },
    
        // subtitle: {
        //     text: `UFO Sightings In ${year}`
        // },
    
        //  Removes x & y labels and grid
        xAxis: {visible: false},    
        yAxis: {visible: false},

        //  Color values for each hex
        colorAxis: {
            dataClasses: [{
                from: 0,
                to: 10,
                color: '#F9EDB3',
                name: '< 10'
            }, {
                from: 10,
                to: 40,
                color: '#FFBB5C',
                name: '10 - 40'
            }, {
                from: 40,
                to: 70,
                color: '#FF9B50',
                name: '40 - 70'
            }, {
                from: 70,
                to: 100,
                color: '#E25E3E',
                name: '70 - 100'
            }, {
                from: 100,
                color: '#C63D2F',
                name: '100 +'
            }]
        },
    
        tooltip: {
            headerFormat: '',
            pointFormat: '<h3 style="font-size: 1.4em; font-weight: 700; ">{point.name}</h3> <br/><hr/><p style="font-size: .9em; color: #535353;"><span style = "font-weight: 700;">UFO Sightings:</span>  {point.value}</p></div>'
        },

        plotOptions: {
            tilemap: {
                point: {
                    events: {
                        click: function (event) {
                            var clickedTile = event.point;
                            // console.log(clickedTile);
                            console.log(clickedTile.options["coordinates"]);
                            let zoom = clickedTile.options["coordinates"];
                            update_view(zoom);
                        }
                    }
                }
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.hc-a2}',
                    color: '#000000',
                    style: {
                        textOutline: false
                    }
                }
            }
        },
        
        // Sets state tiles in a grid along with additional metadata
        series: [{
            name: '',
            data: [{
                'hc-a2': 'AL',
                name: 'Alabama',
                x: 6,
                y: 7,
                value: honeycomb_count(stateCounts, "al"),
                coordinates: [[32.806671, -86.791130], 6]
            }, {
                'hc-a2': 'AK',
                name: 'Alaska',
                x: 0,
                y: 0,
                value: honeycomb_count(stateCounts, "ak"),
                coordinates: [[61.370716, -152.404419], 4]
            }, {
                'hc-a2': 'AZ',
                coordinates: 'Arizona',
                x: 5,
                y: 3,
                value: honeycomb_count(stateCounts, "az"),
                coordinates: [[33.729759, -111.431221], 6]
            }, {
                'hc-a2': 'AR',
                name: 'Arkansas',
                x: 5,
                y: 6,
                value: honeycomb_count(stateCounts, "ar"),
                coordinates: [[34.969704, -92.373123], 6]
            }, {
                'hc-a2': 'CA',
                name: 'California',
                x: 5,
                y: 2,
                value: honeycomb_count(stateCounts, "ca"),
                coordinates: [[36.116203, -119.681564], 5]
            }, {
                'hc-a2': 'CO',
                name: 'Colorado',
                x: 4,
                y: 3,
                value: honeycomb_count(stateCounts, "co"),
                coordinates: [[39.059811, -105.311104], 6]
            }, {
                'hc-a2': 'CT',
                name: 'Connecticut',
                x: 3,
                y: 11,
                value: honeycomb_count(stateCounts, "ct"),
                coordinates: [[41.597782, -72.755371], 9]
            }, {
                'hc-a2': 'DE',
                name: 'Delaware',
                x: 4,
                y: 9,
                value: stateCounts.get("de"),
                coordinates: [[39.318523, -75.507141], 9]
            }, {
                'hc-a2': 'DC',
                name: 'District of Columbia',
                x: 4,
                y: 10,
                value: honeycomb_count(stateCounts, "dc"),
                coordinates: [[38.89511, -77.03637], 10]
            }, {
                'hc-a2': 'FL',
                name: 'Florida',
                x: 8,
                y: 8,
                value: honeycomb_count(stateCounts, "fl"),
                coordinates: [[27.766279, -81.686783], 6]
            }, {
                'hc-a2': 'GA',
                name: 'Georgia',
                x: 7,
                y: 8,
                value: honeycomb_count(stateCounts, "ga"),
                coordinates: [[33.040619, -83.643074], 6]
            }, {
                'hc-a2': 'HI',
                name: 'Hawaii',
                x: 8,
                y: 0,
                value: honeycomb_count(stateCounts, "hi"),
                coordinates: [[21.094318, -157.498337], 7]
            }, {
                'hc-a2': 'ID',
                name: 'Idaho',
                x: 3,
                y: 2,
                value: honeycomb_count(stateCounts, "id"),
                coordinates: [[44.240459, -114.478828], 6]
            }, {
                'hc-a2': 'IL',
                name: 'Illinois',
                x: 3,
                y: 6,
                value: honeycomb_count(stateCounts, "il"),
                coordinates: [[40.349457, -88.986137], 6]
            }, {
                'hc-a2': 'IN',
                name: 'Indiana',
                x: 3,
                y: 7,
                value: honeycomb_count(stateCounts, "in"),
                coordinates: [[39.849426, -86.258278], 7]
            }, {
                'hc-a2': 'IA',
                name: 'Iowa',
                x: 3,
                y: 5,
                value: honeycomb_count(stateCounts, "ia"),
                coordinates: [[42.011539, -93.210526], 7]
            }, {
                'hc-a2': 'KS',
                name: 'Kansas',
                x: 5,
                y: 5,
                value: honeycomb_count(stateCounts, "ks"),
                coordinates: [[38.526600, -96.726486], 7]
            }, {
                'hc-a2': 'KY',
                name: 'Kentucky',
                x: 4,
                y: 6,
                value: honeycomb_count(stateCounts, "ky"),
                coordinates: [[37.668140, -84.670067], 7]
            }, {
                'hc-a2': 'LA',
                name: 'Louisiana',
                x: 6,
                y: 5,
                value: honeycomb_count(stateCounts, "la"),
                coordinates: [[31.169546, -91.867805], 6]
            }, {
                'hc-a2': 'ME',
                name: 'Maine',
                x: 0,
                y: 11,
                value: honeycomb_count(stateCounts, "me"),
                coordinates: [[44.693947, -69.381927], 7]
            }, {
                'hc-a2': 'MD',
                name: 'Maryland',
                x: 4,
                y: 8,
                value: honeycomb_count(stateCounts, "md"),
                coordinates: [[39.063946, -76.802101], 8]
            }, {
                'hc-a2': 'MA',
                name: 'Massachusetts',
                x: 2,
                y: 10,
                value: honeycomb_count(stateCounts, "ma"),
                coordinates: [[42.230171, -71.530106], 8]
            }, {
                'hc-a2': 'MI',
                name: 'Michigan',
                x: 2,
                y: 7,
                value: honeycomb_count(stateCounts, "mi"),
                coordinates: [[43.326618, -84.536095], 6]
            }, {
                'hc-a2': 'MN',
                name: 'Minnesota',
                x: 2,
                y: 4,
                value: honeycomb_count(stateCounts, "mn"),
                coordinates: [[45.694454, -94.636230], 6]
            }, {
                'hc-a2': 'MS',
                name: 'Mississippi',
                x: 6,
                y: 6,
                value: honeycomb_count(stateCounts, "ms"),
                coordinates: [[32.741646, -89.398528], 6]
            }, {
                'hc-a2': 'MO',
                name: 'Missouri',
                x: 4,
                y: 5,
                value: honeycomb_count(stateCounts, "mo"),
                coordinates: [[38.456085, -92.458588], 6]
            }, {
                'hc-a2': 'MT',
                name: 'Montana',
                x: 2,
                y: 2,
                value: honeycomb_count(stateCounts, "mt"),
                coordinates: [[46.921925, -110.454353], 6]
            }, {
                'hc-a2': 'NE',
                name: 'Nebraska',
                x: 4,
                y: 4,
                value: honeycomb_count(stateCounts, "ne"),
                coordinates: [[41.125370, -99.002563], 7]
            }, {
                'hc-a2': 'NV',
                name: 'Nevada',
                x: 4,
                y: 2,
                value: honeycomb_count(stateCounts, "nv"),
                coordinates: [[38.313515, -116.655400], 6]
            }, {
                'hc-a2': 'NH',
                name: 'New Hampshire',
                x: 1,
                y: 11,
                value: honeycomb_count(stateCounts, "nh"),
                coordinates: [[43.452492, -71.563896], 8]
            }, {
                'hc-a2': 'NJ',
                name: 'New Jersey',
                x: 3,
                y: 10,
                value: honeycomb_count(stateCounts, "nj"),
                coordinates: [[40.298904, -74.521011], 8]
            }, {
                'hc-a2': 'NM',
                name: 'New Mexico',
                x: 6,
                y: 3,
                value: honeycomb_count(stateCounts, "nm"),
                coordinates: [[34.840515, -106.248482], 6]
            }, {
                'hc-a2': 'NY',
                name: 'New York',
                x: 2,
                y: 9,
                value: honeycomb_count(stateCounts, "ny"),
                coordinates: [[42.165726, -73.757874], 7]
            }, {
                'hc-a2': 'NC',
                name: 'North Carolina',
                x: 5,
                y: 9,
                value: honeycomb_count(stateCounts, "nc"),
                coordinates: [[35.630066, -79.019302], 6]
            }, {
                'hc-a2': 'ND',
                name: 'North Dakota',
                x: 2,
                y: 3,
                value: honeycomb_count(stateCounts, "nd"),
                coordinates: [[47.528912, -99.793022], 6]
            }, {
                'hc-a2': 'OH',
                name: 'Ohio',
                x: 3,
                y: 8,
                value: honeycomb_count(stateCounts, "oh"),
                coordinates: [[40.388783, -82.907123], 7]
            }, {
                'hc-a2': 'OK',
                name: 'Oklahoma',
                x: 6,
                y: 4,
                value: honeycomb_count(stateCounts, "ok"),
                coordinates: [[35.565342, -97.092877], 6]
            }, {
                'hc-a2': 'OR',
                name: 'Oregon',
                x: 4,
                y: 1,
                value: honeycomb_count(stateCounts, "or"),
                coordinates: [[44.572021, -122.905014], 6]
            }, {
                'hc-a2': 'PA',
                name: 'Pennsylvania',
                x: 3,
                y: 9,
                value: honeycomb_count(stateCounts, "pa"),
                coordinates: [[40.590752, -77.209755], 7]
            }, {
                'hc-a2': 'RI',
                name: 'Rhode Island',
                x: 2,
                y: 11,
                value: honeycomb_count(stateCounts, "ri"),
                coordinates: [[41.680893, -71.511780], 9]
            }, {
                'hc-a2': 'SC',
                name: 'South Carolina',
                x: 6,
                y: 8,
                value: honeycomb_count(stateCounts, "sc"),
                coordinates: [[33.856892, -80.945007], 7]
            }, {
                'hc-a2': 'SD',
                name: 'South Dakota',
                x: 3,
                y: 4,
                value: honeycomb_count(stateCounts, "sd"),
                coordinates: [[44.299782, -99.438828], 6]
            }, {
                'hc-a2': 'TN',
                name: 'Tennessee',
                x: 5,
                y: 7,
                value: honeycomb_count(stateCounts, "tn"),
                coordinates: [[35.747845, -86.692345], 6]
            }, {
                'hc-a2': 'TX',
                name: 'Texas',
                x: 7,
                y: 4,
                value: honeycomb_count(stateCounts, "tx"),
                coordinates: [[31.054487, -97.563461], 5]
            }, {
                'hc-a2': 'UT',
                name: 'Utah',
                x: 5,
                y: 4,
                value: honeycomb_count(stateCounts, "ut"),
                coordinates: [[40.150032, -111.862434], 6]
            }, {
                'hc-a2': 'VT',
                name: 'Vermont',
                x: 1,
                y: 10,
                value: honeycomb_count(stateCounts, "vt"),
                coordinates: [[44.045876, -72.710686], 8]
            }, {
                'hc-a2': 'VA',
                name: 'Virginia',
                x: 5,
                y: 8,
                value: honeycomb_count(stateCounts, "va"),
                coordinates: [[37.769337, -78.169968], 7]
            }, {
                'hc-a2': 'WA',
                name: 'Washington',
                x: 2,
                y: 1,
                value: honeycomb_count(stateCounts, "wa"),
                coordinates: [[47.400902, -121.490494], 6]
            }, {
                'hc-a2': 'WV',
                name: 'West Virginia',
                x: 4,
                y: 7,
                value: honeycomb_count(stateCounts, "wv"),
                coordinates: [[38.491226, -80.954071], 7]
            }, {
                'hc-a2': 'WI',
                name: 'Wisconsin',
                x: 2,
                y: 5,
                value: honeycomb_count(stateCounts, "wi"),
                coordinates: [[44.268543, -89.616508], 6]
            }, {
                'hc-a2': 'WY',
                name: 'Wyoming',
                x: 3,
                y: 3,
                value: honeycomb_count(stateCounts, "wy"),
                coordinates: [[42.755966, -107.302490], 6]
            }]
        }]
    });
    


};