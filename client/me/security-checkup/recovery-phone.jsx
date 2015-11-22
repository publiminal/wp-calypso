/**
 * External dependencies
 */
import React from 'react';
import isEmpty from 'lodash/lang/isEmpty';

/**
 * Internal dependencies
 */
import AccountRecoveryStore from 'lib/security-checkup/account-recovery-store';
import SecurityCheckupActions from 'lib/security-checkup/actions';
import FormSectionHeading from 'components/forms/form-section-heading';
import FormButton from 'components/forms/form-button';
import FormButtonsBar from 'components/forms/form-buttons-bar';
import FormLabel from 'components/forms/form-label';
import FormPhoneInput from 'components/forms/form-phone-input';
import FormTextInput from 'components/forms/form-text-input';
import FormInputValidation from 'components/forms/form-input-validation';
import countriesList from 'lib/countries-list';
import Gridicon from 'components/gridicon';
import Notice from 'components/notice';

module.exports = React.createClass( {
	displayName: 'SecurityCheckupRecoveryPhone',

	mixins: [ React.addons.LinkedStateMixin ],

	componentDidMount: function() {
		AccountRecoveryStore.on( 'change', this.refreshRecoveryPhone );
	},

	componentWillUnmount: function() {
		AccountRecoveryStore.off( 'change', this.refreshRecoveryPhone );
	},

	getInitialState: function() {
		return {
			recoveryPhone: AccountRecoveryStore.getPhone(),
			recoveryPhoneStep: AccountRecoveryStore.getPhoneStep(),
			recoveryPhoneValidationError: '',
			verificationCode: '',
			verificationCodeValidationError: ''
		};
	},

	refreshRecoveryPhone: function() {
		this.setState( {
			recoveryPhone: AccountRecoveryStore.getPhone(),
			recoveryPhoneStep: AccountRecoveryStore.getPhoneStep()
		} );
	},

	editPhone: function() {
		SecurityCheckupActions.editPhone();
	},

	deletePhone: function() {
		SecurityCheckupActions.deletePhone();
	},

	savePhone: function() {
		var countryCode = '';
		var phoneNumber = '';

		// clear validation error
		this.setState( { recoveryPhoneValidationError: '' } );

		if ( this.state.recoveryPhone.data.number && this.state.recoveryPhone.data.countryCode ) {
			countryCode = this.state.recoveryPhone.data.countryCode;
			phoneNumber = this.state.recoveryPhone.data.number;
		}

		if ( ! isEmpty( this.state.phoneNumber ) ) {
			countryCode = this.state.phoneNumber.countryData.code;
			phoneNumber = this.state.phoneNumber.phoneNumber;
		}

		if ( ( this.state.phoneNumber && ! this.state.phoneNumber.isValid ) || ! phoneNumber || ! countryCode ) {
			this.setState( { recoveryPhoneValidationError: this.translate( 'Please enter a valid phone number.' ) } );
			return;
		}

		SecurityCheckupActions.savePhone( countryCode, phoneNumber );
	},

	verifyCode: function() {
		var phoneData = this.state.recoveryPhone;

		// clear validation error
		this.setState( { verificationCodeValidationError: '' } );

		if ( this.state.verificationCode.length !== 7 ) {
			this.setState( { verificationCodeValidationError: this.translate( 'Please enter a valid code.' ) } );
			return;
		}

		if ( ! isEmpty( this.state.phoneNumber ) ) {
			phoneData = {
				countryCode: this.state.phoneNumber.countryData.code,
				countryNumericCode: this.state.phoneNumber.countryData.numeric_code,
				number: this.state.phoneNumber.phoneNumber,
				numberFull: this.state.phoneNumber.phoneNumberFull
			};
		}

		SecurityCheckupActions.verifyPhone( this.state.verificationCode, phoneData );
	},

	cancel: function() {
		// clear validation errors
		this.setState( { recoveryPhoneValidationError: '' } );
		this.setState( { verificationCodeValidationError: '' } );

		SecurityCheckupActions.cancelPhone();
	},

	onChangePhoneInput: function( phoneNumber ) {
		this.setState( { phoneNumber } );
	},

	recoveryPhonePlaceHolder: function() {
		return (
			<div className="security-checkup__recovery-phone-placholder">
				<FormSectionHeading>Recovery phone placeholder</FormSectionHeading>
				<p className="security-checkup__recovery-phone">Recovery phone placeholder</p>
			</div>
		);
	},

	getRecoveryPhone: function() {
		if ( isEmpty( this.state.recoveryPhone.data.number ) ) {
			return(
				<p>No recovery phone</p>
			);
		}

		return (
			<p className="security-checkup__recovery-phone-full-number">{ this.state.recoveryPhone.data.numberFull }</p>
		);
	},

	recoveryPhone: function() {
		return (
			<div className="security-checkup__recovery-phone">
				<FormSectionHeading>Recovery phone</FormSectionHeading>
				{ this.getRecoveryPhone() }
				<FormButton onClick={ this.editPhone } isPrimary={ false } >
					{ isEmpty( this.state.recoveryPhone.data.number ) ? this.translate( 'Add Phone' ) : this.translate( 'Edit Phone' ) }
				</FormButton>
			</div>
		);
	},

	renderRecoveryPhoneValidation: function() {
		if ( isEmpty( this.state.recoveryPhoneValidationError ) ) {
			return null;
		}

		return (
			<FormInputValidation isError={ true } text={ this.state.recoveryPhoneValidationError } />
		);
	},

	displayDeletePhoneButton: function() {
		if ( isEmpty( this.state.recoveryPhone.data.number ) ) {
			return null;
		}

		return(
			<button className="security-checkup__recovery-phone-remove" onClick={ this.deletePhone }>
				<Gridicon icon="trash" size={ 16 } />
				<span>{ AccountRecoveryStore.isRemovingPhone() ? this.translate( 'Removing' ) : this.translate( 'Remove' ) }</span>
			</button>
		);
	},

	editRecoveryPhone: function() {
		return (
			<div className="security-checkup__edit-recovery-phone">
				<FormPhoneInput
					countriesList={ countriesList.forSms() }
					initialCountryCode={ this.state.recoveryPhone.data.countryCode }
					initialPhoneNumber={ this.state.recoveryPhone.data.number }
					onChange={ this.onChangePhoneInput }
					/>
				{ this.renderRecoveryPhoneValidation() }
				<FormButtonsBar>
					{ this.displayDeletePhoneButton() }
					<FormButton onClick={ this.savePhone } >
						{ AccountRecoveryStore.isSendingCode() ? this.translate( 'Sending code' ) : this.translate( 'Send code' ) }
					</FormButton>
					<FormButton onClick={ this.cancel } isPrimary={ false } >
						{ this.translate( 'Cancel' ) }
					</FormButton>
				</FormButtonsBar>
			</div>
		);
	},

	verfiyRecoveryPhone: function() {
		return (
			<div className="security-checkup__verify-recovery-phone">
				<FormLabel>{ this.translate( 'Enter the code you receive via SMS:' ) }</FormLabel>
				<FormTextInput valueLink={ this.linkState( 'verificationCode' ) } ></FormTextInput>
				<FormButtonsBar>
					<FormButton onClick={ this.verifyCode } >
						{ AccountRecoveryStore.isVerifyingCode() ? this.translate( 'Verifying code' ) : this.translate( 'Verify code' ) }
					</FormButton>
					<FormButton onClick={ this.cancel } isPrimary={ false } >
						{ this.translate( 'Cancel' ) }
					</FormButton>
				</FormButtonsBar>
			</div>
		);
	},

	dismissPhoneNotice: function() {
		SecurityCheckupActions.dismissPhoneNotice();
	},

	renderRecoveryPhoneNotice: function() {
		var phoneNotice = AccountRecoveryStore.getPhoneNotice;

		if ( isEmpty( phoneNotice ) ) {
			return null;
		}

		switch ( phoneNotice.type ) {
			case 'success':
				return (
					<Notice status="is-success" text={ phoneNotice.message } onClick={ this.dismissPhoneNotice } isCompact={ true } />
				);
			case 'error':
				return (
					<Notice status="is-error" text={ phoneNotice.message } onClick={ this.dismissPhoneNotice } isCompact={ true } />
				);
			default:
				return null;
		}
	},

	getRecoveryPhoneScreen: function() {
		if ( this.state.recoveryPhone.loading ) {
			return this.recoveryPhonePlaceHolder();
		}

		switch ( this.state.recoveryPhoneStep ) {
			case 'recoveryPhone':
				return this.recoveryPhone();
			case 'editRecoveryPhone':
				return this.editRecoveryPhone();
			case 'verifyRecoveryPhone':
				return this.verfiyRecoveryPhone();
			default:
				return this.recoveryPhone();
		}
	},

	render: function() {
		return (
			<div className="security-checkup__recovery-phone-container">
				{ this.renderRecoveryPhoneNotice() }
				{ this.getRecoveryPhoneScreen() }
			</div>
		);
	}
} );
