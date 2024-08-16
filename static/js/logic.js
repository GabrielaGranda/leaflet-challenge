
function createMap(earthmap) {

  // Create the tile layer that will be the background of our map.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})
// Create a baseMaps object to hold the streetmap layer.
let baseMaps = {
"Street Map": streetmap
};

// Create an overlayMaps object to hold the earthquakes layer.
let overlayMaps = {
"Earthquakes": earthmap
};

// Create the map object with options.
let myMap = L.map("map", {
center: [37.09, -95.71],
zoom: 5,
layers: [streetmap, earthmap]
});

// Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
collapsed: false
}).addTo(myMap);

// Adding the legend to the map
legend.addTo(myMap);
}

//Get Json Data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){
  createFeatures(data.features);
});

//CCreate a function to return color
function createColor(depth) {
  if (depth <= 10) return "#5EFB6E";
  else if (depth <= 30) return "#CCFB5D";
  else if (depth <= 50) return "#FFD700";
  else if (depth <= 70) return "#FFAE42";
  else if (depth <= 90) return "#F88017";
  else return "#F70D1A";
}

//Create a Function to return the circles and the properties
function createFeatures (earthData){
  earthmap = L.geoJson(earthData, {
    pointToLayer: function(feature){
      return L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        color: "#4682B4",
        weight: 1,
        fillColor: createColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.8,
        radius: feature.properties.mag*20000
        });
      },

    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h5><center>" + feature.properties.place + "</center>" +
      "</h5><hr><p>Magnitude: " + feature.properties.mag + "</h5> / Depth: " + feature.geometry.coordinates[2] + "</p>");
      }
    
  });
  createMap(earthmap);
 
}

// Set up the legend.
let legend = L.control({position: "bottomright"});
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");
  let labels = ["<10", "10-30", "30-50", "50-70", "70-90", "90+"];
  var colors = ['#5EFB6E','#CCFB5D','#FFD700', '#FFAE42', '#F88017','#F70D1A'];
  var colorLabels = [];
  

  div.innerHTML = "<h3 style='text-align: center'>Depth</h3>";

  labels.forEach(function(label, index) {
    colorLabels.push("<li style=\"background-color:" + colors[index] + "\">" + "<span><center>" + labels[index] +"</span></center></li>");
    });
  div.innerHTML += colorLabels.join(" ") +"</div>";
  return div;
};
