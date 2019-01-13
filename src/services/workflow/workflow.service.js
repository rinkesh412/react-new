import store from '../../bootstrap/store';
import { addWorkflowExecutionAction } from '../../components/common/workflow/services/reducers/workflowExecution.reducer';
import { addWorkflowPanelAction } from '../../components/site/layouts/workspace/services/reducers/workspace.reducer';

export function executeWorkflow(workflow) {
    if (workflow.renderer.toLowerCase() === 'iframe') {
        store.dispatch(addWorkflowExecutionAction(workflow));
    } else {
        const panelObj = {
            type: 'workflowPanel',
            data: {
                workflowName: workflow.name
            }
        };
        store.dispatch(addWorkflowPanelAction(panelObj));
    }
}