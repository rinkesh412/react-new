import React, { Component } from 'react';
import DomainLoader from '../../components/domain-loader/domain-loader.component';
import RootPageIndex from './root-domain.index';
import './root-domain.container.styl';

export class RootDomainContainer extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return true;
    }

    render() {
        return (
            <DomainLoader domain="root" initialPage="RootHomePage" pageIndex={RootPageIndex} dspContext={this.props} />
        );
    }
}

export default RootDomainContainer;