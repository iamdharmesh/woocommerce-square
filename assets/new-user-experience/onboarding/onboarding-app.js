/**
 * External dependencies.
 */
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { getPaymentGatewaySettingsData } from '../utils';
import {
	BusinessLocation,
	CashAppSetup,
	ConnectSetup,
	CreditCardSetup,
	DigitalWalletsSetup,
	GiftCardSetup,
	PaymentMethods,
} from './steps';

export const OnboardingApp = ( { step } ) => {

	return (
		<>
			{/* { step === 'start' && <ConnectSetup /> } */}
			{ step === 'start' && <BusinessLocation /> }
			{ step === 'credit-card' && <CreditCardSetup /> }
			{ step === 'digital-wallets' && <DigitalWalletsSetup /> }
			{ step === 'gift-card' && <GiftCardSetup /> }
			{ step === 'cash-app' && <CashAppSetup /> }
			{ step === 'payment-methods' && <PaymentMethods /> }
		</>
	)
};
