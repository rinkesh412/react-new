import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import './model-name-autocomplete.styl';

export default class Autocomplete extends Component {
  static propTypes = {
      suggestionsList: PropTypes.instanceOf(Array),
      userInput: PropTypes.string
  };

  static defaultProps = {
      suggestionsList: []
  };

  constructor(props) {
      super(props);
      this.state = {
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false,
        userInput: '',
        showClose: false
      };
  }

  

  handleChange = e => {
      const { suggestionsList } = this.props;
      const userInput = e.currentTarget.value;
      let filteredSuggestions = [];
      this.setState({ showClose: true });
      if (userInput.length >= 2) {
          filteredSuggestions = suggestionsList.filter(suggestion =>
              suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1);
      } else {
          filteredSuggestions = suggestionsList.filter(suggestion =>
              suggestion.toLowerCase().indexOf(userInput.toLowerCase()) < -1);
      }
      this.setState({
          activeSuggestion: 0,
          filteredSuggestions,
          showSuggestions: true,
          userInput: e.currentTarget.value
      });
      this.props.userTypedModelName(userInput);
  };

    // Event fired when the user clicks on a suggestion
    handleClick = (data) => {
        console.log("handleClicked",data);
    // Update the user input and reset the rest of the state
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: data
        });
        this.props.callBackFromParent(data);
    };

    onKeyDown = e => {
        const { activeSuggestion, filteredSuggestions } = this.state;

        if (e.keyCode === 13) {
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: filteredSuggestions[activeSuggestion]
            });
        } else if (e.keyCode === 38) {
            if (activeSuggestion === 0) {
                return;
            }
            this.setState({ activeSuggestion: activeSuggestion - 1 });
        } else if (e.keyCode === 40) {
            if (activeSuggestion - 1 === filteredSuggestions.length) {
                return;
            }
            this.setState({ activeSuggestion: activeSuggestion + 1 });
        }
    };

    render() {
        const {
            handleChange, handleClick, onKeyDown,
            state: {
                activeSuggestion,
                filteredSuggestions,
                showSuggestions,
                userInput
            }
        } = this;
        let suggestionsListComponent;

        if (showSuggestions && userInput) {
            if (filteredSuggestions.length) {
                suggestionsListComponent = (
                    <ul className="suggestions">
                        {filteredSuggestions.map((suggestion, index) => {
                            let className;

                            if (index === activeSuggestion) {
                                className = 'suggestion-active';
                            }
                            return (
                                <li className={className} key={suggestion} onClick={() => handleClick(suggestion)}>
                                    {suggestion}
                                </li>
                            );
                        })}
                    </ul>
                );
            } else {
                suggestionsListComponent = (
                    <div />
                );
            }
        }
        return (
            <Fragment>
                <input
                    type="search"
                    onChange={handleChange}
                    onKeyDown={onKeyDown}
                    value={userInput}
                    maxLength="100"
                />
                {suggestionsListComponent}
            </Fragment>
        );
    }
}

Autocomplete.propTypes = {
    receivedData: PropTypes.object,
    userInput: PropTypes.string,
    handleChange: PropTypes.func,
    callBackFromParent: PropTypes.func
};