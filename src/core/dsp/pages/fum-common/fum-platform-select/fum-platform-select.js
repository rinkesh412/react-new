import React from 'react';
import PropTypes from 'prop-types';

export default class FumPlatformSelect extends React.Component {
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
                <div>
                   <h1> Select Platform </h1> 
                </div>
                <div>
                   
                </div>
            </div>
        );
    }
}

FumPlatformSelect.propTypes = {

}