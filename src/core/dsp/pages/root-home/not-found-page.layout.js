import React, { Component } from 'react';

export class NotFoundPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="not-found-page">
                <h2>Page not found!</h2>
            </div>
        );
    }
}

export default NotFoundPage;