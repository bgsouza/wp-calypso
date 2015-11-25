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
import FormFieldSet from 'components/forms/form-fieldset';
import FormTextInput from 'components/forms/form-text-input';
import FormSettingExplanation from 'components/forms/form-setting-explanation';
import FormButtonsBar from 'components/forms/form-buttons-bar';
import FormButton from 'components/forms/form-button';
import ActionRemove from 'me/action-remove';

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
			isAddingRecoveryEmail: false,
			isSavingRecoveryEmail: false
		};
	},

	refreshRecoveryEmails: function() {
		this.setState( {
			recoveryEmails: AccountRecoveryStore.getEmails(),
			isSavingRecoveryEmail: AccountRecoveryStore.isSavingRecoveryEmail()
		} );
	},

	addEmail: function() {
		this.setState( { isAddingRecoveryEmail: true } );
	},

	saveEmail: function() {
		SecurityCheckupActions.updateEmail( this.state.recoveryEmail );
		this.setState( { isAddingRecoveryEmail: false } );
	},

	cancelEmail: function() {
		this.setState( { isAddingRecoveryEmail: false } );
	},

	renderRecoveryEmail: function( recoveryEmail ) {
		return (
			<li key={ recoveryEmail } >
				{ recoveryEmail.email }
				<ActionRemove />
			</li>
		);
	},

	getRecoveryEmails: function() {
		if ( this.state.recoveryEmails.loading ) {
			return(
				<p>No recovery emails</p>
			);
		}

		if ( isEmpty( this.state.recoveryEmails.data ) ) {
			return(
				<p>No recovery emails</p>
			);
		}

		return (
			<ul>
				{ this.state.recoveryEmails.data.map( recoveryEmail => this.renderRecoveryEmail( recoveryEmail ) ) }
			</ul>
		);
	},

	renderRecoveryEmails: function() {
		return(
			<div>
				<FormSectionHeading>Recovery emails placeholder</FormSectionHeading>
				{ this.getRecoveryEmails() }
			</div>
		);
	},

	renderRecoveryEmailActions: function() {
		if ( this.state.recoveryEmails.loading ) {
			return(
				<FormButton onClick={ this.addEmail } isPrimary={ false } >
					{ this.translate( 'Place holder' ) }
				</FormButton>
			);
		}

		if ( this.state.isAddingRecoveryEmail ) {
			return(
				<div>
					<FormFieldSet>
						<FormTextInput valueLink={ this.linkState( 'recoveryEmail' ) } ></FormTextInput>
						<FormSettingExplanation>{ this.translate( 'Your primary email address is {{email/}}', { components: { email: <strong>n.prasath.002@gmail.com</strong> } } ) }</FormSettingExplanation>
					</FormFieldSet>
					<FormButtonsBar>
						<FormButton onClick={ this.saveEmail } >
							{ this.state.submittingForm ? this.translate( 'Saving' ) : this.translate( 'Save' ) }
						</FormButton>
						<FormButton onClick={ this.cancelEmail }  isPrimary={ false } >
							{ this.translate( 'Cancel' ) }
						</FormButton>
					</FormButtonsBar>
				</div>
			);
		}

		return(
			<FormButton onClick={ this.addEmail } isPrimary={ false } >
				{ this.translate( 'Add Email' ) }
			</FormButton>
		);
	},

	render: function() {
		return (
			<div>
				{ this.renderRecoveryEmails() }
				{ this.renderRecoveryEmailActions() }
			</div>
		);
	}
} );