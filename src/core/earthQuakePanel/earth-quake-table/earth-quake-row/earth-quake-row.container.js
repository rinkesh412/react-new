import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { EarthQuakeItemContext } from '../../contexts/earth-quake.context';

import './earth-quake-row.container.styl';

export class EarthQuakeRow extends Component {
    constructor(props) {
        super(props);
        this.getRowView = this.getRowView.bind(this);
    }

    state = {  }

    getRowView(earthQuakeData) {
        return earthQuakeData.map(data =>
            <div key={data.id} className="earth-quake-row">
                <div className="earth-quake-row__place">
                    <div className="earth-quake__label">{data.properties.place}</div>
                </div>
                <div  className="earth-quake-row__mag">
                    <div className="earth-quake__label">{data.properties.mag}</div>
                </div>
                <div  className="earth-quake-row__time">
                    <div className="earth-quake__label">{new Date(data.properties.time).toString()}</div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <EarthQuakeItemContext.Consumer>
                    {context => this.getRowView(context.earthQuake)}
                </EarthQuakeItemContext.Consumer>
            </div>
        );
    }
}

export default EarthQuakeRow;

EarthQuakeRow.propTypes = {
    location: PropTypes.string.isRequired
};

EarthQuakeRow.defaultProps = {

};