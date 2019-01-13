import React, { Component } from "react";

// import CautionItem from './dsp/steps/broadcast-push-steps/caution-broadcast-push/caution-item';
// import Hour from './dsp/pages/sbp-hourly-push/hourly-push-layout';
// import WidgetWrapper from './uscc/widget-wrapper/widget-wrapper';
// import WorkFlowExecuteWidget from './workflow-execute-widget/workflow-execute-widget.layout';
// import RowColSpan from './dsp/steps/broadcast-push-test/RowspanColSpan';
// import Create from './dsp/pages/sbp-control/sbp-sms-control-page.layout';
// import Test from './dsp/pages/sbp-test/sbp-sms-push-test-page.layout';

//import UploadMainArchive from './dsp/components/upload-archive/upload-archive';
import DeleteResultOperator from "./dsp/components/delete-result-operator/delete-result-operator";
export class CustomWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <DeleteResultOperator />
      </div>
    );
  }
}
export default CustomWrapper;
