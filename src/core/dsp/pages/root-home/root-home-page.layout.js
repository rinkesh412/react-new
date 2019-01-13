import React, { Component } from "react";
import PropTypes from "prop-types";

export class RootHomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="root-home-page">
        This is the Home page... Gopal Dev In Progress
      </div>
    );
  }
}

RootHomePage.propTypes = {
  pageTitle: PropTypes.object.isRequired
};

export default RootHomePage;
