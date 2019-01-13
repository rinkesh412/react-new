import React from 'react';
import PropTypes from 'prop-types';
import ExpansionSteps from '../../components/expansion-steps/expansion-steps.layout';
import SBPModelSelectionStep from '../../steps/broadcast-push-steps/sbp-model-selection/sbp-model-selection';
import SBPCautionTextSelectionStep from '../../steps/broadcast-push-steps/sbp-caution-text-selection/sbp-caution-text-selection';
import SBPDeliverySettingsStep from '../../steps/broadcast-push-steps/sbp-delivery-settings/sbp-delivery-settings';
import SBPBroadcastStatusStep from '../../steps/broadcast-push-steps/sbp-broadcast-push-status/sbp-broadcast-push-status';

import CommonUtils from '../../utils/common.utils';

export default class SBPCreateSMSPushTask extends React.Component {
    constructor(props) {
        super(props);
        this.stepsMap = [ {
            title: CommonUtils.getLocaleText({ en: 'Model Selection', ja: '機種選択'}), 
            step: SBPModelSelectionStep
        },  {
            title: CommonUtils.getLocaleText({ en: 'Caution Text Selection / Edit / Registration', ja: '喚起文選択・編集・新規登録'}),
            step: SBPCautionTextSelectionStep
        }, {
            title: CommonUtils.getLocaleText({ en: 'SMS Delivery Settings', ja: 'SMS配信設定'}),
            step: SBPDeliverySettingsStep
        }, {
            title: CommonUtils.getLocaleText({ en: 'Broadcast PUSH Status', ja: '同報PUSH状況'}),
            step: SBPBroadcastStatusStep
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
                    }}
                > {CommonUtils.getLocaleText({ en: 'SMS Broadcast PUSH Control Management', ja: 'SMS同報PUSH制御管理'}) }
                </div>
                <div>
                    { this.pageTitle || null }
                    <ExpansionSteps stepsMap={this.stepsMap} pageDataHandler={this.dataHandler} {...this.props} />
                </div>
            </div>
        );
    }
}


SBPCreateSMSPushTask.propTypes={
    pollingResponse: PropTypes.object.isRequired,
    siteDefinition: PropTypes.object.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired
};