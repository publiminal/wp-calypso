/**
 * External dependencies
 */
import React from 'react';
import isEmpty from 'lodash/lang/isEmpty';
import emailValidator from 'email-validator';

/**
 * Internal dependencies
 */
import AccountRecoveryStore from 'lib/security-checkup/account-recovery-store';
import SecurityCheckupActions from 'lib/security-checkup/actions';
import FormSectionHeading from 'components/forms/form-section-heading';
import FormFieldSet from 'components/forms/form-fieldset';
import FormTextInput from 'components/forms/form-text-input';
import FormSettingExplanation from 'components/forms/form-setting-explanation';
import FormInputValidation from 'components/forms/form-input-validation';
import FormButtonsBar from 'components/forms/form-buttons-bar';
import FormButton from 'components/forms/form-button';
import ActionRemove from 'me/action-remove';
import Notice from 'components/notice';

module.exports = React.createClass( {
	displayName: 'SecurityCheckupRecoveryEmails',

	mixins: [ React.addons.LinkedStateMixin ],

	componentDidMount: function() {
		AccountRecoveryStore.on( 'change', this.refreshRecoveryEmails );
	},

	componentWillUnmount: function() {
		AccountRecoveryStore.off( 'change', this.refreshRecoveryEmails );
	},

	getInitialState: function() {
		return {
			recoveryEmail: '',
			recoveryEmails: AccountRecoveryStore.getEmails(),
			recoveryEmailValidationError: '',
			recoveryEmailStep: AccountRecoveryStore.getEmailsStep()
		};
	},

	refreshRecoveryEmails: function() {
		this.setState( {
			recoveryEmails: AccountRecoveryStore.getEmails(),
			recoveryEmailStep: AccountRecoveryStore.getEmailsStep()
		} );
	},

	addEmail: function() {
		// clear recoveryEmail
		this.setState( { recoveryEmail: '' } );

		SecurityCheckupActions.addEmail();
	},

	saveEmail: function() {
		// clear validation error
		this.setState( { recoveryEmailValidationError: '' } );

		if ( this.props.primaryEmail && this.state.recoveryEmail === this.props.primaryEmail ) {
			this.setState( { recoveryEmailValidationError: this.translate( 'You have entered your primary email address. Please enter a different email address.' ) } );
			return;
		}

		if ( ! emailValidator.validate( this.state.recoveryEmail ) ) {
			this.setState( { recoveryEmailValidationError: this.translate( 'Please enter a valid email address.' ) } );
			return;
		}

		SecurityCheckupActions.saveEmail( this.state.recoveryEmail );
	},

	deleteEmail: function( recoveryEmail ) {
		SecurityCheckupActions.deleteEmail( recoveryEmail );
	},

	cancelEmail: function() {
		// clear validation error
		this.setState( { recoveryEmailValidationError: '' } );

		SecurityCheckupActions.cancelEmail();
	},

	dismissEmailsNotice: function() {
		SecurityCheckupActions.dismissEmailsNotice();
	},

	renderRecoveryEmailsNotice: function() {
		var emailsNotice = AccountRecoveryStore.getEmailsNotice();

		if ( isEmpty( emailsNotice ) ) {
			return null;
		}

		switch ( emailsNotice.type ) {
			case 'success':
				return (
					<Notice status="is-success" text={ emailsNotice.message } onClick={ this.dismissEmailsNotice } isCompact={ true } />
				);
			case 'error':
				return (
					<Notice status="is-error" text={ emailsNotice.message } onClick={ this.dismissEmailsNotice } isCompact={ true } />
				);
			default:
				return null;
		}
	},

	renderRecoveryEmail: function( recoveryEmail ) {
		return (
			<li key={ recoveryEmail } className="security-checkup__recovery-email-container">
				<span className="security-checkup__recovery-email">{ recoveryEmail }</span>
				<ActionRemove onClick={ this.deleteEmail.bind( this, recoveryEmail ) } />
			</li>
		);
	},

	getRecoveryEmails: function() {
		if ( isEmpty( this.state.recoveryEmails.data ) ) {
			return(
				<p>No recovery emails</p>
			);
		}

		return (
			<ul className="security-checkup__recovery-emails-list">
				{ this.state.recoveryEmails.data.map( recoveryEmail => this.renderRecoveryEmail( recoveryEmail ) ) }
			</ul>
		);
	},

	renderRecoveryEmailsPlaceholder: function() {
		return(
			<div className="security-checkup__recovery-emails-placholder">
				<div className="security-checkup__recovery-emails">
					<FormSectionHeading>placeholder heading</FormSectionHeading>
					<ul className="security-checkup__recovery-emails-list">
						<li className="security-checkup__recovery-email">placeholder@placeholder.com</li>
					</ul>
				</div>
			</div>
		);
	},

	renderRecoveryEmails: function() {
		return(
			<div className="security-checkup__recovery-emails">
				<FormSectionHeading>{ this.translate( 'Recovery emails' ) }</FormSectionHeading>
				{ this.getRecoveryEmails() }
			</div>
		);
	},

	renderRecoveryEmailValidation: function() {
		if ( isEmpty( this.state.recoveryEmailValidationError ) ) {
			return null;
		}

		return(
			<FormInputValidation isError={ true } text={ this.state.recoveryEmailValidationError } />
		);
	},

	renderRecoveryEmailExplanation: function() {
		return(
			<FormSettingExplanation>{ this.translate( 'Your primary email address is {{email/}}. If your site belongs to an organization please add a generic backup email', { components: { email: <strong>{ this.props.primaryEmail }</strong> } } ) }</FormSettingExplanation>
		);
	},

	renderRecoveryEmailActions: function() {
		if ( this.state.recoveryEmailStep === 'addRecoveryEmail' ) {
			return(
				<div className="security-checkup__recovery-email-actions">
					<FormFieldSet>
						<FormTextInput valueLink={ this.linkState( 'recoveryEmail' ) } ></FormTextInput>
						{ this.renderRecoveryEmailValidation() }
						{ this.renderRecoveryEmailExplanation() }
					</FormFieldSet>
					<FormButtonsBar>
						<FormButton onClick={ this.saveEmail } >
							{ AccountRecoveryStore.isSavingRecoveryEmail() ? this.translate( 'Saving' ) : this.translate( 'Save' ) }
						</FormButton>
						<FormButton onClick={ this.cancelEmail } isPrimary={ false } >
							{ this.translate( 'Cancel' ) }
						</FormButton>
					</FormButtonsBar>
				</div>
			);
		}

		return(
			<div className="security-checkup__recovery-email-actions">
				<FormButton onClick={ this.addEmail } isPrimary={ false } >
					{ this.translate( 'Add Email' ) }
				</FormButton>
			</div>
		);
	},

	render: function() {
		if ( this.state.recoveryEmails.loading ) {
			return this.renderRecoveryEmailsPlaceholder();
		}

		return (
			<div className="security-checkup__recovery-emails-container">
				{ this.renderRecoveryEmailsNotice() }
				{ this.renderRecoveryEmails() }
				{ this.renderRecoveryEmailActions() }
			</div>
		);
	}
} );
