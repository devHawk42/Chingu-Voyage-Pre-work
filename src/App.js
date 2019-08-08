import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import MapboxGeocoder from 'mapbox-gl-geocoder';

class App extends Component {
    componentDidMount() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2aGF3ayIsImEiOiJjanoxejdwbGQwMHh6M2ZvM25odmJkbGMzIn0.Idjb5ZxlFgsdzYRnBkgPSg';
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11'
        });

        this.addSearch();
    }

    addSearch() {
        this.map.addControl(new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        }));
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