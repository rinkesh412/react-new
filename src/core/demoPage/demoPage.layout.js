import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as CSFWidget from '@nokia-csf-uxr/csfWidgets';

import Item from './item.layout';

import './demoPage.layout.styl';

export class DemoPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userPrefTextValue: ''
        };
        this.userPrefInputChange = this.userPrefInputChange.bind(this);
        this.saveUserPrefText = this.saveUserPrefText.bind(this);
        this.navigate = this.navigate.bind(this);
    }

    componentDidMount() {
        this.setState({
            userPrefTextValue: this.props.userPrefs.custom['userPrefTextValue'] ? this.props.userPrefs.custom['userPrefTextValue'] : ''
        });
    }

    userPrefInputChange(evt) {
        this.setState({
            userPrefTextValue: evt.value
        });
    }

    saveUserPrefText() {
        this.props.updateUserPrefs('userPrefTextValue', this.state.userPrefTextValue);
    }

    navigate() {
        this.props.navigate('dashboard');
    }

    render() {
        return (
            <div className="csp-demo-page-wrapper">
                <div className="csp-demo-page-label">
                    This is a custom page. That means I was created in the plugin project. Below I have demoed the data objects you have access too as a custom component.
                    One thing you may notice is that my icon in the menu to the left is a smily face. That was set in the site definition for this page. Also youll notice that this
                    page has been styled. That comes from the custom component code as well. The css was pull in with this page code.
                </div>
                <div className="csp-demo-page-section-wrapper">
                    <div className="csp-demo-page-label">
                        Let me show you some of the things youll have access to.
                    </div>
                    <div className="csp-demo-page-section">
                        <CSFWidget.ExpansionPanel>
                            <Item name={'Your Site Definition'}
                                content={JSON.stringify(this.props.siteDefinition, null, 2) }
                            />
                        </CSFWidget.ExpansionPanel>
                    </div>
                </div>

                <div className="csp-demo-page-section">
                    <div className="csp-demo-page-label">
                        Here is your User Name!
                    </div>
                    {this.props.user}
                </div>
                <div className="csp-demo-page-section">
                    <div className="csp-demo-page-label">
                        A niffty system icon with a scray red color!
                    </div>
                    <CSFWidget.SvgIcon
                        iconColor="#ff0000"
                        icon={this.props.getIconUrl('angry')}
                    />
                    <div className="csp-demo-page-label">
                       This is a custom icon that is defined in the site definition
                    </div>
                    <CSFWidget.SvgIcon
                        icon={this.props.getIconUrl('tv')}
                    />
                </div>
                <div className="csp-demo-page-section">
                    <div className="csp-demo-page-label">
                        Lets look at some user prefs.
                        Heres all of them, but remember, while you can see them all, you can only change the custom ones
                    </div>
                    <CSFWidget.ExpansionPanel>
                        <Item name={'Your User Preferences'}
                            content={JSON.stringify(this.props.userPrefs, null, 2) }
                        />
                    </CSFWidget.ExpansionPanel>
                </div>
                <div className="csp-demo-page-section">
                    <div className="csp-demo-page-label">
                        Now lets save ourselves a pref! Once you save, you should be able to see the value when you reload the page. Sweet!
                    </div>
                    <div className="csp-demo-page-section__user-pref-input">
                        <CSFWidget.TextInput onChange={this.userPrefInputChange} text={this.state.userPrefTextValue} />
                    </div>
                    <CSFWidget.Button
                        text="Save!"
                        onClick={this.saveUserPrefText}
                        isCallToAction={true}
                    />
                </div>
                <div className="csp-demo-page-section">
                    <div className="csp-demo-page-label">
                        Click the button below to go to the Dashboard page
                    </div>
                    <div className="csp-demo-page__link">
                        <CSFWidget.Button
                            text="To Dashboard"
                            onClick={this.navigate}
                            isCallToAction={true}
                        />
                    </div>

                </div>
            </div>
        );
    }
}

export default DemoPage;

DemoPage.propTypes = {
    siteDefinition: PropTypes.object.isRequired,
    userRoles: PropTypes.object.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    userPrefs: PropTypes.object.isRequired,
    updateUserPrefs: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired
};

DemoPage.defaultProps = {

};