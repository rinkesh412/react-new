import React, { Component } from 'react';
import FUMUploadArchiveTest from '../../fota-um-upload-archive/fota-um-upload-test/fota-um-upload-archive-test';
export class FUMMakerTestUploadArchive extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <FUMUploadArchiveTest />
            </div>
        );
    }
}

export default FUMMakerTestUploadArchive;