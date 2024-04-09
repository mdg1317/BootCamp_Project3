# FBI - Department of UFO Shenanigans
*UFO Sightings in the United States - Dashboard Project*

![FBI - Department of UFO Shenanigans](static/images/project_banner.jpg)

## Background
We are exploring UFO sightings in the United States between 2010-2014.  We have created an interactive dashboard for a fictitious US intelligence agency to analyze UFO sightings and locations to determine when and where they are more likely to experience a close encounter. 

Our dashboard includes a map that shows markers for each cluster and individual sighting which can be filtered by the year. A honeycomb tile map in the shape of the United States that will show the number of sightings per state.  When clicked, it will update the map view and will zoom the map to that region for further information. Also included is a line chart to show the trend over all of the years that compares the number of sightings by month. Lastly, we’re including a bar chart to show the frequency of individual UFO shapes.  
 



## Men In Black
- **[Travis Cook](https://github.com/byTravis)** - [Bootstrap](https://getbootstrap.com/), CSS, [Highcharts Honecomb Map](https://www.highcharts.com/demo/highcharts/honeycomb-usa)
- **[Matthew Groh](https://github.com/mdg1317)** - Data Cleaning, [Leaflet](https://leafletjs.com/) Map
- **[Marshal Rittenger](https://github.com/Ray-Marshal)** - Mongo DB,[ Plotly](https://plotly.com/) Line Chart & Bar Chart



## Process

**Data Source:**  [UFO Sightings](https://www.kaggle.com/datasets/NUFORC/ufo-sightings) (Compiled from NUFORC data by [Sigmond Axel](https://github.com/planetsig/ufo-reports))

Our dataset comprises over 80,000 entries spanning approximately 100 years, making it impractical to visualize the entire dataset, especially for rendering map visualizations.  To address this, we've narrowed our focus to the United States and selected the most recent years with the highest number of sightings.  We used Python to clean the data to remove all non-US locations, and 


Since Javascript works most easily with Json data, we’re opting to extract and clean the data from the CSV in python before converting it into a json file and loading it into the NoSQL Mongo database. For our additional JavaScript library, we’ll be making one or more charts with the Highcharts library.  


## Challenges


## Results
The interactive dashboard for the *UFO Sightings in the United States* can be found in the Live Demo.

