import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import {  routerReducer } from 'react-router-redux';

import siteReducer from '../components/site/services/reducers/site.reducer';
import AuthenticationConfigurationReducer from '../services/auth/reducers/authConfig.reducer';
import SiteDefinitionReducer from '../services/siteDefinition/reducers/siteDefinition.reducer';
import WorkflowExecutionReducer from '../components/common/workflow/services/reducers/workflowExecution.reducer';
import SystemStatusReducer from '../components/common/systemStatus/reducer/system-status.reducer';
import PollingResponseReducer from '../service-operations/engines/polling-response.reducer';
import NotesReducer from '../components/site/notes/services/reducers/notes.reducer';
import HistoryReducer from '../components/common/history/services/reducers/history.reducer';
import WorkspaceReducer from '../components/site/layouts/workspace/services/reducers/workspace.reducer';
import CustomComponentsReducer from '../components/home/custom-components/services/reducers/custom-components.reducer';
import pluginRegistration from '../components/home/custom-components/services/modules/plugin-registration';

import { AuthenticationConfigurationEpic } from '../services/auth/epics/authConfig.epic';
import { SiteDefinitionEpic, DeleteSiteDefinitionEpic } from '../services/siteDefinition/epics/siteDefinition.epic';
import { ExecuteWorkFlowEpic,
        CreateWorkFlowEpic,
        FowardWorkFlowEpic,
        GetWorkFlowUpdateEpic,
        DeleteWorkFlowExecutionEpic
    } from '../components/common/workflow/services/epics/workflowExecution.epic';
import { GetNotes, SaveNotes } from '../components/site/notes/services/epics/notes.epic';
import { GetHistory } from '../components/site/layouts/dashboard/widgets/history/epics/history.epic';
import { GetSessionHistory } from '../components/site/layouts/workspace/panels/history/epics/session.epic';
import { GetWorkflowHistory } from '../components/site/layouts/workspace/panels/history/epics/workflowHistory.epic';
import { FetchWidgetDefinitionEpic } from '../services/widgetDefination/epics/widgetDefinition.epic';

export const rootEpic = combineEpics(
    AuthenticationConfigurationEpic,
    SiteDefinitionEpic,
    ExecuteWorkFlowEpic,
    CreateWorkFlowEpic,
    FowardWorkFlowEpic,
    GetWorkFlowUpdateEpic,
    DeleteWorkFlowExecutionEpic,
    DeleteSiteDefinitionEpic,
    GetNotes,
    SaveNotes,
    GetHistory,
    GetSessionHistory,
    GetWorkflowHistory,
    FetchWidgetDefinitionEpic
);

export const rootReducer = (state, action) => {
    if (action.type === 'SESSION_SIGN_OUT') {
        const { router, history, siteDefinition, authConfig } = state;
        state = { router, history, siteDefinition, authConfig };
    }
    return appReducer(state, action);
};

const appReducer = combineReducers({
    router: routerReducer,
    site: siteReducer,
    authConfig: AuthenticationConfigurationReducer,
    siteDefinition: SiteDefinitionReducer,
    workflowExecutions: WorkflowExecutionReducer,
    systemStatus: SystemStatusReducer,
    pollingResponse: PollingResponseReducer,
    notes: NotesReducer,
    workspace: WorkspaceReducer,
    history: HistoryReducer,
    customComponents: CustomComponentsReducer,
    pluginRegistration: pluginRegistration
});