import React, { Component } from 'react';

import EarthQuakeTable from './earth-quake-table/earth-quake-table.container';
import { getEarthQuakeData } from './services/earth-quake.service';
import { EarthQuakeItemContext  } from './contexts/earth-quake.context';

import './earth-quake-panel.layout.styl';

export class EarthQuakePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        getEarthQuakeData().then(data => {
            this.setState({
                data: data.features
            });
        });
    }

    render() {
        return (
            <div className="earth-quake-panel-layout">
                <EarthQuakeItemContext.Provider key="key" value={{ earthQuake: this.state.data }} >
                    <EarthQuakeTable />
                </EarthQuakeItemContext.Provider >
            </div>
        );
    }
}

export default EarthQuakePanel;

EarthQuakePanel.propTypes = {

};

EarthQuakePanel.defaultProps = {

};