// Setting the Trace and Layout settings for the initially emppty bar graph

let traceBar = [
  {
    x: [],
    y: [],
    text: [],
    type: "bar",
    orientation: "h",
    marker: {
      color: "#b30000",
    },
  },
];
let layoutBar = {
  title: "Sighting Shapes per Year",
  height: 400,
};

Plotly.newPlot("bar_chart", traceBar, layoutBar);

// Setting the Traces and Layout settings for the initially emppty line graph

let traceLine1 = {
  x: [],
  y: [],
  type: "scatter",
  mode: "lines+markers",
  name: "2009",
  line: {
    color: "#d7191c",
  },
};

let traceLine2 = {
  x: [],
  y: [],
  type: "scatter",
  mode: "lines+markers",
  name: "2010",
  line: {
    color: "#fdae61",
  },
};

let traceLine3 = {
  x: [],
  y: [],
  type: "scatter",
  mode: "lines+markers",
  name: "2011",
  line: {
    color: "#ffeda0",
  },
};

let traceLine4 = {
  x: [],
  y: [],
  type: "scatter",
  mode: "lines+markers",
  name: "2012",
  line: {
    color: "#a6d96a",
  },
};

let traceLine5 = {
  x: [],
  y: [],
  type: "scatter",
  mode: "lines+markers",
  name: "2013",
  line: {
    color: "#1a9641",
  },
};

let lineData = [traceLine1, traceLine2, traceLine3, traceLine4, traceLine5];

