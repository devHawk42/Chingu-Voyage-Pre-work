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