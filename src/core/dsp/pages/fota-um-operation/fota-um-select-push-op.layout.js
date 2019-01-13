import React, { Component } from 'react';
import FUMNavigatePushManagement from './fota-um-push-management-op/fota-um-navigate-push-management';
export class FUMSelectPushMethod extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <FUMNavigatePushManagement />
            </div>
        );
    }
}

export default FUMSelectPushMethod;