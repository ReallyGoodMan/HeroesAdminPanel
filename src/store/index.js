import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import heroesReducer from '../components/heroesList/heroesSlice';
import filtersReducer from '../components/heroesFilters/filtersSlice';
import { configureStore} from '@reduxjs/toolkit';

const stringMiddleware = (store) => (next) => (action) => {
    if(typeof action === 'string') {
        return next({
            type: action
        })
    }
    return next(action)
};

const enhancer = (createStore) => (...args) => {
    const store = createStore(...args);

    const oldDispatch = store.dispatch;
    store.dispatch = (action) => {
        if(typeof action === 'string') {
            return oldDispatch({
                type: action
            })
        }
        return oldDispatch(action)
    }
    return store;
}

// const store = createStore( 
//     combineReducers({heroesReducer: heroesReducer, filtersReducer: filtersReducer}), 
//     //compose(enhancer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
//     compose(applyMiddleware(ReduxThunk, stringMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
//     );

const store = configureStore({
    reducer: {heroesReducer: heroesReducer, filtersReducer: filtersReducer},
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV !== 'production'    
});

export default store;