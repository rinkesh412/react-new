import React, { Component } from 'react';
import DomainMenu from '../domain-menu/domain-menu.component';
import { DSPProvider } from '../../utils/dsp.context';
import PropTypes from 'prop-types';
import CommonUtils from '../../utils/common.utils';
import './domain-loader.component.styl';

export class DomainLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            targetPage: props.initialPage,
            pageTitle: null,
            pageClassName: null
        };
    }

    getPageTitle = () => {
        if (this.state.pageTitle) {
            return (<h2 className="domain-page-title">{ CommonUtils.getLocaleText(this.state.pageTitle) }</h2>);
        }
        return null;
    }

    targetHandler = menuInfo => {
        if (menuInfo.key !== this.state.targetPage) {
            this.setState({
                targetPage: menuInfo.key,
                pageTitle: menuInfo.item.props.children.props.localeMap,
                pageClassName: menuInfo.item.props.pageClassName
            });
        }
    }

    render() {
        const DomainPage = this.props.pageIndex[this.state.targetPage] || this.props.pageIndex['NotFoundPage'];
        return (
            <DSPProvider value={this.props.dspContext}>
                <div className={`domain-container ${this.props.domain}-domain-container ${this.state.pageClassName}`}>
                    <DomainMenu domain={this.props.domain} activeKey={this.props.initialPage} targetHandler={ this.targetHandler } />
                    <div className="domain-page">
                        <DomainPage pageTitle={this.getPageTitle()} {...this.props.dspContext} />
                    </div>
                </div>
            </DSPProvider>
        );
    }
}

DomainLoader.propTypes = {
    domain: PropTypes.string.isRequired,
    initialPage: PropTypes.string.isRequired,
    pageIndex: PropTypes.object.isRequired,
    dspContext: PropTypes.object.isRequired
};

export default DomainLoader;