import React from 'react';
import ExpansionSteps from '../../components/expansion-steps/expansion-steps.layout';
import SBPTestCautionTextSelectionStep from '../../steps/sbp-test-sms-push/sbp-test-caution-text-selection/sbp-test-caution-text-selection';
import SBPTestMulticastPushStep from '../../steps/sbp-test-sms-push/sbp-test-multicast-push/sbp-test-multicast-push';
import SBPTestDeliveryResultStep from '../../steps/sbp-test-sms-push/sbp-test-delivery-result/sbp-test-delivery-result';
import PropTypes from 'prop-types';
import CommonUtils from '../../utils/common.utils';

export default class SBPTestSMSPushTest extends React.Component {
    constructor(props) {
        super(props);
        this.stepsMap = [ {
            title: CommonUtils.getLocaleText({ en: 'Caution Text Selection / Edit / Registration', ja: '喚起文選択・編集・新規登録'}),
            step: SBPTestCautionTextSelectionStep
        }, {
            title: CommonUtils.getLocaleText({ en: 'Multicast PUSH Test', ja: '同報PUSH試験'}),
            step: SBPTestMulticastPushStep
        }, {
            title: CommonUtils.getLocaleText({ en: 'SMS Delivery Result', ja: 'SMS配信結果'}),
            step: SBPTestDeliveryResultStep
        } ];
    }

    dataHandler = data => {
        console.log('parent data: ', data);
    }

    render() {
        return (
            <div style={{ backgroundColor: '#ccffcc' }}>
                <div style={{
                    height: "35px", width: "700px", fontFamily:
                    "Nokia Pure Text Medium", fontSize: "30px", fontWeight: 500, lineHeight: "21px", paddingBottom: "18px", paddingTop: "18px"
                    }}> {CommonUtils.getLocaleText({ en: 'SMS Broadcast PUSH Test', ja: 'SMS同報PUSH試験'}) }
                </div>
                <div>
                    { this.pageTitle || null }
                    <ExpansionSteps stepsMap={this.stepsMap} pageDataHandler={this.dataHandler} {...this.props} />
                </div>
            </div>
        );
    }
}

SBPTestSMSPushTest.propTypes = {
    pollingResponse: PropTypes.object,
    siteDefinition: PropTypes.object,
    getIconUrl: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired
};