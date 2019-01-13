import React, { Component } from 'react';
import FUMSearchArchiveNavigateOp from './fota-um-manage-archive_Op/fota-um-navigate-selected-mode';
export class FUMManageArchiveOp extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <FUMSearchArchiveNavigateOp />
            </div>
        );
    }
}

export default FUMManageArchiveOp;