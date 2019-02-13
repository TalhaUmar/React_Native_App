import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducers from '../reducers';
import { client } from '../config/ApolloClient';

export const store = createStore(
                        reducers, 
                        {}, 
                        applyMiddleware(ReduxThunk, createLogger(), client.middleware())
                    );