let layoutLine = {
  title: "UFO Sightings per Month",
  height: 400,
  xaxis: {
    ticktext: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    tickvals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
};
Plotly.newPlot("line_chart", lineData, layoutLine);

function init(data) {
  // Store all unique years in array
  let years = [];
  for (let i = 0; i < data.length; i++) {
    if (!years.includes(data[i].datetime.slice(0, 4))) {
      years.push(data[i].datetime.slice(0, 4));
    }
  }

  // Sort the years and add them to the dropdown select
  // Then initialize the map markers for the starting year
  years
    .sort()
    .map((year) => d3.select("#selDataset").append("option").text(year));
  setMarkers(data, d3.select("#selDataset").property("value"));
  honeycomb_data(data, d3.select("#selDataset").property("value"));
  updateLineGraph(data);
  updateBarGraph(data, d3.select("#selDataset").property("value"));

  return data;
}

function optionChanged(data, value) {
  // Reset the markers every time a new year is selected
  setMarkers(data, value);
  honeycomb_data(data, d3.select("#selDataset").property("value"));
  updateBarGraph(data, d3.select("#selDataset").property("value"));
}

function setMarkers(data, value) {
  // Remove all current markers
  markerGroup.clearLayers();

  // Add markers for all data within selected year to marker group
  let markerData = data.filter(
    (d) => parseInt(d.datetime.slice(0, 4)) == value
  );
  for (let i = 0; i < markerData.length; i++) {
    markerGroup.addLayer(
      L.marker([markerData[i].latitude, markerData[i].longitude]).bindPopup(
        `<b>Location:</b> ${markerData[i].city}, ${markerData[i].state.toUpperCase()}<br>\
        <b>Date/Time:</b> ${markerData[i].datetime}<br>\
        <b>Duration:</b> ${markerData[i].duration} seconds<br>\
        <b>Shape:</b> ${markerData[i].shape}<br>\
        <b>Comments:</b> ${markerData[i].comments}`
      )
    );
  }
}

function updateLineGraph(data) {
  //Creating a function to create the line graph, starting with empty variables to hold the number
  //of sightings for each particular year in a dictionary
  let monthCounts2009 = {};
  let monthCounts2010 = {};
  let monthCounts2011 = {};
  let monthCounts2012 = {};
  let monthCounts2013 = {};

  data.forEach(function (d) {
    // Extracting the date, moth and year and populating each of the above dictionaries with the
    // month (key) and count (value)
    let date = new Date(d.datetime);
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (year == "2009") {
      if (month in monthCounts2009) {
        monthCounts2009[month]++;
      } else {
        monthCounts2009[month] = 1;
      }
    } else if (year == "2010") {
      if (month in monthCounts2010) {
        monthCounts2010[month]++;
      } else {
        monthCounts2010[month] = 1;
      }
    } else if (year == "2011") {
      if (month in monthCounts2011) {
        monthCounts2011[month]++;
      } else {
        monthCounts2011[month] = 1;
      }
    } else if (year == "2012") {
      if (month in monthCounts2012) {
        monthCounts2012[month]++;
      } else {
        monthCounts2012[month] = 1;
      }
    } else if (year == "2013") {
      if (month in monthCounts2013) {
        monthCounts2013[month]++;
      } else {
        monthCounts2013[month] = 1;
      }
    }
  });
  // Once the dictionaries have been made, we extract the keys and values to later
  // insert into our empty traces
  const lineX1 = Object.keys(monthCounts2009);
  const lineY1 = Object.values(monthCounts2009);
  const lineX2 = Object.keys(monthCounts2010);
  const lineY2 = Object.values(monthCounts2010);
  const lineX3 = Object.keys(monthCounts2011);
  const lineY3 = Object.values(monthCounts2011);
  const lineX4 = Object.keys(monthCounts2012);
  const lineY4 = Object.values(monthCounts2012);
  const lineX5 = Object.keys(monthCounts2013);
  const lineY5 = Object.values(monthCounts2013);

  // Inserting each set of data from above into the x and y values of each year's trace
  traceLine1.x = lineX1;
  traceLine1.y = lineY1;
  traceLine2.x = lineX2;
  traceLine2.y = lineY2;
  traceLine3.x = lineX3;
  traceLine3.y = lineY3;
  traceLine4.x = lineX4;
  traceLine4.y = lineY4;
  traceLine5.x = lineX5;
  traceLine5.y = lineY5;

  // Updating the plot with the new lineData
  Plotly.newPlot("line_chart", lineData, layoutLine);
}

function updateBarGraph(data, value) {
  // Starting a function to update the bar graph, using the dropdown value and data to extract
  // only the year we're interested in
  let bgraphData = data.filter(
    (d) => parseInt(d.datetime.slice(0, 4)) == value
  );
  let shapeCounts = {};

  let barGraph = traceBar[0];

  // Iterating through the data to count each different shape and inserting the data into a dictionary
  bgraphData.forEach(function (s) {
    let shape = s.shape;

    if (shape in shapeCounts) {
      shapeCounts[shape]++;
    } else {
      shapeCounts[shape] = 1;
    }
  });

  // converting the dictionary object into an array so it can then be sorted and sliced into the
  // top 10 most prominent shapes in the data
  const shapeCountsArray = Object.entries(shapeCounts);
  let sortedCountArray = shapeCountsArray.sort((a, b) => b[1] - a[1]);
  let topShapeCountArray = sortedCountArray.slice(0, 10).reverse();
  const sortedShapeCounts = Object.fromEntries(topShapeCountArray);

  // creating separate variables for the shapes and their counts so they can be inserted into
  // the empty bar graph and then updated with '.react'
  const barX = Object.values(sortedShapeCounts);
  const barY = Object.keys(sortedShapeCounts);

  barGraph.x = barX;
  barGraph.y = barY;
  Plotly.react("bar_chart", traceBar, layoutBar);
}

// Create the map object
var myMap = L.map("map", {
  center: [39.8283, -98.5795],
  zoom: 4,
});

// Add the tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

// Create the marker cluster group
let markerGroup = L.markerClusterGroup().addTo(myMap);

// Get the data from the file
d3.json("static/resources/UFO_Project_3.Cleaned_Data.json").then(function (data) {
  jsonData = init(data);
});

// ################################################
// ############## Honeycomb Map Code ##############
// ################################################

// Retrieve's data for honecomb map
function honeycomb_data(data, year) {
  let filteredData = data.filter(
    (d) => parseInt(d.datetime.slice(0, 4)) == year
  );
  // from https://d3js.org/d3-array/group#rollup
  let stateCounts = d3.rollup(
    filteredData,
    (D) => D.length,
    (d) => d.state
  );
  honeycomb_map(stateCounts, year);
}

// Checks to see if there's a value for a state.  If not, it returns zero.
function honeycomb_count(stateCounts, state) {
  if (stateCounts.get(state)) {
    return stateCounts.get(state);
  } else {
    return 0;
  }
}

// Updates Leaflet map view when hex tile is clicked
function update_view(zoom) {
  myMap.setView(zoom[0], zoom[1]);
}

// Builds honeycomb map
function honeycomb_map(stateCounts, year) {
  Highcharts.chart("honeycomb_map", {
    chart: {
      type: "tilemap",
      inverted: true,
    },

    title: {
      text: `UFO Sightings by State in ${year}`,
      style: { fontSize: "1em" },
    },

    // subtitle: {
    //     text: `UFO Sightings In ${year}`
    // },

    //  Removes x & y labels and grid
    xAxis: { visible: false },
    yAxis: { visible: false },

    //  Color values for each hex
    colorAxis: {
      dataClasses: [
        {
          from: 0,
          to: 10,
          color: "#F9EDB3",
          name: "< 10",
        },
        {
          from: 10,
          to: 40,
          color: "#FFBB5C",
          name: "10 - 40",
        },
        {
          from: 40,
          to: 70,
          color: "#FF9B50",
          name: "40 - 70",
        },
        {
          from: 70,
          to: 100,
          color: "#E25E3E",
          name: "70 - 100",
        },
        {
          from: 100,
          color: "#C63D2F",
          name: "100 +",
        },
      ],
    },

    tooltip: {
      headerFormat: "",
      pointFormat:
        '<h3 style="font-size: 1.4em; font-weight: 700; ">{point.name}</h3> <br/><hr/><p style="font-size: .9em; color: #535353;"><span style = "font-weight: 700;">UFO Sightings:</span>  {point.value}</p></div>',
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
            },
          },
        },
      },
      series: {
        dataLabels: {
          enabled: true,
          format: "{point.hc-a2}",
          color: "#000000",
          style: {
            textOutline: false,
          },
        },
      },
    },

    // Sets state tiles in a grid along with additional metadata
    series: [
      {
        name: "",
        data: [
          {
            "hc-a2": "AL",
            name: "Alabama",
            x: 6,
            y: 7,
            value: honeycomb_count(stateCounts, "al"),
            coordinates: [[32.806671, -86.79113], 6],
          },
          {
            "hc-a2": "AK",
            name: "Alaska",
            x: 0,
            y: 0,
            value: honeycomb_count(stateCounts, "ak"),
            coordinates: [[61.370716, -152.404419], 4],
          },
          {
            "hc-a2": "AZ",
            coordinates: "Arizona",
            x: 5,
            y: 3,
            value: honeycomb_count(stateCounts, "az"),
            coordinates: [[33.729759, -111.431221], 6],
          },
          {
            "hc-a2": "AR",
            name: "Arkansas",
            x: 5,
            y: 6,
            value: honeycomb_count(stateCounts, "ar"),
            coordinates: [[34.969704, -92.373123], 6],
          },
          {
            "hc-a2": "CA",
            name: "California",
            x: 5,
            y: 2,
            value: honeycomb_count(stateCounts, "ca"),
            coordinates: [[36.116203, -119.681564], 5],
          },
          {
            "hc-a2": "CO",
            name: "Colorado",
            x: 4,
            y: 3,
            value: honeycomb_count(stateCounts, "co"),
            coordinates: [[39.059811, -105.311104], 6],
          },
          {
            "hc-a2": "CT",
            name: "Connecticut",
            x: 3,
            y: 11,
            value: honeycomb_count(stateCounts, "ct"),
            coordinates: [[41.597782, -72.755371], 9],
          },
          {
            "hc-a2": "DE",
            name: "Delaware",
            x: 4,
            y: 9,
            value: stateCounts.get("de"),
            coordinates: [[39.318523, -75.507141], 9],
          },
          {
            "hc-a2": "DC",
            name: "District of Columbia",
            x: 4,
            y: 10,
            value: honeycomb_count(stateCounts, "dc"),
            coordinates: [[38.89511, -77.03637], 10],
          },
          {
            "hc-a2": "FL",
            name: "Florida",
            x: 8,
            y: 8,
            value: honeycomb_count(stateCounts, "fl"),
            coordinates: [[27.766279, -81.686783], 6],
          },
          {
            "hc-a2": "GA",
            name: "Georgia",
            x: 7,
            y: 8,
            value: honeycomb_count(stateCounts, "ga"),
            coordinates: [[33.040619, -83.643074], 6],
          },
          {
            "hc-a2": "HI",
            name: "Hawaii",
            x: 8,
            y: 0,
            value: honeycomb_count(stateCounts, "hi"),
            coordinates: [[21.094318, -157.498337], 7],
          },
          {
            "hc-a2": "ID",
            name: "Idaho",
            x: 3,
            y: 2,
            value: honeycomb_count(stateCounts, "id"),
            coordinates: [[44.240459, -114.478828], 6],
          },
          {
            "hc-a2": "IL",
            name: "Illinois",
            x: 3,
            y: 6,
            value: honeycomb_count(stateCounts, "il"),
            coordinates: [[40.349457, -88.986137], 6],
          },
          {
            "hc-a2": "IN",
            name: "Indiana",
            x: 3,
            y: 7,
            value: honeycomb_count(stateCounts, "in"),
            coordinates: [[39.849426, -86.258278], 7],
          },
          {
            "hc-a2": "IA",
            name: "Iowa",
            x: 3,
            y: 5,
            value: honeycomb_count(stateCounts, "ia"),
            coordinates: [[42.011539, -93.210526], 7],
          },
          {
            "hc-a2": "KS",
            name: "Kansas",
            x: 5,
            y: 5,
            value: honeycomb_count(stateCounts, "ks"),
            coordinates: [[38.5266, -96.726486], 7],
          },
          {
            "hc-a2": "KY",
            name: "Kentucky",
            x: 4,
            y: 6,
            value: honeycomb_count(stateCounts, "ky"),
            coordinates: [[37.66814, -84.670067], 7],
          },
          {
            "hc-a2": "LA",
            name: "Louisiana",
            x: 6,
            y: 5,
            value: honeycomb_count(stateCounts, "la"),
            coordinates: [[31.169546, -91.867805], 6],
          },
          {
            "hc-a2": "ME",
            name: "Maine",
            x: 0,
            y: 11,
            value: honeycomb_count(stateCounts, "me"),
            coordinates: [[44.693947, -69.381927], 7],
          },
          {
            "hc-a2": "MD",
            name: "Maryland",
            x: 4,
            y: 8,
            value: honeycomb_count(stateCounts, "md"),
            coordinates: [[39.063946, -76.802101], 8],
          },
          {
            "hc-a2": "MA",
            name: "Massachusetts",
            x: 2,
            y: 10,
            value: honeycomb_count(stateCounts, "ma"),
            coordinates: [[42.230171, -71.530106], 8],
          },
          {
            "hc-a2": "MI",
            name: "Michigan",
            x: 2,
            y: 7,
            value: honeycomb_count(stateCounts, "mi"),
            coordinates: [[43.326618, -84.536095], 6],
          },
          {
            "hc-a2": "MN",
            name: "Minnesota",
            x: 2,
            y: 4,
            value: honeycomb_count(stateCounts, "mn"),
            coordinates: [[45.694454, -94.63623], 6],
          },
          {
            "hc-a2": "MS",
            name: "Mississippi",
            x: 6,
            y: 6,
            value: honeycomb_count(stateCounts, "ms"),
            coordinates: [[32.741646, -89.398528], 6],
          },
          {
            "hc-a2": "MO",
            name: "Missouri",
            x: 4,
            y: 5,
            value: honeycomb_count(stateCounts, "mo"),
            coordinates: [[38.456085, -92.458588], 6],
          },
          {
            "hc-a2": "MT",
            name: "Montana",
            x: 2,
            y: 2,
            value: honeycomb_count(stateCounts, "mt"),
            coordinates: [[46.921925, -110.454353], 6],
          },
          {
            "hc-a2": "NE",
            name: "Nebraska",
            x: 4,
            y: 4,
            value: honeycomb_count(stateCounts, "ne"),
            coordinates: [[41.12537, -99.002563], 7],
          },
          {
            "hc-a2": "NV",
            name: "Nevada",
            x: 4,
            y: 2,
            value: honeycomb_count(stateCounts, "nv"),
            coordinates: [[38.313515, -116.6554], 6],
          },
          {
            "hc-a2": "NH",
            name: "New Hampshire",
            x: 1,
            y: 11,
            value: honeycomb_count(stateCounts, "nh"),
            coordinates: [[43.452492, -71.563896], 8],
          },
          {
            "hc-a2": "NJ",
            name: "New Jersey",
            x: 3,
            y: 10,
            value: honeycomb_count(stateCounts, "nj"),
            coordinates: [[40.298904, -74.521011], 8],
          },
          {
            "hc-a2": "NM",
            name: "New Mexico",
            x: 6,
            y: 3,
            value: honeycomb_count(stateCounts, "nm"),
            coordinates: [[34.840515, -106.248482], 6],
          },
          {
            "hc-a2": "NY",
            name: "New York",
            x: 2,
            y: 9,
            value: honeycomb_count(stateCounts, "ny"),
            coordinates: [[42.165726, -73.757874], 7],
          },
          {
            "hc-a2": "NC",
            name: "North Carolina",
            x: 5,
            y: 9,
            value: honeycomb_count(stateCounts, "nc"),
            coordinates: [[35.630066, -79.019302], 6],
          },
          {
            "hc-a2": "ND",
            name: "North Dakota",
            x: 2,
            y: 3,
            value: honeycomb_count(stateCounts, "nd"),
            coordinates: [[47.528912, -99.793022], 6],
          },
          {
            "hc-a2": "OH",
            name: "Ohio",
            x: 3,
            y: 8,
            value: honeycomb_count(stateCounts, "oh"),
            coordinates: [[40.388783, -82.907123], 7],
          },
          {
            "hc-a2": "OK",
            name: "Oklahoma",
            x: 6,
            y: 4,
            value: honeycomb_count(stateCounts, "ok"),
            coordinates: [[35.565342, -97.092877], 6],
          },
          {
            "hc-a2": "OR",
            name: "Oregon",
            x: 4,
            y: 1,
            value: honeycomb_count(stateCounts, "or"),
            coordinates: [[44.572021, -122.905014], 6],
          },
          {
            "hc-a2": "PA",
            name: "Pennsylvania",
            x: 3,
            y: 9,
            value: honeycomb_count(stateCounts, "pa"),
            coordinates: [[40.590752, -77.209755], 7],
          },
          {
            "hc-a2": "RI",
            name: "Rhode Island",
            x: 2,
            y: 11,
            value: honeycomb_count(stateCounts, "ri"),
            coordinates: [[41.680893, -71.51178], 9],
          },
          {
            "hc-a2": "SC",
            name: "South Carolina",
            x: 6,
            y: 8,
            value: honeycomb_count(stateCounts, "sc"),
            coordinates: [[33.856892, -80.945007], 7],
          },
          {
            "hc-a2": "SD",
            name: "South Dakota",
            x: 3,
            y: 4,
            value: honeycomb_count(stateCounts, "sd"),
            coordinates: [[44.299782, -99.438828], 6],
          },
          {
            "hc-a2": "TN",
            name: "Tennessee",
            x: 5,
            y: 7,
            value: honeycomb_count(stateCounts, "tn"),
            coordinates: [[35.747845, -86.692345], 6],
          },
          {
            "hc-a2": "TX",
            name: "Texas",
            x: 7,
            y: 4,
            value: honeycomb_count(stateCounts, "tx"),
            coordinates: [[31.054487, -97.563461], 5],
          },
          {
            "hc-a2": "UT",
            name: "Utah",
            x: 5,
            y: 4,
            value: honeycomb_count(stateCounts, "ut"),
            coordinates: [[40.150032, -111.862434], 6],
          },
          {
            "hc-a2": "VT",
            name: "Vermont",
            x: 1,
            y: 10,
            value: honeycomb_count(stateCounts, "vt"),
            coordinates: [[44.045876, -72.710686], 8],
          },
          {
            "hc-a2": "VA",
            name: "Virginia",
            x: 5,
            y: 8,
            value: honeycomb_count(stateCounts, "va"),
            coordinates: [[37.769337, -78.169968], 7],
          },
          {
            "hc-a2": "WA",
            name: "Washington",
            x: 2,
            y: 1,
            value: honeycomb_count(stateCounts, "wa"),
            coordinates: [[47.400902, -121.490494], 6],
          },
          {
            "hc-a2": "WV",
            name: "West Virginia",
            x: 4,
            y: 7,
            value: honeycomb_count(stateCounts, "wv"),
            coordinates: [[38.491226, -80.954071], 7],
          },
          {
            "hc-a2": "WI",
            name: "Wisconsin",
            x: 2,
            y: 5,
            value: honeycomb_count(stateCounts, "wi"),
            coordinates: [[44.268543, -89.616508], 6],
          },
          {
            "hc-a2": "WY",
            name: "Wyoming",
            x: 3,
            y: 3,
            value: honeycomb_count(stateCounts, "wy"),
            coordinates: [[42.755966, -107.30249], 6],
          },
        ],
      },
    ],
  });
}
