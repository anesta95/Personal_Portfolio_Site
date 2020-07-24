// ---------------------------------------------------------------------------
// MAKE THE BLANK MAP
// ---------------------------------------------------------------------------
// initialize the map
// var mymap = L.map('mapid').setView([38.90, -77.03], 11);

// // load a tile layer
// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW5lc3RhOTUiLCJhIjoiY2tjaDJwNTluMDR1YTJ3b2Y0dnU4MXpjcyJ9.D5mgv0rfeSyWujY2s7-oNA', {
// maxZoom: 18,
// attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
//     '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
//     'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
// id: 'mapbox/streets-v11',
// tileSize: 512,
// maxZoom: 17,
// minZoom: 9,
// zoomOffset: -1
// }).addTo(mymap);

// ---------------------------------------------------------------------------
// DATE CLEANING FUNCTION
// ---------------------------------------------------------------------------


function formatDate(date) {
    var year = date.getFullYear(),
        month = date.getMonth() + 1, // months are zero indexed
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
        minuteFormatted = minute < 10 ? "0" + minute : minute,
        tod = hour < 12 ? "AM" : "PM";

    return `${month}/${day}/${year} ${hourFormatted}:${minuteFormatted}:${second} ${tod}`;
}

// ---------------------------------------------------------------------------
// GROUP FUNCTION
// ---------------------------------------------------------------------------



// ---------------------------------------------------------------------------
// FETCH FUNCTIONS
// ---------------------------------------------------------------------------


// Handle all fetch requests
async function getJSON(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        throw error;
    }
}


async function getVZData(url) {
    const vzJSON = await getJSON(url);
    return vzJSON;
}

// ---------------------------------------------------------------------------
// FILLING THE MAP WITH OPEN DATA DC PORTAL DATA IN IIFE
// ---------------------------------------------------------------------------

(async function(){
    try {
        var mymap = L.map('mapid').setView([38.90, -77.03], 11);

        
        var geojsonMarkerOptions = {
            radius: 3,
            weight: 1,
            opacity: 0.7,
            fillOpacity: 0.7
        };

        let visionZero = await getVZData("https://opendata.arcgis.com/datasets/3f28bc3ad77f49079efee0ac05d8464c_0.geojson");
        let vzFeatures = visionZero.features;

        function onEachFeature(feature, layer) {
            if (feature.properties && feature.properties.USERTYPE && feature.properties.REQUESTDATE) {
                layer.bindPopup(`<p>Submitted by: ${feature.properties.USERTYPE}</p>
                                 <p>Violation type: ${feature.properties.REQUESTTYPE}</p>
                                 <p>Submitted date: ${formatDate(new Date(feature.properties.REQUESTDATE.replace("+00", "")))}</p>`);
            }
        }

        layersGroup = [];

        function addLayerFromFeature(geoJSONFeature, propertyName, color, variableName) {
            var variableName = L.geoJSON(geoJSONFeature.filter(feature => feature.properties.USERTYPE == propertyName), {
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }, 
                style: {color: color},
                onEachFeature: onEachFeature
            }).addTo(mymap);
            layersGroup.push(variableName);
        }
        addLayerFromFeature(vzFeatures, 'Biker', "#e41a1c", 'bikersLayer');
        addLayerFromFeature(vzFeatures, 'Pedestrian', "#377eb8", 'pedsLayer');
        addLayerFromFeature(vzFeatures, 'Car Driver', "#984ea3", 'driversLayer');
        

        // var bikers = vzFeatures.filter(feature => feature.properties.USERTYPE == 'Biker');
        // var bikersLayer = L.geoJSON(bikers, {
        //     pointToLayer: function (feature, latlng) {
        //         return L.circleMarker(latlng, geojsonMarkerOptions);
        //     },
        //     style: {color: "#008000"},
        //     onEachFeature: onEachFeature
        // }).addTo(mymap);


        // var peds = vzFeatures.filter(feature => feature.properties.USERTYPE == 'Pedestrian');
        // var pedsLayer = L.geoJSON(peds, {
        //     pointToLayer: function (feature, latlng) {
        //         return L.circleMarker(latlng, geojsonMarkerOptions);
        //     },
        //     style: {color: "#FFFF00"},
        //     onEachFeature: onEachFeature
        // }).addTo(mymap);

        // var drivers = vzFeatures.filter(feature => feature.properties.USERTYPE == 'Car Driver');
        // var driversLayer = L.geoJSON(drivers, {
        //     pointToLayer: function (feature, latlng) {
        //         return L.circleMarker(latlng, geojsonMarkerOptions);
        //     },
        //     style: {color: "#fa2c00"},
        //     onEachFeature: onEachFeature
        // }).addTo(mymap);

        // L.geoJSON(vzFeatures, {
        //     pointToLayer: function (feature, latlng) {
        //         return L.circleMarker(latlng, geojsonMarkerOptions);
        //     },
        //     style: function(feature) {
        //         switch(feature.properties.USERTYPE) {
        //             case 'Pedestrian': return {color: "#FFFF00"};
        //             case 'Biker': return {color: "#008000"};
        //             case 'Car Driver': return {color: "#fa2c00"}
        //         }
        //     }
        // }).addTo(mymap);

        var overlayMaps = {
            "Bikers": layersGroup[0],
            "Pedestrians": layersGroup[1],
            "Drivers": layersGroup[2]
        };
        

        L.control.layers(null, overlayMaps).addTo(mymap);

        // load a tile layer
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW5lc3RhOTUiLCJhIjoiY2tjczd2eTQ2MTM5MzJ3bWYzam80N3hxNSJ9.MSTvFkdjnsPFvUsj7wrM8Q', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        maxZoom: 17,
        minZoom: 9,
        zoomOffset: -1,
        // layers: [pedsLayer, bikersLayer, driversLayer]
        }).addTo(mymap);

        // var sliderControl = L.control.sliderControl({position: "bottomleft", layer: vzGroup});

        // //Make sure to add the slider to the map ;-)
        // mymap.addControl(sliderControl);
        // //And initialize the slider
        // sliderControl.startSlider();

    } catch(err) {
        console.error(err);
    }
    
  })();




// A few good SO article breaking down Promises with async/await vs. Promises with .then() vs. callbacks
// https://stackoverflow.com/questions/14220321/how-do-i-return-the-response-from-an-asynchronous-call    
// https://stackoverflow.com/questions/23667086/why-is-my-variable-unaltered-after-i-modify-it-inside-of-a-function-asynchron

// Github example of the time slider:
// https://dwilhelm89.github.io/LeafletSlider/

// Good intro to Leaflet 
// https://maptimeboston.github.io/leaflet-intro

// Leaflet SO answer
// https://stackoverflow.com/questions/49944666/parsing-json-api-result-and-loading-in-to-leaflet

// SO answer to multiple GeoJSON layers
// https://gis.stackexchange.com/questions/148965/multiple-geojson-layers
