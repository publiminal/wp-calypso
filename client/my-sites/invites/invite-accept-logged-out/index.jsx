/**
 * External dependencies
 */
import React from 'react'
import get from 'lodash/object/get'

/**
 * Internal dependencies
 */
import SignupForm from 'components/signup-form'
import InviteFormHeader from 'my-sites/invites/invite-form-header'
import { createAccount, acceptInvite } from 'lib/invites/actions'
import WpcomLoginForm from 'signup/wpcom-login-form'
import config from 'config'

export default React.createClass( {

	displayName: 'InviteAcceptLoggedOut',

	getInitialState() {
		return { error: false, bearerToken: false, userData: false, submitting: false };
	},

	getRedirectToAfterLoginUrl() {
		return '/accept-invite';
	},

	submitButtonText() {
		return this.translate( 'Sign Up & Join' );
	},

	submitForm( form, userData ) {
		this.setState( { submitting: true } );
		createAccount(
			userData,
			( error, bearerToken ) =>
				bearerToken &&
				acceptInvite(
					this.props.invite,
					( acceptInviteError ) => this.setState( { acceptInviteError, userData, bearerToken } ),
					bearerToken
				)
		);
	},

	renderFormHeader() {
		return (
			<InviteFormHeader { ...this.props } />
		);
	},

	renderLoginForm() {
		const { userData, bearerToken } = this.state;
		return (
			<WpcomLoginForm
				log={ userData.username }
				authorization={ 'Bearer ' + bearerToken }
				redirectTo={ this.props.redirectTo }
			/>
		)
	},

	subscribeUserByEmailOnly() {
		this.setState( { submitting: true } );
		acceptInvite(
			this.props.invite,
			( error ) => {
				if ( error ) {
					this.setState( { error } );
				} else {
					window.location = 'https://subscribe.wordpress.com/?update=activated';
				}
			},
			null,
			this.props.subscriptionActivationKey
		);
	},

	renderEmailOnlySubscriptionLink() {
		if ( this.props.invite.meta.role !== 'follower' || ! this.props.subscriptionActivationKey ) {
			return null;
		}

		return (
			<a onClick={ this.subscribeUserByEmailOnly } className="logged-out-form__link">
				{ this.translate( 'Or follow by email subscription only.' ) }
			</a>
		);
	},

	renderFooterLink() {
		let logInUrl = config( 'login_url' ) + '?redirect_to=' + encodeURIComponent( window.location.href );
		return (
			<div>
				<a href={ logInUrl } className="logged-out-form__link">
					{ this.translate( 'Already have a WordPress.com account? Log in now.' ) }
				</a>
				{ this.renderEmailOnlySubscriptionLink() }
			</div>
		);
	},

	render() {
		return (
			<div>
				<SignupForm
					getRedirectToAfterLoginUrl={ this.getRedirectToAfterLoginUrl }
					disabled={ this.state.submitting }
					formHeader={ this.renderFormHeader() }
					submitting={ this.state.submitting }
					save={ this.save }
					submitForm={ this.submitForm }
					submitButtonText={ this.submitButtonText() }
					footerLink={ this.renderFooterLink() }
					email={ get( this.props, 'invite.meta.sent_to' ) }
				/>
				{ this.state.userData && this.renderLoginForm() }
			</div>
		)
	}

} );
