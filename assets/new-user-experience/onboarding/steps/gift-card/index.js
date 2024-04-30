/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import {
	Section,
	SectionTitle,
	SectionDescription,
	InputWrapper,
} from '../../../components';
import { usePaymentGatewaySettings } from '../../hooks';

export const GiftCardSetup = () => {
	const {
		giftCardsGatewaySettingsLoaded,
		giftCardsGatewaySettings,
		setGiftCardData,
	} = usePaymentGatewaySettings();

	const {
		enabled
	} = giftCardsGatewaySettings;

	if ( ! giftCardsGatewaySettingsLoaded ) {
		return null;
	}

	return (
		<>
			<Section>
				<SectionTitle title={ __( 'Gift Cards', 'woocommerce-square' ) } />
				<SectionDescription>
					{ __( 'You can receive payments with Square Gift Cards and sell Square Gift Cards by enabling the Gift Cards option here.', 'woocommerce-square' ) }
				</SectionDescription>

				<div className='woo-square-wizard__fields'>
					<InputWrapper
						label={ __( 'Enable Gift Cards', 'woocommerce-square' ) }
						variant="boxed"
					>
						<ToggleControl
							data-testid="gift-card-gateway-toggle-field"
							checked={ 'yes' === enabled }
							onChange={ ( enabled ) => setGiftCardData( { enabled: enabled ? 'yes' : 'no' } ) }
						/>
					</InputWrapper>
				</div>
			</Section>
		</>
	);
};
