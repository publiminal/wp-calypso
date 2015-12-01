/**
 * External dependencies
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Exporter from './exporter';
import {
	toggleAdvancedSettings,
	toggleSection,
	startExport
} from 'lib/site-settings/exporter/actions';

import { canStartExport } from 'lib/site-settings/exporter/selectors';

class ExporterContainer extends Component {
	render() {
		const { dispatch, advancedSettings, site, canStartExport } = this.props;
		return (
			<Exporter
				site={ site }
				advancedSettings={ advancedSettings }
				canStartExport={ canStartExport }
				toggleAdvancedSettings={ () => dispatch( toggleAdvancedSettings() ) }
				toggleSection={ ( section ) => dispatch( toggleSection( section ) ) }
				startExport={ () => startExport( 0 )( dispatch ) } />
		);
	}
}

function select( state, props ) {
	return {
		advancedSettings: state.siteSettings.exporter.ui.toJS().advancedSettings,
		canStartExport: canStartExport( state, 0 )
	}
}

ExporterContainer.propTypes = {
	site: PropTypes.shape( {
		ID: PropTypes.number.isRequired
	} ),
	dispatch: PropTypes.func.isRequired
};

export default connect( select )( ExporterContainer );
