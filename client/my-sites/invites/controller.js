/**
 * External Dependencies
 */
import React from 'react';

/**
 * Internal Dependencies
 */
import i18n from 'lib/mixins/i18n';
import titleActions from 'lib/screen-title/actions';
import InviteAccept from 'my-sites/invites/invite-accept';
/**
 * Module variables
 */
let subscriptionActivationKey;

export default {
	saveSubscriptionActivationKey( context, next ) {
		if ( context.query.activate ) {
			subscriptionActivationKey = context.query.activate;
		}

		next();
	},

	acceptInvite( context ) {
		titleActions.setTitle( i18n.translate( 'Accept Invite', { textOnly: true } ) );

		React.unmountComponentAtNode( document.getElementById( 'secondary' ) );
		context.layout.setState( { noSidebar: true } );

		React.render(
			React.createElement(
				InviteAccept,
				Object.assign( context.params, { subscriptionActivationKey: subscriptionActivationKey } )
			),
			document.getElementById( 'primary' )
		);
	}
}
