import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import EarthQuakeRow from './earth-quake-row/earth-quake-row.container';

import './earth-quake-table.container.styl';

export class EarthQuakeTable extends Component {
    constructor(props) {
        super(props);
    }

    state = {  }
    render() {
        return (
            <div className="earth-quake-table-container">
                <div className="earth-quake-table-header-container">
                    <div className="earth-quake-table-header-container__location" >Location</div>
                    <div className="earth-quake-table-header-container__mag" >Magnitude</div>
                    <div className="earth-quake-table-header-container__time" >Time</div>
                </div>
                <EarthQuakeRow />
            </div>
        );
    }
}

export default EarthQuakeTable;

EarthQuakeTable.propTypes = {

};

EarthQuakeTable.defaultProps = {

};