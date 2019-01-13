import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Button,
    SelectItem,
    TextInput,
    FormLayout
} from '@nokia-csf-uxr/csfWidgets';

import './approval-slide-out.layout.styl';

const initialState = {
    selectedRatePlan: '',
    selectedProduct: '',
    selectedPoolingAllowed: '',
    selectedRatePlanType: '',
    descriptionText: ''
};

export class USCCApprovalSlideOut extends Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.reject = this.reject.bind(this);
        this.approve = this.approve.bind(this);
        this.onCloseClick = this.onCloseClick.bind(this);
        this.onChangeProduct = this.onChangeProduct.bind(this);
        this.onChangePoolingAllowed = this.onChangePoolingAllowed.bind(this);
        this.onChangeRatePlanType = this.onChangeRatePlanType.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.getProduct = this.getProduct.bind(this);
        this.getPoolingAllowed = this.getPoolingAllowed.bind(this);
        this.getRatePlanType = this.getRatePlanType.bind(this);
        this.state = initialState;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.selectedData.Rate_Plan_Name === prevState.selectedRatePlan) {
            return null;
        }
        return {
            selectedRatePlan: nextProps.selectedData.Rate_Plan_Name
        };
    }

    submit(approvalState) {
        this.props.onSubmit(approvalState, this.state);
        this.onCloseClick();
    }

    reject() {
        this.submit('REJECTED');
    }

    approve() {
        this.submit('APPROVED');
    }

    onChangeProduct(evt) {
        this.setState({
            selectedProduct: evt.value
        });
    }

    onChangePoolingAllowed(evt) {
        this.setState({
            selectedPoolingAllowed: evt.value
        });
    }

    onChangeRatePlanType(evt) {
        this.setState({
            selectedRatePlanType: evt.value
        });
    }

    onChangeDescription(evt) {
        this.setState({
            descriptionText: evt.value
        });
    }

    getProduct() {
        return [
            { label: 'CDMA', value: 'CDMA' },
            { label: 'Dual mode', value: 'DUAL_MODE' }
        ];
    }

    getPoolingAllowed() {
        return [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
        ];
    }

    getRatePlanType() {
        return [
            { label: 'Shared', value: 'SHARED' },
            { label: 'Exclusive', value: 'EXCLUSIVE' }
        ];
    }

    onCloseClick() {
        this.setState(initialState);
        this.props.onCloseClick();
    }

    render() {
        const className = 'uscc-approval-slide-out-container' + (this.props.open ? ' uscc-approval-slide-out-container__open' : '');
        return (
            <div className={className} >
                <div className="uscc-approval-slide-out-container__background">
                    <div className="uscc-approval-slide-out-label-container">
                        {this.props.label}
                        <div className="uscc-approval-slide-out-label-container__button">
                            <Button
                                icon={this.props.getIconUrl('close')}
                                onClick={this.onCloseClick}
                            />
                        </div>
                    </div>
                    <div className="uscc-approval-slide-out-form-container">
                        <FormLayout>
                            <div className="row">
                                <div className="col-sm-6 uscc-approval-slide-out-form__rate-plan">
                                    <label className="top browser">Rate Plan</label>
                                    {this.props.selectedData.Rate_Plan_Name}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <SelectItem label="Product" data={this.getProduct()} selectedItem={this.state.selectedProduct} onChange={this.onChangeProduct} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <SelectItem label="Pooling Allowed" data={this.getPoolingAllowed()} selectedItem={this.state.selectedPoolingAllowed} onChange={this.onChangePoolingAllowed} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <SelectItem label="Rate Plan Type" data={this.getRatePlanType()} selectedItem={this.state.selectedRatePlanType} onChange={this.onChangeRatePlanType} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-11">
                                    <TextInput
                                        text={this.state.descriptionText}
                                        label="Desciption (Optional)"
                                        onChange={this.onChangeDescription}
                                    />
                                </div>
                            </div>
                            <div className="uscc-approval-slide-out-form-container__button">
                                <Button text="Reject" onClick={this.reject} isCallToAction={true} />
                                &nbsp;
                                <Button
                                    text="Approve"
                                    onClick={this.approve}
                                    isCallToAction={true}
                                    disabled={(this.state.selectedProduct && this.state.selectedPoolingAllowed !== '') ? false : true}
                                />
                            </div>
                        </FormLayout>
                    </div>
                </div>
            </div>
        );
    }
}

export default USCCApprovalSlideOut;
USCCApprovalSlideOut.propTypes = {
    open: PropTypes.bool,
    selectedData: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired
};

USCCApprovalSlideOut.defaultProps = {
    open: true
};