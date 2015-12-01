import { States } from './constants.js';

/**
 * Indicates whether an export can be started
 *
 * @param  {Object} state    Global state tree
 * @return {boolean}         true if an export can be started
 */
export function canStartExport( state ) {
	const exportingState = state.siteSettings.exporter.ui.get( 'exportingState' );

	return ( exportingState === States.READY ||
	         exportingState === States.COMPLETED ||
	         exportingState === States.FAILED );
}

/**
 * Indicates whether an export activity is in progress.
 *
 * @param  {Object} state    Global state tree
 * @return {boolean}         true if activity is in progress
 */
export function shouldShowProgress( state ) {
	const exportingState = state.siteSettings.exporter.ui.get( 'exportingState' );

	return ( exportingState === States.STARTING ||
	         exportingState === States.EXPORTING );
}
