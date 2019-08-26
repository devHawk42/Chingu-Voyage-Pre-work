import React, { Component } from 'react';

class Sidebar extends Component {
    render() {
        return (
            <div className="sidebar-container">
                <ul className="items-list">
                    <li className="item-info">1</li>
                    <li className="item-info">2</li>
                    <li className="item-info">3</li>
                </ul>
            </div>
        );
    }
}

export default Sidebar;