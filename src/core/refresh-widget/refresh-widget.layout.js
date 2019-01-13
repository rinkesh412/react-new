import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class RefreshWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: 'Click the refresh button to see me change!'
        };
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.props.setCallback(this.refresh);
    }

    refresh() {
        this.setState({
            text: 'You clicked the refresh button!'
        });
    }

    render() {
        return (
            <div>
                {this.state.text}
            </div>
        );
    }
}

export default RefreshWidget;

RefreshWidget.propTypes = {
    setCallback: PropTypes.func.isRequired
};

RefreshWidget.defaultProps = {

};