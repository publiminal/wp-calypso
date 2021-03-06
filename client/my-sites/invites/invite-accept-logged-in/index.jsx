/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import Gravatar from 'components/gravatar';
import Button from 'components/button';
import config from 'config';
import userModule from 'lib/user';
import InviteFormHeader from 'my-sites/invites/invite-form-header';
import { acceptInvite } from 'lib/invites/actions';

const user = userModule();

export default React.createClass( {

	displayName: 'InviteAcceptLoggedIn',

	render() {
		let userObject = user.get(),
			signInLink = config( 'login_url' ) + '?redirect_to=' + encodeURIComponent( window.location.href );

		return (
			<div className={ classNames( 'logged-in-accept', this.props.className ) } >
				<Card>
					<InviteFormHeader { ...this.props } user={ user.get() } />
					<div className="invite-accept-logged-in__join-as">
						<Gravatar user={ userObject } size={ 72 } />
						{
							this.translate( 'Join as {{usernameWrap}}%(username)s{{/usernameWrap}}', {
								components: {
									usernameWrap: <span className="invite-accept-logged-in__join-as-username" />
								},
								args: {
									username: userObject && userObject.display_name
								}
							} )
						}
					</div>
					<div className="invite-accept-logged-in__button-bar">
						<Button href={ window.location.origin + '?invite_declined' }>
							{ this.translate( 'Decline', { context: 'button' } ) }
						</Button>
						<Button primary onClick={ () => acceptInvite( this.props.invite ) } href={ this.props.redirectTo } >
							{ this.translate( 'Join', { context: 'button' } ) }
						</Button>
					</div>
				</Card>
				<a className="logged-in-accept__sign-in" href={ signInLink }>
					{ this.translate( 'Sign in as a different user' ) }
				</a>
			</div>
		);
	}
} );
