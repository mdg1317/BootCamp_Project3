# FBI - Department of UFO Shenanigans
*UFO Sightings in the United States - Dashboard Project*

![FBI - Department of UFO Shenanigans](static/images/project_banner.jpg)

## Background
We are exploring UFO sightings in the United States between 2009-2013.  We have created an interactive dashboard for a fictitious US intelligence agency to analyze UFO sightings and locations to determine when and where we are more likely to experience a close encounter. 

Our dashboard includes a map that shows markers for each cluster and individual sighting which can be filtered by the year. A honeycomb tile map in the shape of the United States that will show the number of sightings per state.  When clicked, it will update the map view and will zoom the map to that region for further information. Also included is a line chart to show the trend over all of the years that compares the number of sightings by month. Lastly, we’re including a bar chart to show the frequency of individual UFO shapes.  
 

## Men In Black
- **[Travis Cook](https://github.com/byTravis)**
    - [Bootstrap](https://getbootstrap.com/), CSS, [Highcharts Honecomb Map](https://www.highcharts.com/demo/highcharts/honeycomb-usa)
- **[Matthew Groh](https://github.com/mdg1317)**
    - Data Cleaning, [Leaflet](https://leafletjs.com/) Map
- **[Marshal Rittenger](https://github.com/Ray-Marshal)**
    - Mongo DB,[ Plotly](https://plotly.com/) Line Chart & Bar Chart



## Our Approach

**Data Source:**  [UFO Sightings](https://www.kaggle.com/datasets/NUFORC/ufo-sightings) (Compiled from NUFORC data by [Sigmond Axel](https://github.com/planetsig/ufo-reports))

Since JavaScript natively works with JSON formatted data, we’re opting to extract and clean the data from the original CSV dataset using Python.  This will be loaded into a Mongo database before converting it into a JSON file. Our dataset comprises over 80,000 entries spanning approximately 100 years, making it impractical to visualize the entire dataset, especially for rendering map visualizations.  To address this, we've narrowed our focus to the United States and selected the most recent years with the highest number of sightings.  We used Python to reduce the original dataset by removing all non-US locations and narrowing the incident dates to 2009-2013.

In the header, we included a year filter.  When selecting a new year, the tile map, geographical map, and the shape chart change to show that year's data.

We wanted to give a high overview of the country's UFO sightings for the selected year.  This was achieved by utilizing Highcharts tile map library.  The tile map shows all of the states with each color group is based on how many UFO sightings in that year. This can be further refined in the legend by turning on and off count categories.  This is useful when looking for UFO hotspots.  Additionally, you can click on an state tile to reposition the geographic map the chosen state for detailed information on individual sightings.

For the geographic map, we used Leaflet to plot UFO sightings in the United States.  When clicking on a marker, a popup will include additional information on that individual sighting.  Because there were so many sightings in any given year, we chose to cluster them to make the map more readable.  Simply click into a cluster group, and the map will zoom into that area and expand the markers.

The line chart shows the number of sightings and time of year they occurred.  We chose to show all 5 years to see if there is a common thread between the time of year in relation to the other years in our dataset.

Lastly, we included a bar chart showing the top 10 shapes that were seen during that year.  This bit of information may be useful to know what to look for when we narrow down ideal time and places for a close encounter.


## Results
The interactive dashboard for the *UFO Sightings in the United States* can be found in the Live Demo.

### Conclusions
- **Locations:**
- **Time of Year:**
- **Shape To Look For:**

## Epilogue
Thank you for your attention.  If you don't mind, please look right here.

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDRrbjF0MDE3N2V4bWU4eGF6bmVyMXZzMjY1d3hkd2xzd2pwZzJkaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/6IPNUgkpCsDRK/giphy.gif)

