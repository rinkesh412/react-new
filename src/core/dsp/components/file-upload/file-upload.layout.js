import React from 'react';
import PropTypes from 'prop-types';

export default class FileUpload extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            responseStatus: ''
        };

        this.handleFileUpload = this.handleFileUpload.bind(this);
    }

    handleFileUpload(ev) {
        ev.preventDefault();

        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);

        fetch(this.props.uploadURL, {
            method: 'POST',
            body: data,
        }).then(response => {
            response.json().then(body => {
                this.setState({ responseStatus: body.status });
            });
        });
    }

    render() {
        return (
            <form onSubmit={this.handleFileUpload}>
                <div>
                    <input ref={ref => { this.uploadInput = ref; }} type="file" />
                </div>
                <br />
                <div>
                    <button>Upload</button>
                </div>
                <img src={this.state.imageURL} alt="img" />
            </form>
        );
    }
}

FileUpload.propTypes = {
    uploadURL: PropTypes.string.isRequired
};