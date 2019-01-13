import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { ajax } from 'rxjs/observable/dom/ajax';

import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';

import { rootEpic, rootReducer } from './root';

function getUrlBaseName() {
    let site;
    const siteParam = window.location.search.slice(1).split('=');

    if (siteParam !== null && siteParam[1]) {
        site = siteParam[1];
    } else {
        site = /portal\/(\w+)\/*/.exec(location.href)[1];
    }
    return '/portal/' + site;
}

export const history = createHistory({
    basename: getUrlBaseName()
});
const middleware = routerMiddleware(history);

const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: { getJSON: ajax.getJSON }
});
const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(epicMiddleware, middleware)
);

export default store;