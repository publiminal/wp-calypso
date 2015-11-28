/**
 * External dependencies
 */
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';

/**
 * Internal dependencies
 */
import reducers from './reducers';

const loggerMiddleware = createLogger();

export default () => {
	return applyMiddleware(
		thunkMiddleware,
		loggerMiddleware
	)( createStore )( reducers );
};
