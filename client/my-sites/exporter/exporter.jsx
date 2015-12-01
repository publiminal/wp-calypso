/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import CompactCard from 'components/card/compact';
import Gridicon from 'components/gridicon';
import Button from 'components/forms/form-button';
import AdvancedOptions from 'my-sites/exporter/advanced-options';

export default React.createClass( {
	displayName: 'Exporter',

	render: function() {
		return (
			<div className="section-export">
				<CompactCard>
					<header>
						<Button
							className="exporter__export-button"
							disabled={ !this.props.canStartExport }
							isPrimary={ true }
							onClick={ this.props.startExport }
						>
							{ this.translate( 'Export' ) }
						</Button>
						<h1 className="exporter__title">
							{ this.translate( 'Download an Export File' ) }
						</h1>
					</header>
					<a href="#" onClick={ this.props.toggleAdvancedSettings }>
						<Gridicon
							icon={ this.props.advancedSettings.isVisible ? 'chevron-up' : 'chevron-down' }
							size={ 16 } />
						{ this.translate( 'Advanced Export Settings' ) }
					</a>
				</CompactCard>

				{
					this.props.advancedSettings.isVisible &&
					<AdvancedOptions
						{ ...this.props.advancedSettings }
						canStartExport={ this.props.canStartExport }
						onToggleFieldset={ this.props.toggleSection }
						onClickExport={ this.props.startExport }
					/>
				}
			</div>
		);
	}
} );
