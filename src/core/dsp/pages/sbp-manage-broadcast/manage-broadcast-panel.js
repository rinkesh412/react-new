import React from 'react';
import PropTypes from 'prop-types';
import ManageBroadcastMainPage from './manage-broadcast-main-page/manage-broadcast-container';
const manageBroadcastMainPage = <ManageBroadcastMainPage />;

export default class ManageBroadcastPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            panels: [ manageBroadcastMainPage ],
            headings: [ 'Manage Broadcast Tasks' ]
        };
    }
    render() {
        console.log(this.state.panels);
        return (
            <div>
                <ManageBroadcastMainPage sourcePage="manageBroadcast" {...this.props} />
            </div>
        );

    }
}
ManageBroadcastPanel.propTypes = {
    getIconUrl: PropTypes.func.isRequired,
};