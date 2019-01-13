import React, { Component } from 'react';
import FUMUploadTestTargetList from '../../fota-um-upload-test-target-list/fota-um-upload-test-target-list';
export class FUMMakerTestUploadTestTargetList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <FUMUploadTestTargetList />
            </div>
        );
    }
}

export default FUMMakerTestUploadTestTargetList;