import callAPIMiddleware from 'middlewares/apiMiddleware';
// import callWSMiddleware from 'middlewares/wsMiddleware';
import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import type { Middleware } from 'redux';
import thunk from 'redux-thunk';
import loginReducer, { IState as ILogin } from './login/reducer';
import mainReducer, { IState as IMain } from './main/reducer';

export interface IRootState {
    login: ILogin,
    main: IMain;
}

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const rootReducer = combineReducers<IRootState>({
    login: loginReducer,
    main: mainReducer,
    
});

export default function configureStore(preloadedState?: IRootState) {
    const middleware: Middleware[] = [callAPIMiddleware];

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const middlewareEnhancer = composeEnhancers(applyMiddleware(thunk, ...middleware));

    return createStore(rootReducer, preloadedState, middlewareEnhancer);
}
