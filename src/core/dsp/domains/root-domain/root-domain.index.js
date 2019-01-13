let RootPageIndex = {};

RootPageIndex['RootHomePage'] = require('../../pages/root-home/root-home-page.layout').default;
RootPageIndex['NotFoundPage'] = require('../../pages/root-home/not-found-page.layout').default;
RootPageIndex['SBPCreateSMSPushTask'] = require('../../pages/sbp-control/sbp-sms-control-page.layout').default;
RootPageIndex['SBPExportResults'] = require('../../pages/sbp-history/sbp-history-output-form').default;
RootPageIndex['SBPManageSMSPushTask'] = require('../../pages/sbp-manage-broadcast/manage-broadcast-panel').default;
//  RootPageIndex['SBPManageSMSPushTask'] = require('../../pages/sbp-manage-broadcast/manage-broadcast-main-page/manage-broadcast-container').default;
RootPageIndex['SBPBlackOutWindow'] = require('../../pages/sbp-traffic/deliveryRegulation-layout').default;
RootPageIndex['SBPHourlyPushRate'] = require('../../pages/sbp-hourly-push/hourly-push-layout').default;
RootPageIndex['SBPTestSMSPushTest'] = require('../../pages/sbp-test/sbp-sms-push-test-page-layout').default;
RootPageIndex['FUMBlackOutWindow'] = require('../../pages/fota-um-blacklist/fota-um-blacklist-setup').default;
RootPageIndex['FUMMakerTestUploadArchive'] = require('../../pages/fota-um-test/fota-um-maker-test/fum-upload-archive-mkr').default;
RootPageIndex['FUMDcmTestUploadArchive'] = require('../../pages/fota-um-test/fota-um-docomo-test/fum-upload-archive-dcm').default;
RootPageIndex['FUMMakerTestUploadTestTargetList'] = require('../../pages/fota-um-test/fota-um-maker-test/fum-upload-test-target-list-mkr').default;
RootPageIndex['FUMDcmTestUploadTestTargetList'] = require('../../pages/fota-um-test/fota-um-docomo-test/fum-upload-test-target-list-dcm').default;
RootPageIndex['FUMHourlyPushRate'] = require('../../pages/fota-um-hourly-push/fum-hourly-push-layout').default;
RootPageIndex['FUMManageArchiveOp'] = require('../../pages/fota-um-operation/fota-um-manage-archive-op.layout').default;
RootPageIndex['FUMSelectPushMethod'] = require('../../pages/fota-um-operation/fota-um-select-push-op.layout').default;
RootPageIndex['FUMViewResults'] = require('../../pages/fota-um-operation/fota-um-view-results/fota-um-view-results').default;

export default RootPageIndex;