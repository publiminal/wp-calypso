/**
 * External dependencies
 */
var debug = require( 'debug' )( 'calypso:lib:security-checkup:account-recovery-store' ),
	assign = require( 'lodash/object/assign' ),
	remove = require( 'lodash/array/remove' );

/**
 * Internal dependencies
 */
var Dispatcher = require( 'dispatcher' ),
	emitter = require( 'lib/mixins/emitter' ),
	i18n = require( 'lib/mixins/i18n' ),
	actions = require( './constants' ).actions,
	me = require( 'lib/wp' ).undocumented().me();

var _initialized = false,
	_loading = false,
	_phone = {
		step: 'recoveryPhone',
		isSendingCode: false,
		isRemovingPhone: false,
		isVerifyingPhone: false,
		lastNotice: false,
		data: {}
	},
	_emails = {
		step: 'recoveryEmail',
		isSavingEmail: false,
		lastNotice: false,
		data: {}
	};

var AccountRecoveryStore = {
	getPhoneStep: function() {
		return _phone.step;
	},

	getEmailsStep: function() {
		return _emails.step;
	},

	isSavingRecoveryEmail: function() {
		return _emails.isSavingEmail;
	},

	isSendingCode: function() {
		return _phone.isSendingCode;
	},

	isVerifyingCode: function() {
		return _phone.isVerifyingCode;
	},

	isRemovingPhone: function() {
		return _phone.isRemovingPhone;
	},

	getEmails: function() {
		fetchFromAPIIfNotInitialized();

		return assign( {
			loading: _loading
		}, _emails );
	},

	getPhone: function() {
		fetchFromAPIIfNotInitialized();

		return assign( {
			loading: _loading
		}, _phone );
	},

	getEmailsNotice: function() {
		return _emails.lastNotice;
	},

	getPhoneNotice: function() {
		return _phone.lastNotice;
	}
};

function emitChange() {
	AccountRecoveryStore.emit( 'change' );
}

function fetchFromAPIIfNotInitialized() {
	if ( _initialized ) {
		return;
	}

	_initialized = true;
	fetchFromAPI();
}

function fetchFromAPI() {
	if ( _loading ) {
		return;
	}

	_loading = true;
	me.getAccountRecovery( function( error, data ) {
		_loading = false;

		if ( error ) {
			handleError( error );
			return;
		}

		handleResponse( data );
	} );
}

function handleResponse( data ) {
	if ( data.phone ) {
		_phone.data = {
			countryCode: data.phone.country_code,
			countryNumericCode: data.phone.country_numeric_code,
			number: data.phone.number,
			numberFull: data.phone.number_full
		};
	}

	if ( data.emails ) {
		_emails.data = data.emails
	}

	emitChange();
}

function handleError( error ) {
	setEmailsNotice( error.message, 'error' );
	setPhoneNotice( error.message, 'error' );
	emitChange();
}

function removeEmail( deletedEmail ) {
	_emails.data = remove( _emails.data, function( recoveryEamil ) {
		return recoveryEamil !== deletedEmail;
	} );

	emitChange();
}

function setEmailsNotice( message, type ) {
	_emails.lastNotice = {
		type: type,
		message: message
	};
}

function resetEmailsNotice() {
	_emails.lastNotice = false;
}

function setPhoneNotice( message, type ) {
	_phone.lastNotice = {
		type: type,
		message: message
	};
}

function resetPhoneNotice() {
	_phone.lastNotice = false;
}

AccountRecoveryStore.dispatchToken = Dispatcher.register( function( payload ) {
	var action = payload.action;
	debug( 'action triggered', action.type, payload );

	switch ( action.type ) {
		case actions.ADD_ACCOUNT_RECOVERY_EMAIL:
			_emails.step = 'addRecoveryEmail';
			emitChange();
			break;

		case actions.CANCEL_ACCOUNT_RECOVERY_EMAIL:
			_emails.step = 'recoveryEmail';
			emitChange();
			break;

		case actions.SAVE_ACCOUNT_RECOVERY_EMAIL:
			_emails.isSavingEmail = true;
			emitChange();
			break;

		case actions.RECEIVE_SAVED_ACCOUNT_RECOVERY_EMAIL:
			_emails.isSavingEmail = false;
			if ( action.error ) {
				_emails.lastNotice = { type: 'error', message: action.error.message };
				emitChange();
				break;
			}

			_emails.step = 'recoveryEmail';
			_emails.lastNotice = { type: 'success', message: i18n.translate( 'We have sent you verification email. please verify.' ) };
			emitChange();
			break;

		case actions.DELETE_ACCOUNT_RECOVERY_EMAIL:
			emitChange();
			break;

		case actions.RECEIVE_DELETED_ACCOUNT_RECOVERY_EMAIL:
			if ( action.error ) {
				_emails.lastNotice = { type: 'error', message: action.error.message };
				emitChange();
				break;
			}

			removeEmail( action.email );
			emitChange();
			break;

		case actions.EDIT_ACCOUNT_RECOVERY_PHONE:
			_phone.step = 'editRecoveryPhone';
			emitChange();
			break;

		case actions.CANCEL_ACCOUNT_RECOVERY_PHONE:
			_phone.step = 'recoveryPhone';
			emitChange();
			break;

		case actions.SAVE_ACCOUNT_RECOVERY_PHONE:
			_phone.isSendingCode = true;
			emitChange();
			break;

		case actions.RECEIVE_SAVED_ACCOUNT_RECOVERY_PHONE:
			_phone.isSendingCode = false;
			if ( action.error ) {
				_phone.lastNotice = { type: 'error', message: action.error.message };
				emitChange();
				break;
			}

			_phone.step = 'verifyRecoveryPhone';
			emitChange();
			break;

		case actions.VERIFY_ACCOUNT_RECOVERY_PHONE:
			_phone.isVerifyingCode = true;
			emitChange();
			break;

		case actions.RECEIVE_VERIFIED_ACCOUNT_RECOVERY_PHONE:
			_phone.isVerifyingCode = false;
			if ( action.error ) {
				_phone.lastNotice = { type: 'error', message: action.error.message };
				emitChange();
				break;
			}

			_phone.data = action.phoneData;
			_phone.step = 'recoveryPhone';
			emitChange();
			break;

		case actions.DELETE_ACCOUNT_RECOVERY_PHONE:
			_phone.isRemovingPhone = true;
			emitChange();
			break;

		case actions.RECEIVE_DELETED_ACCOUNT_RECOVERY_PHONE:
			_phone.isRemovingPhone = false;
			if ( action.error ) {
				_phone.lastNotice = { type: 'error', message: action.error.message };
				emitChange();
				break;
			}

			_phone.step = 'recoveryPhone';
			_phone.data = {};
			emitChange();
			break;

		case actions.DISMISS_ACCOUNT_RECOVERY_EMAILS_NOTICE:
			resetEmailsNotice();
			emitChange();
			break;

		case actions.DISMISS_ACCOUNT_RECOVERY_PHONE_NOTICE:
			resetPhoneNotice();
			emitChange();
			break;
	}
} );

emitter( AccountRecoveryStore );

module.exports = AccountRecoveryStore;
