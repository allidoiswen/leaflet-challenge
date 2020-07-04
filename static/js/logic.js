// Set the map center
var myMap = L.map("map", {
    center: [39, -98],
    zoom: 3
  });
  
// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);
  
var newtry = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
// var newtry = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
// var newtry = "static/data/sampleData.geojson"

// Create a color scale
function magColorScale(arg) {

    if (0 <= arg && arg < 1) {
        fillColor = "#32CD32";
    }
    else if (1 <= arg && arg < 2) {
        fillColor = "#7CFC00";
    }
    else if (2 <= arg && arg < 3) {
        fillColor = "#FFA07A"; //lightsalmon
    }
    else if (3 <= arg && arg < 4) {
        fillColor = "#E9967A"; //darksalmon
    }
    else if (4 <= arg && arg < 5) {
        fillColor = "#DC143C"; //crimson
    }
    else if (arg >= 5) {
        fillColor = "#800000"; //maroon
    }
    return fillColor;
}
  
d3.json(newtry).then(function(response) {

    // trim GeoJSON
    var features = response.features

    // Draw a circle for every location
    for (var i = 0; i < features.length; i++) {

        var location = features[i].geometry;
        var lat = location.coordinates[1];
        var lng = location.coordinates[0];
        var mag = features[i].properties.mag;

        if (location) {
            var circle = L.circle([lat, lng], {
                            color: "black",
                            weight: 0.5,
                            fillColor: magColorScale(mag),
                            fillOpacity: 0.75,
                            radius: (mag ** 2) * 10000
                        }).addTo(myMap);
                        
            // Add a popup for every circle
            circle.bindPopup(`Location: ${lat}, ${lng}<br>
                              Magnitude: ${mag}`);
        }
    }

    // Add legend (Source: https://leafletjs.com/examples/choropleth/)
    var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magLevels = [0, 1, 2, 3, 4, 5],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < magLevels.length; i++) {
            div.innerHTML +=
                '<i style="background:' + magColorScale(magLevels[i]) + '"></i> ' +
                magLevels[i] + (magLevels[i + 1] ? '&ndash;' + magLevels[i + 1] + ' <br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
    
}).catch(function(error) 
            {return console.log(error);}
        );
  