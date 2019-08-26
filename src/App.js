import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import MapboxGeocoder from 'mapbox-gl-geocoder';
import makeRequest from './utils/meteoriteData'
import Sidebar from './components/Sidebar';

class App extends Component {
    componentDidMount() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2aGF3ayIsImEiOiJjanoxejdwbGQwMHh6M2ZvM25odmJkbGMzIn0.Idjb5ZxlFgsdzYRnBkgPSg';
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/dark-v10',
            zoom: 10,
            center: [4.899, 52.372]
        });

        this.addNavigationControls();
        
        this.drawPoints();

        this.addPopup();
    }
    
    addNavigationControls() {
        this.map.addControl(new mapboxgl.NavigationControl());
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
    }

    addPopup() {
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        this.map.on('mouseenter', 'park-volcanoes', function(e) {
            self.map.getCanvas().style.cursor = 'pointer';
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = self.getHTMLDescription(e.features[0].properties);
            
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            
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
        return (
            `<h1><strong>${properties.name}</strong></h1>
                <ul>
                    <li class="descItem">Mass: ${properties.mass}g</li>
                    <li class="descItem">Date: ${properties.year.split("T")[0]}</li>
                    <li class="descItem">Fall: ${properties.fall}</li>
                    <li class="descItem">Recclass: ${properties.recclass}</li>
                </ul>
            `);
    }

/*     componentWillUnmount() {
        this.map.remove();
    }
 */
    render() {
        const style = {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '100%'
        };

        return (
            <div style={style} ref={el => this.mapContainer = el} >
                <Sidebar />
            </div>
        );
    }
}

export default App;