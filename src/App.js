import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import MapboxGeocoder from 'mapbox-gl-geocoder';
import makeRequest from './utils/meteoriteData'

class App extends Component {
    componentDidMount() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2aGF3ayIsImEiOiJjanoxejdwbGQwMHh6M2ZvM25odmJkbGMzIn0.Idjb5ZxlFgsdzYRnBkgPSg';
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11'
        });

        
        this.addSearch();

        this.drawPoints();
    }

    addSearch() {
        this.map.addControl(new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        }));
    }

    async drawPoints(){
        let self = this;
        
        let {features} = await makeRequest.getAll();
        
        this.map.on("load", function() {
            self.map.addSource("national-park", {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": features,
                }
            })
            
            self.map.addLayer({
                "id": "park-volcanoes",
                "type": "circle",
                "source": "national-park",
                "paint": {
                    "circle-radius": 6,
                    "circle-color": "#B42222"
                },
                "filter": ["==", "$type", "Point"],
            });
        })

        // Create a popup, but don't add it to the map yet.
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        this.map.on('mouseenter', 'park-volcanoes', function(e) {
            // Change the cursor style as a UI indicator.
            self.map.getCanvas().style.cursor = 'pointer';
            console.log(e)
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = self.getHTMLDescription(e.features[0].properties);
            
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            
            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates)
            .setHTML(description)
            .addTo(self.map);
        });
            
        this.map.on('mouseleave', 'park-volcanoes', function() {
            self.map.getCanvas().style.cursor = '';
            popup.remove();
        });
    }

    getHTMLDescription(properties){
        return "<strong>Make it Mount Pleasant</strong><p>Make it Mount Pleasant is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>";
    }

    componentWillUnmount() {
        this.map.remove();
    }

    render() {
        const style = {
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '100%'
        };

        return <div style={style} ref={el => this.mapContainer = el} />;
    }
}

export default App;