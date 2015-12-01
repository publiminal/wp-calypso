/**
 * Internal dependencies
 */
import {
	TOGGLE_EXPORTER_ADVANCED_SETTINGS,
	TOGGLE_EXPORTER_SECTION,
	REQUEST_START_EXPORT,
	REPLY_START_EXPORT,
	FAIL_START_EXPORT,
	FAIL_EXPORT,
	COMPLETE_EXPORT
} from '../action-types';

/**
 * Toggle the visibility of the Advanced Settings panel
 * @return {Function}        Action object
 */
export function toggleAdvancedSettings() {
	return {
		type: TOGGLE_EXPORTER_ADVANCED_SETTINGS
	};
}

/**
 * Toggles whether a section of the export is enabled.
 *
 * @param  {Object} section   The name of the section to toggle - 'posts', 'pages', or 'feedback'
 * @return {Object}           Action object
 */
export function toggleSection( section ) {
	return {
		type: TOGGLE_EXPORTER_SECTION,
		section
	};
}

/**
 * Sends a request to the server to start an export.
 *
 * @param  {number} siteId    The ID of the site for which to begin the export
 * @return {Function}         Action thunk
 */
export function startExport( siteId ) {
	return ( dispatch ) => {

		dispatch( {
			type: REQUEST_START_EXPORT
		} );

		setTimeout( () => {
			dispatch( replyStartExport( siteId ) );
		}, 400 );

		setTimeout( () => {
			dispatch( completeExport( siteId, 'https://calypso.localhost:3000/' ) );
		}, 1800 );

	}
}

export function replyStartExport( siteId ) {
	return {
		type: REPLY_START_EXPORT,
		siteId: siteId
	}
}

export function completeExport( siteId, downloadURL ) {
	return {
		type: COMPLETE_EXPORT,
		downloadURL: downloadURL,
		siteId: siteId
	}
}
