import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormLayout, Button, TextInput, Label, CheckBox, CalendarNew } from '@nokia-csf-uxr/csfWidgets';
import AutoComplete from '../../../components/model-name-autocomplete/model-name-autocomplete';
import { formatI18N } from '../../../services/i18n-label-service';
import SearchResult from '../fota-um-search-result-op/fota-um-search-result-op';
import './fota-um-search-archive-op.styl';

export default class FumSearchArchiveOP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_auto: ['test1','test2','test3'],
            modelName: '',
            enteredModel: '',
            subModel: '',
            tac: '',
            crVer: '',
            startPubDate: null,
            endPubDate: null,
            isStartOpen: false,
            isEndOpen: false,
            showSearchResult: false,
            modelLabel: formatI18N('sbp.history.modelIdLabel'),

        }
    }
    handleChange = userInput => {
        this.setState({ modelName: userInput });
    }
    userType = userInput => {
        this.setState({ enteredModel: userInput });
    }
    onChangeSubModel = subModel => {
        this.setState({ subModel: subModel.value});
    }
    onChangeTac = tac => {
        this.setState({ tac: tac.value});
    }
    onChangeCrVer = crver => {
        this.setState({ crVer: crver.value});
    }
    validateSearchCondition = () => {
        this.setState({showSearchResult: true});

    }
    onGridReady = params => {
        this.api = params.value.api;
        this.api.sizeColumnsToFit();
    }
    render() {
        const { startPubDate, endPubDate, isStartOpen, isEndOpen } = this.state;
        return(
            <div>
                <FormLayout>
                    <div className="row">
                            <div className="col-sm-2 label_width1">
                                <Label id="modelId" text={this.state.modelLabel} />
                            </div>
                            <div className="col-sm-3">
                                <AutoComplete suggestionsList={this.state.data_auto} callBackFromParent={this.handleChange} modelName={this.state.modelName} userTypedModelName={this.userType} />
                            </div>
                    </div>
                    <div className="row">
                            <div className="col-sm-2 label_width">
                                <Label id="submodelLabelId" text="Submodel Name" />
                            </div>
                            <div className="col-sm-3">
                                <TextInput  id="submodelTextId" text={this.state.subModel} onChange={this.onChangeSubModel}/>
                            </div>
                    </div>
                    <div className="row">
                            <div className="col-sm-2 label_width">
                                <Label id="tacLabelId" text="TAC" />
                            </div>
                            <div className="col-sm-3">
                                <TextInput  id="tacTextId" text={this.state.tac} onChange={this.onChangeTac}/>
                            </div>
                    </div>
                    <div className="row">
                            <div className="col-sm-2 label_width">
                                <Label id="crLabelId" text="CRVer" />
                            </div>
                            <div className="col-sm-3">
                                <TextInput  id="crTextId" text={this.state.crVer} onChange={this.onChangeCrVer}/>
                            </div>
                    </div>
                    <div className="row">
                            <div className="col-sm-2 label_width">
                                <Label id="startPubDtLabelId" text="Date of Publish" />
                            </div>
                            <div className="col-sm-6">
                                <CalendarNew id="startPubDtId" position="top"
                                    isTimeFormat24Hr isOpen={isStartOpen} closeOnClickOutside locale="ja"
                                    field={{ isVisible: true, width: 250, hasOutline: true, format: '',
                                        dateIsBlockedMessage: 'Date is inactive', dateIsRequiredMessage: 'Date is required',
                                        toolTip: true, toolTipText: 'Search Start Date', displayTooltipOnFocus: true, }}
                                    timePicker={{ isVisible: true, isSecondPickerVisible: true }}
                                    date={startPubDate} onChange={this.onChangeStartDate}
                                    modal={{ isModal: false }} required={true}
                                />
                            </div>
                    </div>
                    <div className="row">
                            <div className="col-sm-2 label_width">
                                <Label id="endPubDtLabelId" text="Date of Stop Publish" />
                            </div>
                            <div className="col-sm-6">
                                <CalendarNew id="endDateId" position="top"
                                    isTimeFormat24Hr isOpen={isEndOpen} closeOnClickOutside locale="ja"
                                    field={{ isVisible: true, width: 250, hasOutline: true, format: '' }}
                                    timePicker={{ isVisible: true, isSecondPickerVisible: true }}
                                    date={endPubDate} onChange={this.onChangeEndDate}
                                    modal={{ isModal: false }} required={true}
                                />
                            </div>
                    </div>
                    <div className="button-story__column">
                        <Button id="searchBtn" text="Search" onClick={this.validateSearchCondition} isCallToAction />
                    </div>
                </FormLayout>
                { (this.state.showSearchResult) ?
                    <SearchResult nextModeChange={this.props.nextModeChange}/>
                : null }
            </div>
        );
    }
}
FumSearchArchiveOP.propTypes = {
    nextModeChange: PropTypes.func.isRequired,  
}