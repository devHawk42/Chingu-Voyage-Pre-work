import React, { Component } from 'react';

class Sidebar extends Component {
    constructor(props){
        super(props);
    }

    render() {
        let { points, onClick } = this.props;

        return (
            <div className="sidebar-container">
                <div className="filter-container" />

                <div className="items-list-container">
                    <ul className="items-list">
                        {
                            points.map(point => (
                                <div onClick={() => onClick(point.geometry.coordinates)} className="single-item-container">
                                    <li className="item" key={point.properties.id} className="item-info">{point.properties.name}</li>
                                </div>
                            ))
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Sidebar;